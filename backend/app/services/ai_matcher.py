import json
import re
import difflib
from typing import Dict, List, Tuple

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Stopwords em português (mantidas do matcher original + algumas comuns)
PT_STOPWORDS = [
    'a', 'e', 'o', 'que', 'de', 'da', 'do', 'em', 'um', 'para', 'com', 'não', 'uma', 'os', 'as',
    'seu', 'sua', 'seus', 'suas', 'por', 'mais', 'menos', 'muito', 'pouco', 'todo', 'toda',
    'sempre', 'nunca', 'cada', 'como', 'quando', 'onde', 'quem', 'porque', 'então', 'assim',
    'mas', 'ou', 'pois', 'se', 'já', 'ainda', 'também', 'apenas', 'sob', 'sobre', 'após',
    'antes', 'durante', 'dentro', 'fora', 'sem', 'entre', 'através', 'contra',
    'depois', 'novo', 'nova', 'antigo', 'antiga', 'grande', 'pequeno', 'melhor', 'pior',
    'bom', 'ruim', 'ser', 'estar', 'ter', 'haver', 'poder', 'dever', 'querer', 'fazer',
    'ano', 'anos', 'trabalho', 'empresa', 'empresas', 'cargo', 'equipe', 'projeto', 'projetos',
    'nos', 'na', 'no', 'às', 'ao', 'aos', 'pelo', 'pela', 'este', 'esta', 'isso', 'aquele',
    'aquela', 'the', 'and', 'for', 'with',
]


class AIMatcher:
    """
    Motor de compatibilidade candidato x vaga.

    Evolução em relação à versão anterior (overlap simples de palavras-chave):
      - similaridade textual calculada com TF-IDF + cosseno, que pondera
        termos raros/relevantes com mais peso e ignora ruído comum;
      - correspondência de habilidades com matching difuso (difflib), que
        reconhece variações como "Spring" ~ "Spring Boot" ou pequenos erros
        de digitação, em vez de exigir substring exata.

    Não depende de nenhuma API externa - roda 100% local com scikit-learn.
    """

    FUZZY_MATCH_THRESHOLD = 0.75  # 0-1, quão parecidas duas skills precisam ser

    @staticmethod
    def extract_keywords(text: str) -> List[str]:
        """Extrai palavras-chave relevantes do texto (usado em contextos simples,
        fora do pipeline de TF-IDF)."""
        if not text:
            return []
        text = text.lower()
        text = re.sub(r'[^\w\s]', ' ', text)
        words = text.split()
        return [w for w in words if w not in PT_STOPWORDS and len(w) > 2]

    @staticmethod
    def parse_json_field(field_str) -> List[str]:
        """Converte campo JSON (ou string separada por vírgula) para lista."""
        if not field_str:
            return []
        try:
            data = json.loads(field_str)
            if isinstance(data, list):
                return [str(x) for x in data]
            elif isinstance(data, str):
                return [data]
            return []
        except (json.JSONDecodeError, TypeError):
            if isinstance(field_str, str):
                return [item.strip() for item in field_str.split(',') if item.strip()]
            return []

    @staticmethod
    def _skills_similar(a: str, b: str) -> float:
        """Similaridade difusa entre dois nomes de skill (0-1)."""
        a, b = a.lower().strip(), b.lower().strip()
        if not a or not b:
            return 0.0
        if a == b or a in b or b in a:
            return 1.0
        return difflib.SequenceMatcher(None, a, b).ratio()

    @staticmethod
    def calculate_skill_match(resume_skills: List[str], job_skills: List[str]) -> Tuple[float, List[str]]:
        """
        Calcula % de habilidades da vaga cobertas pelo currículo, usando
        matching difuso em vez de substring exata. Retorna também a lista de
        skills da vaga que foram encontradas.
        """
        if not job_skills:
            return 0.0, []

        matched_job_skills = []
        for job_skill in job_skills:
            best_ratio = max(
                (AIMatcher._skills_similar(job_skill, r) for r in resume_skills),
                default=0.0,
            )
            if best_ratio >= AIMatcher.FUZZY_MATCH_THRESHOLD:
                matched_job_skills.append(job_skill)

        score = (len(matched_job_skills) / len(job_skills)) * 100
        return score, matched_job_skills

    @staticmethod
    def calculate_text_similarity(resume_text: str, job_text: str) -> float:
        """
        Similaridade semântica aproximada via TF-IDF + cosseno entre o texto
        completo do currículo e da vaga. Substitui o antigo overlap bruto de
        palavras, que tratava "python" e "pythonico" como termos distintos e
        dava peso igual a palavras comuns e raras.
        """
        resume_text = (resume_text or "").strip()
        job_text = (job_text or "").strip()
        if not resume_text or not job_text:
            return 0.0

        try:
            vectorizer = TfidfVectorizer(
                stop_words=PT_STOPWORDS,
                ngram_range=(1, 2),
                min_df=1,
            )
            tfidf_matrix = vectorizer.fit_transform([resume_text, job_text])
            similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
            return round(float(similarity) * 100, 2)
        except ValueError:
            # Corpus vazio após remoção de stopwords, por exemplo
            return 0.0

    @staticmethod
    def calculate_compatibility(resume_data: Dict, job_data: Dict) -> Tuple[float, Dict]:
        """Calcula o score de compatibilidade completo entre currículo e vaga."""
        resume_skills = AIMatcher.parse_json_field(resume_data.get('skills', ''))
        job_skills = AIMatcher.parse_json_field(job_data.get('skills_required', ''))

        resume_experience = AIMatcher.parse_json_field(resume_data.get('experience', ''))
        resume_education = AIMatcher.parse_json_field(resume_data.get('education', ''))

        resume_full_text = (
            f"{' '.join(resume_skills)} {' '.join(resume_experience)} "
            f"{' '.join(resume_education)} {resume_data.get('raw_text', '')}"
        )
        job_full_text = (
            f"{job_data.get('title', '')} {job_data.get('description', '')} "
            f"{' '.join(job_skills)} {job_data.get('requirements', '')}"
        )

        skill_score, matched_skills = AIMatcher.calculate_skill_match(resume_skills, job_skills)
        text_score = AIMatcher.calculate_text_similarity(resume_full_text, job_full_text)

        weights = {'skills': 0.6, 'text_similarity': 0.4}
        final_score = (skill_score * weights['skills']) + (text_score * weights['text_similarity'])
        final_score = round(min(final_score, 100), 2)

        total_skills = len(job_skills)
        matched_count = len(matched_skills)

        if final_score >= 80:
            feedback = "Excelente compatibilidade! O candidato é altamente recomendado."
        elif final_score >= 60:
            feedback = f"Boa compatibilidade. {matched_count}/{total_skills} habilidades correspondentes."
        elif final_score >= 40:
            feedback = f"Compatibilidade moderada. {matched_count}/{total_skills} habilidades correspondem."
        else:
            feedback = "Baixa compatibilidade. O candidato pode não ser adequado."

        breakdown = {
            "skill_match": round(skill_score, 2),
            "text_similarity": round(text_score, 2),
            "matched_skills": matched_count,
            "total_skills": total_skills,
            "matched_skill_names": matched_skills,
            "job_skills": job_skills,
            "resume_skills": resume_skills,
        }

        return final_score, {"score": final_score, "breakdown": breakdown, "feedback": feedback}
