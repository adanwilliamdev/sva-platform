from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.user import User
from app.models.job import Job
from app.models.application import Application
from app.models.chat import Conversation, Message
from app.schemas.chat import MessageCreate, MessageResponse, ConversationResponse
from app.routers.auth import get_current_user

router = APIRouter(prefix="/chat", tags=["chat"])

@router.post("/conversations/{job_id}/start")
def start_conversation(
    job_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Inicia uma conversa entre candidato e recrutador para uma vaga"""
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Verificar se o usuário é candidato OU recrutador da vaga
    if current_user.user_type == "candidate":
        candidate_id = current_user.id
        recruiter_id = job.recruiter_id
    elif current_user.user_type == "recruiter" and current_user.id == job.recruiter_id:
        # Recrutador pode iniciar conversa com candidato
        # Precisa do candidate_id - vamos buscar da aplicação
        application = db.query(Application).filter(
            Application.job_id == job_id
        ).first()
        
        if not application:
            raise HTTPException(status_code=404, detail="No candidate found for this job")
        
        candidate_id = application.candidate_id
        recruiter_id = current_user.id
    else:
        raise HTTPException(status_code=403, detail="Not authorized to start conversation")
    
    # Verificar se já existe conversa
    existing = db.query(Conversation).filter(
        Conversation.job_id == job_id,
        Conversation.candidate_id == candidate_id,
        Conversation.recruiter_id == recruiter_id
    ).first()
    
    if existing:
        return {"conversation_id": existing.id, "message": "Conversa já existe"}
    
    conversation = Conversation(
        job_id=job_id,
        candidate_id=candidate_id,
        recruiter_id=recruiter_id
    )
    
    db.add(conversation)
    db.commit()
    db.refresh(conversation)
    
    return {"conversation_id": conversation.id, "message": "Conversa iniciada"}

@router.get("/conversations", response_model=List[ConversationResponse])
def get_conversations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Lista todas as conversas do usuário"""
    if current_user.user_type == "recruiter":
        conversations = db.query(Conversation).filter(
            Conversation.recruiter_id == current_user.id
        ).all()
    else:
        conversations = db.query(Conversation).filter(
            Conversation.candidate_id == current_user.id
        ).all()
    
    result = []
    for conv in conversations:
        job = db.query(Job).filter(Job.id == conv.job_id).first()
        candidate = db.query(User).filter(User.id == conv.candidate_id).first()
        recruiter = db.query(User).filter(User.id == conv.recruiter_id).first()
        
        last_msg = db.query(Message).filter(
            Message.conversation_id == conv.id
        ).order_by(Message.created_at.desc()).first()
        
        unread = db.query(Message).filter(
            Message.conversation_id == conv.id,
            Message.sender_id != current_user.id,
            Message.is_read == False
        ).count()
        
        result.append(ConversationResponse(
            id=conv.id,
            job_id=conv.job_id,
            job_title=job.title if job else None,
            candidate_id=conv.candidate_id,
            candidate_name=candidate.full_name if candidate else None,
            recruiter_id=conv.recruiter_id,
            recruiter_name=recruiter.full_name if recruiter else None,
            last_message=last_msg.message if last_msg else None,
            last_message_time=last_msg.created_at if last_msg else None,
            unread_count=unread,
            created_at=conv.created_at
        ))
    
    return result

@router.get("/conversations/{conversation_id}/messages", response_model=List[MessageResponse])
def get_messages(
    conversation_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Busca todas as mensagens de uma conversa"""
    conversation = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    if conversation.candidate_id != current_user.id and conversation.recruiter_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Marcar mensagens como lidas
    db.query(Message).filter(
        Message.conversation_id == conversation_id,
        Message.sender_id != current_user.id,
        Message.is_read == False
    ).update({"is_read": True})
    db.commit()
    
    messages = db.query(Message).filter(
        Message.conversation_id == conversation_id
    ).order_by(Message.created_at.asc()).all()
    
    return messages

@router.post("/conversations/{conversation_id}/messages", response_model=MessageResponse)
def send_message(
    conversation_id: int,
    message: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Envia uma mensagem em uma conversa"""
    conversation = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    if conversation.candidate_id != current_user.id and conversation.recruiter_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db_message = Message(
        conversation_id=conversation_id,
        sender_id=current_user.id,
        message=message.message
    )
    
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    
    return db_message
