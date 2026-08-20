import smtplib
from email.message import EmailMessage
from typing import Optional

from app.config import settings


class NotificationService:
    """
    Envia notificações por e-mail (nova candidatura, mudança de status,
    entrevista agendada). Se SMTP_HOST não estiver configurado, os e-mails
    são apenas logados no console — assim o projeto continua rodando 100%
    localmente sem exigir um servidor de e-mail, mas fica pronto para
    produção bastando preencher as variáveis SMTP_* no .env.
    """

    @staticmethod
    def _send(to_email: str, subject: str, body: str) -> bool:
        if not settings.NOTIFICATIONS_ENABLED:
            return False

        if not settings.SMTP_HOST:
            print(f"📧 [notificação simulada] Para: {to_email} | Assunto: {subject}\n{body}\n")
            return True

        try:
            msg = EmailMessage()
            msg["Subject"] = subject
            msg["From"] = settings.SMTP_FROM
            msg["To"] = to_email
            msg.set_content(body)

            with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
                server.starttls()
                if settings.SMTP_USER and settings.SMTP_PASSWORD:
                    server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                server.send_message(msg)
            return True
        except Exception as e:
            # Notificação nunca deve derrubar o fluxo principal da API
            print(f"⚠️ Falha ao enviar e-mail para {to_email}: {e}")
            return False

    @staticmethod
    def notify_new_application(recruiter_email: str, candidate_name: str, job_title: str, score: float):
        subject = f"Nova candidatura para {job_title}"
        body = (
            f"Olá!\n\n{candidate_name} se candidatou para a vaga \"{job_title}\".\n"
            f"Score de compatibilidade: {score:.0f}%.\n\n"
            f"Acesse a plataforma para revisar o currículo."
        )
        NotificationService._send(recruiter_email, subject, body)

    @staticmethod
    def notify_application_status_change(candidate_email: str, job_title: str, status: str):
        status_labels = {
            "pending": "pendente",
            "reviewed": "em análise",
            "accepted": "aprovada",
            "rejected": "rejeitada",
        }
        label = status_labels.get(status, status)
        subject = f"Atualização da sua candidatura - {job_title}"
        body = (
            f"Olá!\n\nO status da sua candidatura para \"{job_title}\" mudou para: {label}.\n\n"
            f"Acesse a plataforma para mais detalhes."
        )
        NotificationService._send(candidate_email, subject, body)

    @staticmethod
    def notify_interview_scheduled(
        candidate_email: str,
        job_title: str,
        scheduled_at: str,
        location: Optional[str] = None,
    ):
        subject = f"Entrevista agendada - {job_title}"
        where = location or "a definir (verifique a plataforma)"
        body = (
            f"Olá!\n\nSua entrevista para a vaga \"{job_title}\" foi agendada para {scheduled_at}.\n"
            f"Local/Link: {where}\n\nBoa sorte!"
        )
        NotificationService._send(candidate_email, subject, body)
