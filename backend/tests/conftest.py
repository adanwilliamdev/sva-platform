import os
import sys
import tempfile

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Garante que os testes rodem isolados, sem tocar no banco de desenvolvimento
os.environ.setdefault("SECRET_KEY", "test-secret-key")
os.environ.setdefault("NOTIFICATIONS_ENABLED", "false")

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import Base, get_db
from app.main import fastapi_app
from app.utils.rate_limit import limiter


@pytest.fixture()
def db_session():
    """Cria um banco SQLite em arquivo temporário, isolado por teste."""
    db_fd, db_path = tempfile.mkstemp(suffix=".db")
    engine = create_engine(f"sqlite:///{db_path}", connect_args={"check_same_thread": False})
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)

    session = TestingSessionLocal()
    try:
        yield session, TestingSessionLocal
    finally:
        session.close()
        os.close(db_fd)
        os.unlink(db_path)


@pytest.fixture()
def client(db_session):
    _, TestingSessionLocal = db_session

    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    fastapi_app.dependency_overrides[get_db] = override_get_db
    # Cada teste começa com o rate limiter zerado, senão o limite de
    # tentativas de login (5/min) vaza entre testes que rodam na mesma
    # "janela" e usam o mesmo IP simulado pelo TestClient.
    limiter.reset()
    with TestClient(fastapi_app) as test_client:
        yield test_client
    fastapi_app.dependency_overrides.clear()


def register_and_login(client, username, user_type, email=None):
    """Helper: registra um usuário e retorna o token de acesso."""
    client.post(
        "/auth/register",
        json={
            "email": email or f"{username}@teste.com",
            "username": username,
            "password": "senha123",
            "full_name": username.title(),
            "user_type": user_type,
        },
    )
    resp = client.post(
        "/auth/login",
        data={"username": username, "password": "senha123"},
    )
    assert resp.status_code == 200, resp.text
    return resp.json()["access_token"]
