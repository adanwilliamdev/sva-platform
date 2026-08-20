from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.user import User
from app.models.job import Job
from app.models.application import Application
from app.models.interview import Interview
from app.schemas.interview import InterviewCreate, InterviewUpdate, InterviewResponse
from app.routers.auth import get_current_user
from app.services.notifications import NotificationService

router = APIRouter(prefix="/interviews", tags=["interviews"])


def _to_response(interview: Interview, db: Session) -> dict:
    job = db.query(Job).filter(Job.id == interview.job_id).first()
    candidate = db.query(User).filter(User.id == interview.candidate_id).first()
    return {
        "id": interview.id,
        "application_id": interview.application_id,
        "job_id": interview.job_id,
        "candidate_id": interview.candidate_id,
        "recruiter_id": interview.recruiter_id,
        "scheduled_at": interview.scheduled_at,
        "location": interview.location,
        "notes": interview.notes,
        "status": interview.status,
        "created_at": interview.created_at,
        "job_title": job.title if job else None,
        "candidate_name": candidate.full_name if candidate else None,
    }


@router.post("/", response_model=InterviewResponse)
def schedule_interview(
    payload: InterviewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.user_type != "recruiter":
        raise HTTPException(status_code=403, detail="Only recruiters can schedule interviews")

    application = db.query(Application).filter(Application.id == payload.application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    job = db.query(Job).filter(Job.id == application.job_id).first()
    if not job or job.recruiter_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized for this application")

    interview = Interview(
        application_id=application.id,
        job_id=job.id,
        candidate_id=application.candidate_id,
        recruiter_id=current_user.id,
        scheduled_at=payload.scheduled_at,
        location=payload.location,
        notes=payload.notes,
        status="scheduled",
    )
    db.add(interview)
    db.commit()
    db.refresh(interview)

    candidate = db.query(User).filter(User.id == application.candidate_id).first()
    if candidate:
        NotificationService.notify_interview_scheduled(
            candidate.email, job.title, payload.scheduled_at.strftime("%d/%m/%Y %H:%M"), payload.location
        )

    return _to_response(interview, db)


@router.get("/my", response_model=List[InterviewResponse])
def get_my_interviews(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Lista entrevistas do usuário logado (como candidato ou recrutador)."""
    if current_user.user_type == "recruiter":
        interviews = db.query(Interview).filter(Interview.recruiter_id == current_user.id).all()
    else:
        interviews = db.query(Interview).filter(Interview.candidate_id == current_user.id).all()
    return [_to_response(i, db) for i in interviews]


@router.put("/{interview_id}", response_model=InterviewResponse)
def update_interview(
    interview_id: int,
    payload: InterviewUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    interview = db.query(Interview).filter(Interview.id == interview_id).first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    if interview.recruiter_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(interview, field, value)
    db.commit()
    db.refresh(interview)
    return _to_response(interview, db)


@router.delete("/{interview_id}")
def cancel_interview(
    interview_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    interview = db.query(Interview).filter(Interview.id == interview_id).first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    if interview.recruiter_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    interview.status = "cancelled"
    db.commit()
    return {"message": "Interview cancelled"}
