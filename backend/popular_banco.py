# Script para criar banco e popular com dados
from app.database import engine, Base, SessionLocal
from app.models.user import User
from app.models.resume import Resume
from app.models.job import Job
from app.models.application import Application
from app.utils.security import get_password_hash
from app.services.ai_matcher import AIMatcher

# Criar todas as tabelas
Base.metadata.create_all(bind=engine)
print("✅ Tabelas criadas")

db = SessionLocal()

# Criar usuários
print("\n📝 Criando usuários...")
users = [
    User(
        email="recrutador@teste.com",
        username="recrutador",
        hashed_password=get_password_hash("123456"),
        full_name="Recrutador Teste",
        user_type="recruiter"
    ),
    User(
        email="adan@teste.com",
        username="adan",
        hashed_password=get_password_hash("123456"),
        full_name="Adan William",
        user_type="candidate"
    ),
]

for user in users:
    existing = db.query(User).filter(User.username == user.username).first()
    if not existing:
        db.add(user)
db.commit()
print(f"  ✅ {len(users)} usuários criados")

# Buscar IDs dos usuários
recrutador = db.query(User).filter(User.username == "recrutador").first()
candidato = db.query(User).filter(User.username == "adan").first()

# Criar currículo
print("\n📄 Criando currículo...")
resume = Resume(
    user_id=candidato.id,
    title="Desenvolvedor Full Stack",
    skills='["Python", "JavaScript", "React", "Node.js", "SQL"]',
    experience='["Empresa ABC - Desenvolvedor Full Stack (2022-2024)"]',
    education='["Universidade XYZ - Bacharelado em Computação"]',
    raw_text="Experiência com desenvolvimento web, APIs REST, bancos de dados SQL e NoSQL. Conhecimento em React, Node.js e Python."
)
db.add(resume)
db.commit()
print("  ✅ Currículo criado")

# Criar vagas
print("\n💼 Criando vagas...")
jobs_data = [
    {
        "title": "Dev full stack JAVA",
        "company": "NÓS",
        "description": "FULL STACK FULL REMOTE com Java",
        "requirements": '["Java 11+", "Spring Boot", "React", "SQL"]',
        "skills_required": '["Java", "Spring", "React", "SQL"]',
        "location": "Remoto",
        "salary_range": "12.000",
        "recruiter_id": recrutador.id
    },
    {
        "title": "Full Stack Python",
        "company": "Eles",
        "description": "Full Stack Python com Django e React",
        "requirements": '["Python", "Django", "React", "PostgreSQL"]',
        "skills_required": '["Python", "Django", "React", "SQL"]',
        "location": "Remoto",
        "salary_range": "15000",
        "recruiter_id": recrutador.id
    },
    {
        "title": "Analista de RH",
        "company": "Recurso ultra Humanos",
        "description": "Cuidar de toda a parte do RH",
        "requirements": '["Administração", "Recursos Humanos", "Excel"]',
        "skills_required": '["Administração", "RH", "Excel"]',
        "location": "Pirapora-MG",
        "salary_range": "7.800",
        "recruiter_id": recrutador.id
    }
]

jobs = []
for job_data in jobs_data:
    job = Job(**job_data)
    db.add(job)
    jobs.append(job)
db.commit()
print(f"  ✅ {len(jobs)} vagas criadas")

# Criar candidaturas com IA
print("\n🤖 Calculando compatibilidade...")
for job in jobs:
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
    
    score, match_result = AIMatcher.calculate_compatibility(resume_data, job_data)
    
    application = Application(
        job_id=job.id,
        resume_id=resume.id,
        candidate_id=candidato.id,
        compatibility_score=score,
        status="pending"
    )
    db.add(application)
    print(f"  ✅ {job.title}: Score {score}% - {match_result['feedback'][:50]}...")

db.commit()
print("\n🎉 Banco de dados populado com sucesso!")

# Resumo final
print("\n📊 RESUMO FINAL:")
print(f"  👤 Usuários: {db.query(User).count()}")
print(f"  📄 Currículos: {db.query(Resume).count()}")
print(f"  💼 Vagas: {db.query(Job).count()}")
print(f"  📝 Candidaturas: {db.query(Application).count()}")

db.close()
