from collections import defaultdict
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.job import Job
from app.models.application import Application
from app.routers.auth import get_current_user

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/recruiter")
def recruiter_analytics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Dashboard consolidado do recrutador em uma única chamada: total de vagas,
    candidaturas, taxa de aprovação, score médio de compatibilidade,
    distribuição por status e tendência dos últimos 7 dias.

    Antes, o frontend buscava as vagas e depois fazia uma requisição extra
    por vaga para pegar as candidaturas (N+1) e usava um score médio fixo
    (75%) hardcoded. Este endpoint resolve os dois problemas de uma vez.
    """
    if current_user.user_type != "recruiter":
        raise HTTPException(status_code=403, detail="Only recruiters can access analytics")

    jobs = db.query(Job).filter(Job.recruiter_id == current_user.id).all()
    job_ids = [j.id for j in jobs]

    applications = (
        db.query(Application).filter(Application.job_id.in_(job_ids)).all() if job_ids else []
    )

    status_counts = defaultdict(int)
    for app in applications:
        status_counts[app.status] += 1

    scores = [a.compatibility_score for a in applications if a.compatibility_score is not None]
    avg_score = round(sum(scores) / len(scores), 2) if scores else 0

    accepted = status_counts.get("accepted", 0)
    approval_rate = round((accepted / len(applications)) * 100, 2) if applications else 0

    # Tendência dos últimos 7 dias
    today = datetime.utcnow().date()
    trend = []
    for i in range(6, -1, -1):
        day = today - timedelta(days=i)
        count = sum(1 for a in applications if a.applied_at and a.applied_at.date() == day)
        trend.append({"date": day.isoformat(), "count": count})

    # Ranking das vagas com mais candidaturas
    apps_per_job = defaultdict(list)
    for a in applications:
        apps_per_job[a.job_id].append(a)

    jobs_summary = sorted(
        (
            {
                "job_id": job.id,
                "title": job.title,
                "company": job.company,
                "is_active": job.is_active,
                "applications": len(apps_per_job.get(job.id, [])),
                "avg_score": round(
                    sum(a.compatibility_score or 0 for a in apps_per_job.get(job.id, []))
                    / len(apps_per_job[job.id]),
                    2,
                ) if apps_per_job.get(job.id) else 0,
            }
            for job in jobs
        ),
        key=lambda x: x["applications"],
        reverse=True,
    )
    top_jobs = jobs_summary[:5]

    candidate_ids = {a.candidate_id for a in applications}
    candidates_by_id = {
        c.id: c for c in db.query(User).filter(User.id.in_(candidate_ids)).all()
    } if candidate_ids else {}
    jobs_by_id = {j.id: j for j in jobs}

    top_candidates = sorted(
        (
            {
                "application_id": a.id,
                "candidate_name": candidates_by_id[a.candidate_id].full_name
                if a.candidate_id in candidates_by_id else f"Candidato #{a.candidate_id}",
                "job_title": jobs_by_id[a.job_id].title if a.job_id in jobs_by_id else None,
                "job_id": a.job_id,
                "status": a.status,
                "compatibility_score": a.compatibility_score or 0,
            }
            for a in applications
        ),
        key=lambda x: x["compatibility_score"],
        reverse=True,
    )[:5]

    return {
        "total_jobs": len(jobs),
        "active_jobs": sum(1 for j in jobs if j.is_active == 1),
        "total_applications": len(applications),
        "approval_rate": approval_rate,
        "avg_compatibility_score": avg_score,
        "status_breakdown": {
            "pending": status_counts.get("pending", 0),
            "reviewed": status_counts.get("reviewed", 0),
            "accepted": status_counts.get("accepted", 0),
            "rejected": status_counts.get("rejected", 0),
        },
        "applications_trend_7d": trend,
        "top_jobs": top_jobs,
        "top_candidates": top_candidates,
        "jobs": jobs_summary,
    }
