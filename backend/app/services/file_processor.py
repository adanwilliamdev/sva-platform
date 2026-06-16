import os
import shutil
from pathlib import Path
from PyPDF2 import PdfReader
from docx import Document
from typing import Optional

class FileProcessor:
    UPLOAD_DIR = "uploads/resumes"
    
    @staticmethod
    def ensure_upload_dir():
        """Garante que a pasta de uploads existe"""
        Path(FileProcessor.UPLOAD_DIR).mkdir(parents=True, exist_ok=True)
    
    @staticmethod
    async def save_file(file, user_id: int, original_name: str) -> str:
        """Salva o arquivo e retorna o caminho"""
        FileProcessor.ensure_upload_dir()
        
        # Gerar nome único para o arquivo
        ext = Path(original_name).suffix
        new_filename = f"resume_{user_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}{ext}"
        file_path = os.path.join(FileProcessor.UPLOAD_DIR, new_filename)
        
        # Salvar arquivo
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
                text += page.extract_text()
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
        else:
            return ""

from datetime import datetime
