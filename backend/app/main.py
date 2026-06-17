from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import auth, resumes, jobs, applications, chat

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="SVA - Sua Vaga Aqui API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
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
