from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # --- Segurança / Auth ---
    SECRET_KEY: str = "sua-chave-secreta-temporaria-para-desenvolvimento-123456"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # --- Banco de dados ---
    # Se DATABASE_URL não for definida, cai no SQLite local (comportamento
    # original, zero configuração). Para produção, defina algo como:
    # postgresql+psycopg2://user:password@host:5432/sva_db
    DATABASE_URL: Optional[str] = None

    # --- Uploads ---
    MAX_UPLOAD_SIZE_MB: int = 5
    ALLOWED_RESUME_EXTENSIONS: str = ".pdf,.docx,.doc"

    # --- Rate limiting ---
    RATE_LIMIT_LOGIN: str = "5/minute"
    RATE_LIMIT_DEFAULT: str = "100/minute"

    # --- E-mail / Notificações ---
    SMTP_HOST: Optional[str] = None
    SMTP_PORT: int = 587
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    SMTP_FROM: str = "no-reply@sva-platform.local"
    NOTIFICATIONS_ENABLED: bool = True

    # --- CORS ---
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000"

    class Config:
        env_file = ".env"
        extra = "ignore"  # ignora variáveis do .env não mapeadas aqui (ex: RUN_SEED, lido direto via os.getenv)


settings = Settings()
