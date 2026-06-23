from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import auth, resumes, jobs, applications, chat
import os
import uvicorn

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="SVA - Sua Vaga Aqui API", version="1.0.0")

# CORS - Configuração para produção
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(resumes.router)
app.include_router(jobs.router)
app.include_router(applications.router)
app.include_router(chat.router)

@app.get("/")
def root():
    return {"message": "Welcome to SVA - Sua Vaga Aqui API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

# Executar seed automático se configurado
@app.on_event("startup")
async def startup_event():
    if os.getenv("RUN_SEED", "false").lower() == "true":
        try:
            from app.seed_data import seed_database
            seed_database()
        except Exception as e:
            print(f"⚠️ Erro ao executar seed: {e}")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port)