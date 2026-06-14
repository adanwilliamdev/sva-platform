from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ApplicationBase(BaseModel):
    job_id: int
    resume_id: int

class ApplicationCreate(ApplicationBase):
    pass

class ApplicationResponse(ApplicationBase):
    id: int
    candidate_id: int
    status: str
    compatibility_score: Optional[float] = None
    applied_at: datetime
    
    class Config:
        from_attributes = True
