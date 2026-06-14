from app.database import SessionLocal
from app.models.application import Application
from app.models.job import Job
from app.models.resume import Resume
from app.services.ai_matcher import AIMatcher

db = SessionLocal()

# Buscar todas as candidaturas
applications = db.query(Application).all()
print(f'Atualizando {len(applications)} candidaturas...\n')

for app in applications:
    resume = db.query(Resume).filter(Resume.id == app.resume_id).first()
    job = db.query(Job).filter(Job.id == app.job_id).first()
    
    if resume and job:
        resume_data = {
            'skills': resume.skills,
            'experience': resume.experience,
            'education': resume.education,
            'raw_text': resume.raw_text
        }
        
        job_data = {
            'title': job.title,
            'description': job.description,
            'skills_required': job.skills_required,
            'requirements': job.requirements
        }
        
        # Calcular novo score
        new_score, match_result = AIMatcher.calculate_compatibility(resume_data, job_data)
        
        old_score = app.compatibility_score
        print(f'Vaga: {job.title}')
        print(f'  Score antigo: {old_score}% -> Novo score: {new_score}%')
        print(f'  Feedback: {match_result["feedback"]}\n')
        
        # Atualizar
        app.compatibility_score = new_score

# Salvar todas as alterações
db.commit()
print('✅ Todas as candidaturas foram atualizadas com sucesso!')
db.close()
