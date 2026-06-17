from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.user import User
from app.models.application import Application
from app.models.job import Job
from app.models.resume import Resume
from app.schemas.application import ApplicationCreate, ApplicationResponse
from app.routers.auth import get_current_user
from app.services.ai_matcher import AIMatcher

router = APIRouter(prefix="/applications", tags=["applications"])

@router.post("/", response_model=ApplicationResponse)
def apply_to_job(
    application: ApplicationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.user_type != "candidate":
        raise HTTPException(status_code=403, detail="Only candidates can apply")
    
    # Verificar se já existe candidatura
    existing = db.query(Application).filter(
        Application.job_id == application.job_id,
        Application.candidate_id == current_user.id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Already applied")
    
    # Buscar resume e job
    resume = db.query(Resume).filter(Resume.id == application.resume_id).first()
    job = db.query(Job).filter(Job.id == application.job_id).first()
    
    if not resume or not job:
        raise HTTPException(status_code=404, detail="Resume or Job not found")
    
    # Preparar dados para IA
    resume_data = {
        "skills": resume.skills,
        "experience": resume.experience,
        "education": resume.education,
        "raw_text": resume.raw_text
    }
    
    job_data = {
        "title": job.title,
        "description": job.description,
        "skills_required": job.skills_required,
        "requirements": job.requirements
    }
    
    # Calcular compatibilidade com IA
    compatibility_score, match_result = AIMatcher.calculate_compatibility(resume_data, job_data)
    
    print(f"🤖 Score calculado: {compatibility_score}%")
    print(f"📊 Breakdown: {match_result['breakdown']}")
    
    # Criar candidatura
    db_application = Application(
        job_id=application.job_id,
        resume_id=application.resume_id,
        candidate_id=current_user.id,
        compatibility_score=compatibility_score,
        status="pending"
    )
    
    db.add(db_application)
    db.commit()
    db.refresh(db_application)
    
    return db_application

# ... resto do código
