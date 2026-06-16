from app.database import engine, Base
from app.models.user import User
from app.models.resume import Resume
from app.models.job import Job
from app.models.application import Application
from app.utils.security import get_password_hash
from sqlalchemy.orm import Session
from app.database import SessionLocal
import json

print("🚀 Configurando banco de dados...")

# Criar tabelas
Base.metadata.create_all(bind=engine)
print("✅ Tabelas criadas")

db = SessionLocal()

# Criar recrutador
recruiter = User(
    username="recrutador",
    email="recrutador@sva.com",
    full_name="Recrutador SVA",
    hashed_password=get_password_hash("123456"),
    user_type="recruiter"
)
db.add(recruiter)
db.flush()
print("✅ Recrutador criado")

# Criar candidato
candidate = User(
    username="candidato",
    email="candidato@sva.com",
    full_name="Candidato SVA",
    hashed_password=get_password_hash("123456"),
    user_type="candidate"
)
db.add(candidate)
db.flush()
print("✅ Candidato criado")

# Criar currículo do candidato
resume = Resume(
    user_id=candidate.id,
    title="Currículo Candidato SVA",
    skills='["Python", "JavaScript", "React"]',
    experience='["Empresa ABC - Desenvolvedor"]',
    education='["Universidade XYZ"]',
    raw_text="Experiência em desenvolvimento web"
)
db.add(resume)
db.flush()
print("✅ Currículo criado")

# Criar vagas
jobs = [
    Job(title="Dev Full Stack Java", company="NÓS", description="Vaga Java", location="Remoto", salary_range="R$ 12.000", recruiter_id=recruiter.id, is_active=1),
    Job(title="Full Stack Python", company="Eles", description="Vaga Python", location="Remoto", salary_range="R$ 15.000", recruiter_id=recruiter.id, is_active=1),
    Job(title="Analista de RH", company="Recurso ultra Humanos", description="Vaga RH", location="Pirapora-MG", salary_range="R$ 7.800", recruiter_id=recruiter.id, is_active=1),
]

for job in jobs:
    db.add(job)
db.flush()
print(f"✅ {len(jobs)} vagas criadas")

# Criar APENAS UMA candidatura para a primeira vaga (Java)
application = Application(
    job_id=jobs[0].id,  # Apenas a primeira vaga (Java)
    candidate_id=candidate.id,
    resume_id=resume.id,
    compatibility_score=20.0,
    status="pending"
)
db.add(application)
db.commit()
print("✅ Candidatura criada (apenas para a vaga Java)")

# Verificar
print(f"\n📊 Resumo:")
print(f"   Vagas: {len(jobs)}")
print(f"   Candidaturas: {db.query(Application).count()}")
print(f"   Candidatura está na vaga: {jobs[0].title}")

db.close()

print("\n🎉 Banco configurado com dados corretos!")
print("\n📋 Credenciais:")
print("   Recrutador: recrutador / 123456")
print("   Candidato: candidato / 123456")
print("\n💡 A candidatura está apenas na vaga: Dev Full Stack Java")
