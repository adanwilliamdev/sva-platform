import os
import sys
from app.database import SessionLocal, engine
from app.models import Base
from app.models.user import User
from app.models.resume import Resume
from app.models.job import Job
from app.models.application import Application
from app.utils.security import get_password_hash
from app.services.ai_matcher import AIMatcher
import json

def seed_database():
    print('🚀 Iniciando população do banco de dados...')
    
    # Criar tabelas se não existirem
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Verificar se já existem usuários
        existing_user = db.query(User).filter_by(username='recrutador').first()
        if existing_user:
            print('⚠️  Banco já populado. Pulando seed...')
            return
        
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

        # Criar currículo
        print('📄 Criando currículo...')
        resume = Resume(
            user_id=candidato.id,
            title='Desenvolvedor Java',
            skills=json.dumps(["Java", "Spring Boot", "React", "SQL", "JavaScript", "Docker", "AWS"]),
            experience=json.dumps(["Empresa XPTO - Desenvolvedor Java (2022-2024)"]),
            education=json.dumps(["Universidade Federal - Bacharelado em Computação"]),
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
                'skills_required': json.dumps(["Java", "Spring Boot", "React", "SQL"]),
                'requirements': json.dumps(["Experiência com Java 8+", "Conhecimento em Spring Boot"]),
                'location': 'Remoto',
                'salary_range': 'R$ 8.000 - R$ 12.000',
                'recruiter_id': recrutador.id
            },
            {
                'title': 'Desenvolvedor Python Pleno',
                'company': 'DataLab',
                'description': 'Vaga para desenvolvedor Python com Django',
                'skills_required': json.dumps(["Python", "Django", "PostgreSQL"]),
                'requirements': json.dumps(["Experiência com Django", "Conhecimento em PostgreSQL"]),
                'location': 'São Paulo',
                'salary_range': 'R$ 7.000 - R$ 10.000',
                'recruiter_id': recrutador.id
            },
            {
                'title': 'Analista de Dados',
                'company': 'DataCorp',
                'description': 'Vaga para analista de dados com SQL e Python',
                'skills_required': json.dumps(["SQL", "Python", "Power BI"]),
                'requirements': json.dumps(["Experiência com SQL", "Conhecimento em Power BI"]),
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
        
        # Buscar dados atualizados
        resumes = db.query(Resume).filter_by(user_id=candidato.id).all()
        jobs = db.query(Job).all()
        
        for resume in resumes:
            resume_data = {
                'skills': json.loads(resume.skills) if resume.skills else [],
                'experience': json.loads(resume.experience) if resume.experience else [],
                'education': json.loads(resume.education) if resume.education else [],
                'raw_text': resume.raw_text or ''
            }
            
            for job in jobs:
                job_data = {
                    'title': job.title,
                    'description': job.description,
                    'skills_required': json.loads(job.skills_required) if job.skills_required else [],
                    'requirements': json.loads(job.requirements) if job.requirements else []
                }
                
                # Verificar se o método existe, senão criar um cálculo simples
                try:
                    score, match_result = AIMatcher.calculate_compatibility(resume_data, job_data)
                except:
                    # Fallback: cálculo simples baseado em skills
                    score = calculate_simple_score(resume_data.get('skills', []), job_data.get('skills_required', []))
                
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
        print('\n🎉 Banco populado com dados de teste!')
        print('\n📋 Credenciais:')
        print('   Recrutador: recrutador / 123456')
        print('   Candidato: adan / 123456')
        
    except Exception as e:
        print(f'❌ Erro ao popular banco: {e}')
        db.rollback()
    finally:
        db.close()

def calculate_simple_score(candidate_skills, job_skills):
    """Cálculo simples de compatibilidade para fallback"""
    if not candidate_skills or not job_skills:
        return 0
    
    candidate_set = set(skill.lower() for skill in candidate_skills)
    job_set = set(skill.lower() for skill in job_skills)
    
    if not job_set:
        return 0
    
    matches = len(candidate_set.intersection(job_set))
    return int((matches / len(job_set)) * 100)

if __name__ == "__main__":
    seed_database()