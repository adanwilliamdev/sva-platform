from app.database import SessionLocal
from app.models.user import User
from app.models.resume import Resume
from app.models.job import Job
from app.models.application import Application
from app.utils.security import get_password_hash
from app.services.ai_matcher import AIMatcher

db = SessionLocal()

# Criar usuários
print('👤 Criando usuários...')
recrutador = User(
    username='recrutador',
    email='recrutador@teste.com',
    full_name='Recrutador Teste',
    hashed_password=get_password_hash('123456'),
    user_type='recruiter'
)
db.add(recrutador)

candidato = User(
    username='adan',
    email='adan@teste.com',
    full_name='Adan William',
    hashed_password=get_password_hash('123456'),
    user_type='candidate'
)
db.add(candidato)
db.flush()
print('✅ Usuários criados')

# Criar currículo com habilidades Java
print('📄 Criando currículo...')
resume = Resume(
    user_id=candidato.id,
    title='Desenvolvedor Java',
    skills='["Java", "Spring Boot", "React", "SQL", "JavaScript", "Docker", "AWS"]',
    experience='["Empresa XPTO - Desenvolvedor Java (2022-2024)"]',
    education='["Universidade Federal - Bacharelado em Computação"]',
    raw_text='Experiência com desenvolvimento de aplicações web usando Java, Spring Boot, React, SQL e banco de dados.'
)
db.add(resume)
db.flush()
print('✅ Currículo criado')

# Criar vagas
print('💼 Criando vagas...')
jobs_data = [
    {
        'title': 'Desenvolvedor Java Full Stack',
        'company': 'TechNova Solutions',
        'description': 'Vaga para desenvolvedor Java com Spring Boot e React',
        'skills_required': '["Java", "Spring Boot", "React", "SQL"]',
        'location': 'Remoto',
        'salary_range': 'R$ 8.000 - R$ 12.000',
        'recruiter_id': recrutador.id
    },
    {
        'title': 'Desenvolvedor Python Pleno',
        'company': 'DataLab',
        'description': 'Vaga para desenvolvedor Python com Django',
        'skills_required': '["Python", "Django", "PostgreSQL"]',
        'location': 'São Paulo',
        'salary_range': 'R$ 7.000 - R$ 10.000',
        'recruiter_id': recrutador.id
    },
    {
        'title': 'Analista de Dados',
        'company': 'DataCorp',
        'description': 'Vaga para analista de dados com SQL e Python',
        'skills_required': '["SQL", "Python", "Power BI"]',
        'location': 'Remoto',
        'salary_range': 'R$ 6.000 - R$ 9.000',
        'recruiter_id': recrutador.id
    }
]

for job_data in jobs_data:
    job = Job(**job_data)
    db.add(job)
db.flush()
print('✅ Vagas criadas')

# Criar candidaturas com IA
print('🤖 Calculando scores de compatibilidade...')
resume_data = {
    'skills': resume.skills,
    'experience': resume.experience,
    'education': resume.education,
    'raw_text': resume.raw_text
}

jobs = db.query(Job).all()
for job in jobs:
    job_data = {
        'title': job.title,
        'description': job.description,
        'skills_required': job.skills_required,
        'requirements': job.requirements
    }
    
    score, match_result = AIMatcher.calculate_compatibility(resume_data, job_data)
    
    application = Application(
        job_id=job.id,
        resume_id=resume.id,
        candidate_id=candidato.id,
        compatibility_score=score,
        status='pending'
    )
    db.add(application)
    print(f'  ✅ {job.title}: {score}%')

db.commit()
db.close()

print('\n🎉 Banco populado com dados de teste!')
print('\n📋 Credenciais:')
print('   Recrutador: recrutador / 123456')
print('   Candidato: adan / 123456')
