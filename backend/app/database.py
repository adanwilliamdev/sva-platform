from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from pathlib import Path

from app.config import settings

# Suporta PostgreSQL em produção via DATABASE_URL. Sem configuração nenhuma,
# continua funcionando 100% localmente com SQLite (comportamento original) -
# ninguém precisa instalar Postgres só para rodar o projeto.
if settings.DATABASE_URL:
    SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL
    connect_args = {}
    # psycopg2 não aceita 'postgres://' (algumas plataformas de deploy geram
    # essa URL) - normaliza para o driver esperado pelo SQLAlchemy 2.x.
    if SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
        SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace(
            "postgres://", "postgresql+psycopg2://", 1
        )
else:
    Path("./data").mkdir(parents=True, exist_ok=True)
    SQLALCHEMY_DATABASE_URL = "sqlite:///./data/sva.db"
    connect_args = {"check_same_thread": False}

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
