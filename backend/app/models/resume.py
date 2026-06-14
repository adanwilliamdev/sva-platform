from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime
from sqlalchemy.sql import func
from app.database import Base

class Resume(Base):
    __tablename__ = "resumes"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    skills = Column(Text)
    experience = Column(Text)
    education = Column(Text)
    raw_text = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
