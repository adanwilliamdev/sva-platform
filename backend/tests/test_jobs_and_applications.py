import json
from tests.conftest import register_and_login


def _auth_header(token):
    return {"Authorization": f"Bearer {token}"}


def _create_job(client, recruiter_token, **overrides):
    payload = {
        "title": "Desenvolvedor Python",
        "company": "TechCorp",
        "description": "Vaga para desenvolvedor Python pleno",
        "requirements": "3 anos de experiencia",
        "skills_required": json.dumps(["Python", "Django", "SQL"]),
        "location": "Remoto",
        "salary_range": "R$ 8.000",
    }
    payload.update(overrides)
    resp = client.post("/jobs/", json=payload, headers=_auth_header(recruiter_token))
    assert resp.status_code == 200, resp.text
    return resp.json()


def test_only_recruiter_can_create_job(client):
    candidate_token = register_and_login(client, "cand1", "candidate")
    resp = client.post(
        "/jobs/",
        json={"title": "X", "company": "Y", "description": "Z"},
        headers=_auth_header(candidate_token),
    )
    assert resp.status_code == 403


def test_recruiter_creates_job_and_lists_it(client):
    recruiter_token = register_and_login(client, "rec1", "recruiter")
    job = _create_job(client, recruiter_token)

    resp = client.get("/jobs/")
    assert resp.status_code == 200
    assert any(j["id"] == job["id"] for j in resp.json())


def test_candidate_can_apply_and_score_is_calculated(client):
    recruiter_token = register_and_login(client, "rec2", "recruiter")
    candidate_token = register_and_login(client, "cand2", "candidate")
    job = _create_job(client, recruiter_token)

    resume_resp = client.post(
        "/resumes/",
        data={
            "title": "Meu Curriculo",
            "skills": json.dumps(["Python", "Django", "SQL"]),
            "experience": json.dumps(["Dev Python - 2 anos"]),
            "education": json.dumps(["Ciencia da Computacao"]),
        },
        headers=_auth_header(candidate_token),
    )
    assert resume_resp.status_code == 200, resume_resp.text
    resume = resume_resp.json()

    apply_resp = client.post(
        "/applications/",
        json={"job_id": job["id"], "resume_id": resume["id"]},
        headers=_auth_header(candidate_token),
    )
    assert apply_resp.status_code == 200, apply_resp.text
    application = apply_resp.json()
    assert application["compatibility_score"] is not None
    assert application["compatibility_score"] > 0


def test_cannot_apply_twice_to_same_job(client):
    recruiter_token = register_and_login(client, "rec3", "recruiter")
    candidate_token = register_and_login(client, "cand3", "candidate")
    job = _create_job(client, recruiter_token)

    resume = client.post(
        "/resumes/",
        data={"title": "CV", "skills": json.dumps(["Python"])},
        headers=_auth_header(candidate_token),
    ).json()

    client.post(
        "/applications/",
        json={"job_id": job["id"], "resume_id": resume["id"]},
        headers=_auth_header(candidate_token),
    )
    second = client.post(
        "/applications/",
        json={"job_id": job["id"], "resume_id": resume["id"]},
        headers=_auth_header(candidate_token),
    )
    assert second.status_code == 400


def test_recruiter_sees_applications_for_own_job_only(client):
    recruiter_a = register_and_login(client, "recA", "recruiter")
    recruiter_b = register_and_login(client, "recB", "recruiter")
    candidate = register_and_login(client, "candX", "candidate")

    job_a = _create_job(client, recruiter_a, title="Vaga A")

    resume = client.post(
        "/resumes/",
        data={"title": "CV", "skills": json.dumps(["Python"])},
        headers=_auth_header(candidate),
    ).json()
    client.post(
        "/applications/",
        json={"job_id": job_a["id"], "resume_id": resume["id"]},
        headers=_auth_header(candidate),
    )

    # Recrutador B não pode ver candidaturas da vaga de A
    resp = client.get(f"/applications/job/{job_a['id']}", headers=_auth_header(recruiter_b))
    assert resp.status_code == 403

    resp_ok = client.get(f"/applications/job/{job_a['id']}", headers=_auth_header(recruiter_a))
    assert resp_ok.status_code == 200
    assert len(resp_ok.json()) == 1


def test_recruiter_analytics_endpoint(client):
    recruiter_token = register_and_login(client, "recAnalytics", "recruiter")
    candidate_token = register_and_login(client, "candAnalytics", "candidate")
    job = _create_job(client, recruiter_token)

    resume = client.post(
        "/resumes/",
        data={"title": "CV", "skills": json.dumps(["Python", "Django", "SQL"])},
        headers=_auth_header(candidate_token),
    ).json()
    client.post(
        "/applications/",
        json={"job_id": job["id"], "resume_id": resume["id"]},
        headers=_auth_header(candidate_token),
    )

    resp = client.get("/analytics/recruiter", headers=_auth_header(recruiter_token))
    assert resp.status_code == 200
    data = resp.json()
    assert data["total_jobs"] == 1
    assert data["total_applications"] == 1
    assert data["avg_compatibility_score"] > 0
    assert len(data["applications_trend_7d"]) == 7


def test_candidate_cannot_access_recruiter_analytics(client):
    candidate_token = register_and_login(client, "candNoAccess", "candidate")
    resp = client.get("/analytics/recruiter", headers=_auth_header(candidate_token))
    assert resp.status_code == 403
