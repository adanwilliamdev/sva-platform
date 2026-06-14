from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ResumeBase(BaseModel):
    title: str
    skills: Optional[str] = None
    experience: Optional[str] = None
    education: Optional[str] = None
    raw_text: Optional[str] = None

class ResumeCreate(ResumeBase):
    pass

class ResumeResponse(ResumeBase):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True
