from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import socketio
import os
import uvicorn
from dotenv import load_dotenv
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

load_dotenv()

from app.database import engine, Base
from app.routers import auth, resumes, jobs, applications, chat, interviews, analytics
from app.socketio import sio
from app.utils.rate_limit import limiter
from app.config import settings

# Cria as tabelas do banco (SQLite local ou PostgreSQL, conforme DATABASE_URL)
# se ainda não existirem
Base.metadata.create_all(bind=engine)

fastapi_app = FastAPI(title="SVA - Sua Vaga Aqui API", version="1.1.0")

# Rate limiting global (protege contra abuso/força bruta em endpoints sensíveis)
fastapi_app.state.limiter = limiter
fastapi_app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS - por padrão libera o frontend local (localhost:3000)
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", settings.ALLOWED_ORIGINS).split(",")

fastapi_app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
fastapi_app.include_router(auth.router)
fastapi_app.include_router(resumes.router)
fastapi_app.include_router(jobs.router)
fastapi_app.include_router(applications.router)
fastapi_app.include_router(chat.router)
fastapi_app.include_router(interviews.router)
fastapi_app.include_router(analytics.router)


@fastapi_app.get("/")
def root():
    return {"message": "Welcome to SVA - Sua Vaga Aqui API"}


@fastapi_app.get("/health")
def health_check():
    return {"status": "healthy"}


# Executar seed automático se configurado (RUN_SEED=true)
@fastapi_app.on_event("startup")
async def startup_event():
    if os.getenv("RUN_SEED", "false").lower() == "true":
        try:
            from app.seed_data import seed_database
            seed_database()
        except Exception as e:
            print(f"⚠️ Erro ao executar seed: {e}")


# Combina a API REST (FastAPI) com o servidor de chat em tempo real (Socket.IO)
# em uma única aplicação ASGI. O frontend se conecta em /socket.io/ (ver
# frontend/src/services/chat.js). Sem isso, o chat só funciona via REST
# (histórico), sem notificação em tempo real de novas mensagens.
app = socketio.ASGIApp(sio, other_asgi_app=fastapi_app, socketio_path="socket.io")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port)
