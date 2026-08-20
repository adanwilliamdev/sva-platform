import json
from tests.conftest import register_and_login


def _auth_header(token):
    return {"Authorization": f"Bearer {token}"}


def _setup_application(client):
    recruiter_token = register_and_login(client, "recInt", "recruiter")
    candidate_token = register_and_login(client, "candInt", "candidate")

    job = client.post(
        "/jobs/",
        json={
            "title": "Vaga Teste",
            "company": "Empresa",
            "description": "Descricao",
            "skills_required": json.dumps(["Python"]),
        },
        headers=_auth_header(recruiter_token),
    ).json()

    resume = client.post(
        "/resumes/",
        data={"title": "CV", "skills": json.dumps(["Python"])},
        headers=_auth_header(candidate_token),
    ).json()

    application = client.post(
        "/applications/",
        json={"job_id": job["id"], "resume_id": resume["id"]},
        headers=_auth_header(candidate_token),
    ).json()

    return recruiter_token, candidate_token, application


def test_recruiter_schedules_interview(client):
    recruiter_token, candidate_token, application = _setup_application(client)

    resp = client.post(
        "/interviews/",
        json={
            "application_id": application["id"],
            "scheduled_at": "2026-09-01T14:00:00",
            "location": "https://meet.example.com/abc",
            "notes": "Entrevista técnica",
        },
        headers=_auth_header(recruiter_token),
    )
    assert resp.status_code == 200, resp.text
    data = resp.json()
    assert data["status"] == "scheduled"
    assert data["job_title"] == "Vaga Teste"


def test_candidate_cannot_schedule_interview(client):
    _, candidate_token, application = _setup_application(client)
    resp = client.post(
        "/interviews/",
        json={"application_id": application["id"], "scheduled_at": "2026-09-01T14:00:00"},
        headers=_auth_header(candidate_token),
    )
    assert resp.status_code == 403


def test_candidate_sees_own_scheduled_interview(client):
    recruiter_token, candidate_token, application = _setup_application(client)
    client.post(
        "/interviews/",
        json={"application_id": application["id"], "scheduled_at": "2026-09-01T14:00:00"},
        headers=_auth_header(recruiter_token),
    )
    resp = client.get("/interviews/my", headers=_auth_header(candidate_token))
    assert resp.status_code == 200
    assert len(resp.json()) == 1


def test_recruiter_can_cancel_interview(client):
    recruiter_token, candidate_token, application = _setup_application(client)
    interview = client.post(
        "/interviews/",
        json={"application_id": application["id"], "scheduled_at": "2026-09-01T14:00:00"},
        headers=_auth_header(recruiter_token),
    ).json()

    resp = client.delete(f"/interviews/{interview['id']}", headers=_auth_header(recruiter_token))
    assert resp.status_code == 200

    listed = client.get("/interviews/my", headers=_auth_header(recruiter_token)).json()
    assert listed[0]["status"] == "cancelled"
