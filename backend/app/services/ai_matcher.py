import json
import re
from typing import Dict, List, Tuple

class AIMatcher:
    @staticmethod
    def extract_keywords(text: str) -> List[str]:
        """Extract important keywords from text"""
        if not text:
            return []
        
        # Converter para minúsculas e remover caracteres especiais
        text = text.lower()
        text = re.sub(r'[^\w\s]', ' ', text)
        
        # Lista de stopwords em português
        stopwords = {
            'a', 'e', 'o', 'que', 'de', 'da', 'do', 'em', 'um', 'para', 'com', 'não', 'uma', 'os', 'as', 'seu', 'sua', 'seus', 'suas',
            'para', 'por', 'mais', 'menos', 'muito', 'pouco', 'todo', 'sempre', 'nunca', 'cada', 'como', 'quando', 'onde', 'quem',
            'porque', 'então', 'assim', 'mas', 'ou', 'pois', 'se', 'já', 'ainda', 'também', 'apenas', 'sob', 'sobre', 'após', 'antes',
            'durante', 'dentro', 'fora', 'sem', 'com', 'entre', 'através', 'contra', 'depois', 'novo', 'nova', 'antigo', 'antiga',
            'grande', 'pequeno', 'melhor', 'pior', 'bom', 'ruim', 'ser', 'estar', 'ter', 'haver', 'poder', 'dever', 'querer', 'fazer'
        }
        
        # Extrair palavras
        words = text.split()
        keywords = [w for w in words if w not in stopwords and len(w) > 2]
        
        return keywords
    
    @staticmethod
    def calculate_skill_match(resume_skills: List[str], job_skills: List[str]) -> float:
        """Calculate skill match percentage"""
        if not job_skills:
            return 0.0
        
        resume_skills_lower = [s.lower() for s in resume_skills]
        job_skills_lower = [s.lower() for s in job_skills]
        
        matched = sum(1 for skill in job_skills_lower if skill in resume_skills_lower)
        return (matched / len(job_skills_lower)) * 100
    
    @staticmethod
    def calculate_text_similarity(resume_text: str, job_text: str) -> float:
        """Calculate text similarity based on keyword matching"""
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
    def parse_json_field(field_str: str) -> List[str]:
        """Parse JSON string field to list"""
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
            # Se não for JSON, tratar como texto simples
            if isinstance(field_str, str):
                return [item.strip() for item in field_str.split(',') if item.strip()]
            return []
    
    @staticmethod
    def calculate_compatibility(resume_data: Dict, job_data: Dict) -> Tuple[float, Dict]:
        """Calculate comprehensive compatibility score between resume and job"""
        
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
            'skills': 0.5,
            'text_similarity': 0.5
        }
        
        # Calcular score final
        final_score = (skill_score * weights['skills']) + (text_score * weights['text_similarity'])
        final_score = round(min(final_score, 100), 2)
        
        # Determinar feedback baseado no score
        if final_score >= 80:
            feedback = "Excelente compatibilidade! O candidato é altamente recomendado para esta vaga."
        elif final_score >= 60:
            matched_skills = sum(1 for skill in job_skills if skill.lower() in [s.lower() for s in resume_skills])
            feedback = f"Boa compatibilidade. O candidato atende a maioria dos requisitos ({matched_skills}/{len(job_skills)} habilidades correspondentes)."
        elif final_score >= 40:
            matched_skills = sum(1 for skill in job_skills if skill.lower() in [s.lower() for s in resume_skills])
            feedback = f"Compatibilidade moderada. Apenas {matched_skills}/{len(job_skills)} habilidades correspondem. Considere revisar o currículo."
        else:
            feedback = "Baixa compatibilidade. O candidato pode não ser adequado para esta vaga no momento."
        
        breakdown = {
            "skill_match": round(skill_score, 2),
            "text_similarity": round(text_score, 2),
            "matched_skills": sum(1 for skill in job_skills if skill.lower() in [s.lower() for s in resume_skills]),
            "total_skills": len(job_skills),
            "job_skills": job_skills,
            "resume_skills": resume_skills
        }
        
        return final_score, {"score": final_score, "breakdown": breakdown, "feedback": feedback}
