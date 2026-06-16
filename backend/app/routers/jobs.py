from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.user import User
from app.models.job import Job
from app.schemas.job import JobCreate, JobResponse
from app.routers.auth import get_current_user

router = APIRouter(prefix="/jobs", tags=["jobs"])

@router.post("/", response_model=JobResponse)
def create_job(
    job: JobCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.user_type != "recruiter":
        raise HTTPException(status_code=403, detail="Only recruiters can post jobs")
    
    db_job = Job(**job.model_dump(), recruiter_id=current_user.id)
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job

@router.get("/", response_model=List[JobResponse])
def get_jobs(
    skip: int = 0,
    limit: int = 100,
    active_only: bool = True,
    db: Session = Depends(get_db)
):
    query = db.query(Job)
    if active_only:
        query = query.filter(Job.is_active == 1)
    jobs = query.offset(skip).limit(limit).all()
    return jobs

@router.get("/recruiter", response_model=List[JobResponse])
def get_recruiter_jobs(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.user_type != "recruiter":
        raise HTTPException(status_code=403, detail="Only recruiters can access")
    jobs = db.query(Job).filter(Job.recruiter_id == current_user.id).all()
    return jobs

@router.get("/{job_id}", response_model=JobResponse)
def get_job_by_id(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

# ROTA PARA ATUALIZAR STATUS DA VAGA (ENCERRAR/REABRIR)
@router.put("/{job_id}")
def update_job_status(
    job_id: int,
    is_active: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    if job.recruiter_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    job.is_active = is_active
    db.commit()
    
    status_text = "encerrada" if is_active == 0 else "reativada"
    return {"message": f"Vaga {status_text} com sucesso"}
