import os
import shutil
from datetime import datetime
from pathlib import Path

from fastapi import HTTPException, UploadFile
from PyPDF2 import PdfReader
from docx import Document

from app.config import settings


class FileProcessor:
    UPLOAD_DIR = "uploads/resumes"

    @staticmethod
    def ensure_upload_dir():
        """Garante que a pasta de uploads existe"""
        Path(FileProcessor.UPLOAD_DIR).mkdir(parents=True, exist_ok=True)

    @staticmethod
    def _allowed_extensions() -> set:
        return {
            ext.strip().lower()
            for ext in settings.ALLOWED_RESUME_EXTENSIONS.split(",")
            if ext.strip()
        }

    @staticmethod
    def validate_file(file: UploadFile) -> None:
        """
        Valida extensão e tamanho do arquivo antes de salvar. Sem isso,
        qualquer usuário autenticado podia subir um arquivo de qualquer tipo
        e tamanho para o servidor.
        """
        ext = Path(file.filename or "").suffix.lower()
        allowed = FileProcessor._allowed_extensions()
        if ext not in allowed:
            raise HTTPException(
                status_code=400,
                detail=f"Tipo de arquivo não permitido. Use: {', '.join(sorted(allowed))}",
            )

        # UploadFile.file é um SpooledTemporaryFile; podemos checar o tamanho
        # navegando até o fim e voltando ao início, sem carregar tudo em memória.
        file.file.seek(0, os.SEEK_END)
        size_bytes = file.file.tell()
        file.file.seek(0)

        max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
        if size_bytes > max_bytes:
            raise HTTPException(
                status_code=400,
                detail=f"Arquivo muito grande. Limite de {settings.MAX_UPLOAD_SIZE_MB}MB.",
            )
        if size_bytes == 0:
            raise HTTPException(status_code=400, detail="Arquivo vazio.")

    @staticmethod
    async def save_file(file: UploadFile, user_id: int, original_name: str) -> str:
        """Valida e salva o arquivo, retornando o caminho relativo."""
        FileProcessor.validate_file(file)
        FileProcessor.ensure_upload_dir()

        ext = Path(original_name).suffix
        new_filename = f"resume_{user_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}{ext}"
        file_path = os.path.join(FileProcessor.UPLOAD_DIR, new_filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        return file_path

    @staticmethod
    def extract_text_from_pdf(file_path: str) -> str:
        """Extrai texto de arquivo PDF"""
        try:
            reader = PdfReader(file_path)
            text = ""
            for page in reader.pages:
                text += page.extract_text() or ""
            return text
        except Exception as e:
            print(f"Erro ao ler PDF: {e}")
            return ""

    @staticmethod
    def extract_text_from_docx(file_path: str) -> str:
        """Extrai texto de arquivo DOCX"""
        try:
            doc = Document(file_path)
            text = ""
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
            return text
        except Exception as e:
            print(f"Erro ao ler DOCX: {e}")
            return ""

    @staticmethod
    def extract_text(file_path: str) -> str:
        """Extrai texto baseado na extensão do arquivo"""
        ext = Path(file_path).suffix.lower()
        if ext == '.pdf':
            return FileProcessor.extract_text_from_pdf(file_path)
        elif ext in ['.docx', '.doc']:
            return FileProcessor.extract_text_from_docx(file_path)
        return ""
