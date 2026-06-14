from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class JobBase(BaseModel):
    title: str
    company: str
    description: str
    requirements: Optional[str] = None
    skills_required: Optional[str] = None
    location: Optional[str] = None
    salary_range: Optional[str] = None

class JobCreate(JobBase):
    pass

class JobResponse(JobBase):
    id: int
    recruiter_id: int
    is_active: int
    created_at: datetime
    
    class Config:
        from_attributes = True
