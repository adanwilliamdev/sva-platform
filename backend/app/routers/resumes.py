from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.user import User
from app.models.resume import Resume
from app.schemas.resume import ResumeResponse
from app.routers.auth import get_current_user
from app.services.file_processor import FileProcessor
import json
import os

router = APIRouter(prefix="/resumes", tags=["resumes"])

@router.post("/", response_model=ResumeResponse)
async def create_resume(
    title: str = Form(...),
    skills: Optional[str] = Form(None),
    experience: Optional[str] = Form(None),
    education: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.user_type != "candidate":
        raise HTTPException(status_code=403, detail="Only candidates can create resumes")
    
    raw_text = ""
    file_url = None
    file_name = None
    
    if file:
        file_path = await FileProcessor.save_file(file, current_user.id, file.filename)
        file_url = file_path
        file_name = file.filename
        raw_text = FileProcessor.extract_text(file_path)
    
    if not raw_text and skills:
        try:
            skills_list = json.loads(skills) if skills else []
            raw_text = " ".join(skills_list)
        except:
            raw_text = skills or ""
    
    db_resume = Resume(
        title=title,
        skills=skills,
        experience=experience,
        education=education,
        raw_text=raw_text,
        file_url=file_url,
        file_name=file_name,
        user_id=current_user.id
    )
    
    db.add(db_resume)
    db.commit()
    db.refresh(db_resume)
    return db_resume

@router.get("/", response_model=List[ResumeResponse])
def get_user_resumes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resumes = db.query(Resume).filter(Resume.user_id == current_user.id).all()
    return resumes

# ROTA PARA BUSCAR CURRÍCULO POR ID
@router.get("/{resume_id}", response_model=ResumeResponse)
def get_resume_by_id(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    # Recrutadores podem ver currículos de candidatos que se candidataram
    if current_user.user_type == "recruiter":
        return resume
    
    # Candidatos só podem ver seus próprios currículos
    if resume.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return resume

@router.delete("/{resume_id}")
def delete_resume(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    if resume.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db.delete(resume)
    db.commit()
    
    return {"message": "Resume deleted successfully"}
