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
        raise HTTPException(status_code=403, detail="Only candidates can apply to jobs")
    
    # Verificar se já existe candidatura
    existing = db.query(Application).filter(
        Application.job_id == application.job_id,
        Application.candidate_id == current_user.id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Already applied to this job")
    
    # Buscar resume e job
    resume = db.query(Resume).filter(Resume.id == application.resume_id).first()
    job = db.query(Job).filter(Job.id == application.job_id).first()
    
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Verificar se o resume pertence ao candidato
    if resume.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Resume does not belong to you")
    
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
    
    # Calcular compatibilidade usando IA
    compatibility_score, match_result = AIMatcher.calculate_compatibility(resume_data, job_data)
    
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

@router.get("/my", response_model=List[ApplicationResponse])
def get_my_applications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    applications = db.query(Application).filter(Application.candidate_id == current_user.id).all()
    return applications

@router.get("/job/{job_id}", response_model=List[dict])
def get_job_applications(
    job_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    if job.recruiter_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    applications = db.query(Application).filter(Application.job_id == job_id).order_by(Application.compatibility_score.desc()).all()
    
    result = []
    for app in applications:
        candidate = db.query(User).filter(User.id == app.candidate_id).first()
        app_dict = {
            "id": app.id,
            "job_id": app.job_id,
            "candidate_id": app.candidate_id,
            "resume_id": app.resume_id,
            "status": app.status,
            "compatibility_score": app.compatibility_score,
            "applied_at": app.applied_at,
            "candidate_name": candidate.full_name if candidate else f"Candidato #{app.candidate_id}"
        }
        result.append(app_dict)
    
    return result

@router.put("/{application_id}/status")
def update_application_status(
    application_id: int,
    status: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    application = db.query(Application).filter(Application.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    job = db.query(Job).filter(Job.id == application.job_id).first()
    if job.recruiter_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    application.status = status
    db.commit()
    
    return {"message": f"Application status updated to {status}"}
