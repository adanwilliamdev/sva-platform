import json
import re
from typing import Dict, List, Tuple

class AIMatcher:
    @staticmethod
    def extract_keywords(text: str) -> List[str]:
        """Extrai palavras-chave importantes do texto"""
        if not text:
            return []
        
        text = text.lower()
        # Remove caracteres especiais
        text = re.sub(r'[^\w\s]', ' ', text)
        
        # Stopwords em português
        stopwords = {
            'a', 'e', 'o', 'que', 'de', 'da', 'do', 'em', 'um', 'para', 'com', 'não', 'uma', 'os', 'as',
            'seu', 'sua', 'seus', 'suas', 'para', 'por', 'mais', 'menos', 'muito', 'pouco', 'todo',
            'sempre', 'nunca', 'cada', 'como', 'quando', 'onde', 'quem', 'porque', 'então', 'assim',
            'mas', 'ou', 'pois', 'se', 'já', 'ainda', 'também', 'apenas', 'sob', 'sobre', 'após',
            'antes', 'durante', 'dentro', 'fora', 'sem', 'com', 'entre', 'através', 'contra',
            'depois', 'novo', 'nova', 'antigo', 'antiga', 'grande', 'pequeno', 'melhor', 'pior',
            'bom', 'ruim', 'ser', 'estar', 'ter', 'haver', 'poder', 'dever', 'querer', 'fazer',
            'ano', 'anos', 'trabalho', 'empresa', 'empresas', 'cargo', 'equipe', 'projeto', 'projetos',
            'desenvolvimento', 'experiência', 'formação', 'curso', 'universidade', 'faculdade'
        }
        
        words = text.split()
        keywords = [w for w in words if w not in stopwords and len(w) > 2]
        return keywords
    
    @staticmethod
    def parse_json_field(field_str: str) -> List[str]:
        """Converte campo JSON para lista"""
        if not field_str:
            return []
        
        try:
            data = json.loads(field_str)
            if isinstance(data, list):
                return data
            elif isinstance(data, str):
                return [data]
            else:
                return []
        except:
            if isinstance(field_str, str):
                return [item.strip() for item in field_str.split(',') if item.strip()]
            return []
    
    @staticmethod
    def calculate_skill_match(resume_skills: List[str], job_skills: List[str]) -> float:
        """Calcula a porcentagem de match entre habilidades"""
        if not job_skills:
            return 0.0
        
        resume_skills_lower = [s.lower().strip() for s in resume_skills]
        job_skills_lower = [s.lower().strip() for s in job_skills]
        
        matched = 0
        for job_skill in job_skills_lower:
            for resume_skill in resume_skills_lower:
                if job_skill in resume_skill or resume_skill in job_skill:
                    matched += 1
                    break
        
        return (matched / len(job_skills_lower)) * 100
    
    @staticmethod
    def calculate_text_similarity(resume_text: str, job_text: str) -> float:
        """Calcula similaridade de texto entre currículo e vaga"""
        if not resume_text or not job_text:
            return 0.0
        
        resume_keywords = set(AIMatcher.extract_keywords(resume_text))
        job_keywords = set(AIMatcher.extract_keywords(job_text))
        
        if not job_keywords:
            return 0.0
        
        common_keywords = resume_keywords.intersection(job_keywords)
        similarity = (len(common_keywords) / len(job_keywords)) * 100
        
        return min(similarity, 100)
    
    @staticmethod
    def calculate_compatibility(resume_data: Dict, job_data: Dict) -> Tuple[float, Dict]:
        """Calcula o score de compatibilidade completo"""
        
        # Extrair habilidades
        resume_skills = AIMatcher.parse_json_field(resume_data.get('skills', ''))
        job_skills = AIMatcher.parse_json_field(job_data.get('skills_required', ''))
        
        # Extrair experiência e educação
        resume_experience = AIMatcher.parse_json_field(resume_data.get('experience', ''))
        resume_education = AIMatcher.parse_json_field(resume_data.get('education', ''))
        
        # Texto completo para análise
        resume_full_text = f"{' '.join(resume_skills)} {' '.join(resume_experience)} {' '.join(resume_education)} {resume_data.get('raw_text', '')}"
        job_full_text = f"{job_data.get('title', '')} {job_data.get('description', '')} {' '.join(job_skills)}"
        
        # Calcular scores
        skill_score = AIMatcher.calculate_skill_match(resume_skills, job_skills)
        text_score = AIMatcher.calculate_text_similarity(resume_full_text, job_full_text)
        
        # Pesos para cada componente
        weights = {
            'skills': 0.6,  # Peso maior para habilidades
            'text_similarity': 0.4
        }
        
        # Calcular score final
        final_score = (skill_score * weights['skills']) + (text_score * weights['text_similarity'])
        final_score = round(min(final_score, 100), 2)
        
        # Feedback personalizado
        if final_score >= 80:
            feedback = "Excelente compatibilidade! O candidato é altamente recomendado."
        elif final_score >= 60:
            matched_skills = sum(1 for skill in job_skills if skill.lower() in [s.lower() for s in resume_skills])
            feedback = f"Boa compatibilidade. {matched_skills}/{len(job_skills)} habilidades correspondentes."
        elif final_score >= 40:
            matched_skills = sum(1 for skill in job_skills if skill.lower() in [s.lower() for s in resume_skills])
            feedback = f"Compatibilidade moderada. {matched_skills}/{len(job_skills)} habilidades correspondem."
        else:
            feedback = "Baixa compatibilidade. O candidato pode não ser adequado."
        
        breakdown = {
            "skill_match": round(skill_score, 2),
            "text_similarity": round(text_score, 2),
            "matched_skills": sum(1 for skill in job_skills if skill.lower() in [s.lower() for s in resume_skills]),
            "total_skills": len(job_skills),
            "job_skills": job_skills,
            "resume_skills": resume_skills
        }
        
        return final_score, {"score": final_score, "breakdown": breakdown, "feedback": feedback}
