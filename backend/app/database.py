from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from pathlib import Path

# SQLite local - não precisa de PostgreSQL nem de nenhum serviço externo.
# O arquivo fica em ./data/ para poder ser persistido via volume no Docker
# sem conflitar com o código-fonte da aplicação.
Path("./data").mkdir(parents=True, exist_ok=True)
SQLALCHEMY_DATABASE_URL = "sqlite:///./data/sva.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
