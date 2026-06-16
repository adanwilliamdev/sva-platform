from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import socketio
from app.database import SessionLocal
from app.models.chat import Message, Conversation
from app.models.user import User

# Criar servidor Socket.IO
sio = socketio.AsyncServer(
    cors_allowed_origins=['http://localhost:3000'],
    async_mode='asgi'
)
socket_app = socketio.ASGIApp(sio)

# Dicionário para armazenar usuários conectados
connected_users = {}

@sio.event
async def connect(sid, environ):
    print(f'🔗 Cliente conectado: {sid}')
    connected_users[sid] = None

@sio.event
async def disconnect(sid):
    print(f'🔌 Cliente desconectado: {sid}')
    if sid in connected_users:
        del connected_users[sid]

@sio.event
async def join_room(sid, data):
    """Usuário entra na sala de chat (conversa)"""
    conversation_id = data.get('conversation_id')
    user_id = data.get('user_id')
    
    connected_users[sid] = {
        'user_id': user_id,
        'conversation_id': conversation_id
    }
    
    sio.enter_room(sid, str(conversation_id))
    print(f'📥 Usuário {user_id} entrou na sala {conversation_id}')
    
    return {'status': 'joined', 'conversation_id': conversation_id}

@sio.event
async def send_message(sid, data):
    """Recebe mensagem e envia para todos da sala"""
    try:
        conversation_id = data.get('conversation_id')
        message_text = data.get('message')
        sender_id = data.get('sender_id')
        
        db = SessionLocal()
        
        conversation = db.query(Conversation).filter(
            Conversation.id == conversation_id
        ).first()
        
        if conversation:
            new_message = Message(
                conversation_id=conversation_id,
                sender_id=sender_id,
                message=message_text,
                is_read=False
            )
            db.add(new_message)
            db.commit()
            db.refresh(new_message)
            
            sender = db.query(User).filter(User.id == sender_id).first()
            sender_name = sender.full_name if sender else 'Usuário'
            
            await sio.emit('new_message', {
                'id': new_message.id,
                'conversation_id': conversation_id,
                'sender_id': sender_id,
                'sender_name': sender_name,
                'message': message_text,
                'created_at': new_message.created_at.isoformat(),
                'is_read': False
            }, room=str(conversation_id))
            
            print(f'📨 Mensagem enviada na sala {conversation_id}: {message_text[:50]}...')
        
        db.close()
        
    except Exception as e:
        print(f'❌ Erro ao enviar mensagem: {e}')
