from app.database import engine, Base
from app.models.user import User
from app.models.resume import Resume
from app.models.job import Job
from app.models.application import Application
from app.models.chat import Conversation, Message
from app.utils.security import get_password_hash
from sqlalchemy.orm import Session
from app.database import SessionLocal

print("🚀 Inicializando banco de dados...")

# Recriar todas as tabelas
print("📋 Criando tabelas...")
Base.metadata.drop_all(bind=engine)  # Remove todas as tabelas existentes
Base.metadata.create_all(bind=engine)  # Cria as tabelas novamente
print("✅ Tabelas criadas com sucesso!")

db = SessionLocal()

# Criar usuário recrutador
print("👔 Criando recrutador...")
recruiter = User(
    email="recrutador@teste.com",
    username="recrutador",
    hashed_password=get_password_hash("123456"),
    full_name="Recrutador Teste",
    user_type="recruiter",
    is_active=True
)
db.add(recruiter)
db.flush()
print(f"✅ Recrutador criado (ID: {recruiter.id})")

# Criar usuário candidato
print("👨‍💻 Criando candidato...")
candidate = User(
    email="adan@teste.com",
    username="adan",
    hashed_password=get_password_hash("123456"),
    full_name="Adan William",
    user_type="candidate",
    is_active=True
)
db.add(candidate)
db.flush()
print(f"✅ Candidato criado (ID: {candidate.id})")

# Criar algumas vagas de exemplo
print("💼 Criando vagas de exemplo...")
jobs_data = [
    {"title": "Dev full stack JAVA", "company": "NÓS", "description": "Vaga para desenvolvedor Java full stack com Spring Boot", "requirements": '["Java 11+", "Spring Boot", "React", "SQL"]', "skills_required": '["Java", "Spring", "React", "SQL"]', "location": "Remoto", "salary_range": "R$ 12.000", "is_active": 1, "recruiter_id": recruiter.id},
    {"title": "Full Stack Python", "company": "Eles", "description": "Vaga para desenvolvedor Python com Django e React", "requirements": '["Python", "Django", "React", "PostgreSQL"]', "skills_required": '["Python", "Django", "React", "SQL"]', "location": "Remoto", "salary_range": "R$ 15.000", "is_active": 1, "recruiter_id": recruiter.id},
    {"title": "Analista de RH", "company": "Recurso ultra Humanos", "description": "Analista de Recursos Humanos para gestão de pessoas", "requirements": '["Administração", "Recursos Humanos", "Excel"]', "skills_required": '["Administração", "RH", "Excel"]', "location": "Pirapora-MG", "salary_range": "R$ 7.800", "is_active": 1, "recruiter_id": recruiter.id},
]

for job_data in jobs_data:
    job = Job(**job_data)
    db.add(job)
db.commit()
print(f"✅ {len(jobs_data)} vagas criadas")

# Criar algumas candidaturas de exemplo
print("📝 Criando candidaturas de exemplo...")
applications_data = [
    {"job_id": 1, "candidate_id": candidate.id, "resume_id": 1, "compatibility_score": 75.0, "status": "pending"},
    {"job_id": 2, "candidate_id": candidate.id, "resume_id": 1, "compatibility_score": 65.0, "status": "accepted"},
    {"job_id": 3, "candidate_id": candidate.id, "resume_id": 1, "compatibility_score": 30.0, "status": "rejected"},
]

for app_data in applications_data:
    app = Application(**app_data)
    db.add(app)
db.commit()
print(f"✅ {len(applications_data)} candidaturas criadas")

db.close()
print("\n🎉 Banco de dados inicializado com sucesso!")
print("\n📋 Credenciais de acesso:")
print("   Recrutador: recrutador / 123456")
print("   Candidato: adan / 123456")
