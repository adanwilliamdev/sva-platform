from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.user import User
from app.models.job import Job
from app.models.favorite import Favorite
from app.routers.auth import get_current_user

router = APIRouter(prefix="/favorites", tags=["favorites"])

@router.post("/{job_id}")
def add_favorite(
    job_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.user_type != "candidate":
        raise HTTPException(status_code=403, detail="Only candidates can favorite jobs")
    
    existing = db.query(Favorite).filter(
        Favorite.user_id == current_user.id,
        Favorite.job_id == job_id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Job already favorited")
    
    favorite = Favorite(user_id=current_user.id, job_id=job_id)
    db.add(favorite)
    db.commit()
    
    return {"message": "Job added to favorites"}

@router.delete("/{job_id}")
def remove_favorite(
    job_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    favorite = db.query(Favorite).filter(
        Favorite.user_id == current_user.id,
        Favorite.job_id == job_id
    ).first()
    
    if not favorite:
        raise HTTPException(status_code=404, detail="Favorite not found")
    
    db.delete(favorite)
    db.commit()
    
    return {"message": "Job removed from favorites"}

@router.get("/", response_model=List[dict])
def get_favorites(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    favorites = db.query(Favorite).filter(Favorite.user_id == current_user.id).all()
    jobs = []
    for fav in favorites:
        job = db.query(Job).filter(Job.id == fav.job_id).first()
        if job:
            jobs.append({
                "id": job.id,
                "title": job.title,
                "company": job.company,
                "location": job.location,
                "salary_range": job.salary_range,
                "favorited_at": fav.created_at
            })
    return jobs
