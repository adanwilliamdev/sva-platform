from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class InterviewBase(BaseModel):
    application_id: int
    scheduled_at: datetime
    location: Optional[str] = None
    notes: Optional[str] = None


class InterviewCreate(InterviewBase):
    pass


class InterviewUpdate(BaseModel):
    scheduled_at: Optional[datetime] = None
    location: Optional[str] = None
    notes: Optional[str] = None
    status: Optional[str] = None


class InterviewResponse(InterviewBase):
    id: int
    job_id: int
    candidate_id: int
    recruiter_id: int
    status: str
    created_at: datetime
    job_title: Optional[str] = None
    candidate_name: Optional[str] = None

    class Config:
        from_attributes = True
