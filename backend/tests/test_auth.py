from tests.conftest import register_and_login


def test_register_new_user(client):
    resp = client.post(
        "/auth/register",
        json={
            "email": "novo@teste.com",
            "username": "novo",
            "password": "senha123",
            "full_name": "Novo Usuario",
            "user_type": "candidate",
        },
    )
    assert resp.status_code == 200, resp.text
    data = resp.json()
    assert data["username"] == "novo"
    assert "hashed_password" not in data


def test_register_duplicate_username_fails(client):
    payload = {
        "email": "dup1@teste.com",
        "username": "duplicado",
        "password": "senha123",
        "full_name": "Dup",
        "user_type": "candidate",
    }
    client.post("/auth/register", json=payload)
    payload["email"] = "dup2@teste.com"
    resp = client.post("/auth/register", json=payload)
    assert resp.status_code == 400


def test_login_with_correct_credentials(client):
    token = register_and_login(client, "userlogin", "candidate")
    assert token


def test_login_with_wrong_password_fails(client):
    client.post(
        "/auth/register",
        json={
            "email": "wrong@teste.com",
            "username": "wrongpass",
            "password": "senha123",
            "full_name": "Wrong",
            "user_type": "candidate",
        },
    )
    resp = client.post("/auth/login", data={"username": "wrongpass", "password": "errada"})
    assert resp.status_code == 401


def test_get_current_user_requires_token(client):
    resp = client.get("/auth/me")
    assert resp.status_code == 401


def test_get_current_user_with_valid_token(client):
    token = register_and_login(client, "meuser", "recruiter")
    resp = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200
    assert resp.json()["username"] == "meuser"
