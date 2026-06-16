from app.database import engine, Base
from app.models.user import User
from app.models.resume import Resume
from app.models.job import Job
from app.models.application import Application
from app.utils.security import get_password_hash
from sqlalchemy.orm import Session
from app.database import SessionLocal

print("🚀 Configurando banco de dados...")

# Criar tabelas
Base.metadata.create_all(bind=engine)
print("✅ Tabelas criadas")

db = SessionLocal()

# Criar recrutador
print("👔 Criando recrutador...")
recruiter = db.query(User).filter(User.username == "recrutador").first()
if not recruiter:
    recruiter = User(
        username="recrutador",
        email="recrutador@sva.com",
        full_name="Recrutador SVA",
        hashed_password=get_password_hash("123456"),
        user_type="recruiter"
    )
    db.add(recruiter)
    db.commit()
    print("✅ Recrutador criado")

# Criar candidato
print("👨‍💻 Criando candidato...")
candidate = db.query(User).filter(User.username == "candidato").first()
if not candidate:
    candidate = User(
        username="candidato",
        email="candidato@sva.com",
        full_name="Candidato SVA",
        hashed_password=get_password_hash("123456"),
        user_type="candidate"
    )
    db.add(candidate)
    db.commit()
    print("✅ Candidato criado")

# Criar algumas vagas
print("💼 Criando vagas...")
if db.query(Job).count() == 0:
    jobs = [
        Job(title="Desenvolvedor Full Stack", company="Tech Corp", description="Vaga para desenvolvedor full stack", location="Remoto", salary_range="R$ 8.000 - R$ 12.000", recruiter_id=recruiter.id),
        Job(title="Analista de Dados", company="Data Inc", description="Vaga para analista de dados", location="São Paulo", salary_range="R$ 7.000 - R$ 10.000", recruiter_id=recruiter.id),
        Job(title="Product Manager", company="Startup XYZ", description="Vaga para product manager", location="Remoto", salary_range="R$ 10.000 - R$ 15.000", recruiter_id=recruiter.id),
    ]
    for job in jobs:
        db.add(job)
    db.commit()
    print("✅ Vagas criadas")

db.close()

print("\n🎉 Banco configurado!")
print("\n📋 Credenciais:")
print("   Recrutador: recrutador / 123456")
print("   Candidato: candidato / 123456")
