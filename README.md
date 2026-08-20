<div align="center">

# 🚀 SVA Platform

### Plataforma Inteligente de Recrutamento

Sistema Full Stack desenvolvido com **FastAPI** e **React** para conectar candidatos e recrutadores, com matching automático de compatibilidade entre currículos e vagas.

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.12-blue" />
  <img src="https://img.shields.io/badge/FastAPI-009688" />
  <img src="https://img.shields.io/badge/React-61DAFB" />
  <img src="https://img.shields.io/badge/TailwindCSS-38BDF8" />
  <img src="https://img.shields.io/badge/License-MIT-yellow" />
</p>

</div>

---

## 📌 Sobre o Projeto

O **SVA Platform** é uma plataforma de recrutamento e seleção que analisa o texto de currículos e vagas para gerar automaticamente um índice de compatibilidade entre candidatos e oportunidades.

A aplicação segue uma arquitetura Full Stack desacoplada: API REST em FastAPI + banco SQLite local (sem dependências externas) e frontend em React.

### 🖥️ Projeto configurado para rodar 100% localmente

---

## 🔑 Credenciais de Demonstração

Criadas automaticamente ao subir o backend pela primeira vez (`RUN_SEED=true`):

| Perfil          | Usuário    | Senha  |
| --------------- | ---------- | ------ |
| 👔 Recrutador   | recrutador | 123456 |
| 👨‍💼 Candidato | adan       | 123456 |

---

## ✨ Principais Funcionalidades

### 👔 Área do Recrutador

* Dashboard com métricas e indicadores
* Gestão completa de vagas (CRUD)
* Ranking de candidatos por compatibilidade
* Visualização de currículos PDF e DOCX
* Chat em tempo real com candidatos
* Acompanhamento do processo seletivo

### 👨‍💼 Área do Candidato

* Upload e gerenciamento de currículos
* Aplicação simplificada para vagas
* Histórico de candidaturas
* Acompanhamento de status
* Score de compatibilidade com vagas

### 🤖 Matching Automático

* Extração de palavras-chave do currículo e da vaga (com stopwords em português)
* Similaridade textual por **TF-IDF + similaridade de cosseno** (scikit-learn), que pondera termos raros/relevantes em vez de tratar todas as palavras com o mesmo peso
* Correspondência de habilidades com **matching difuso** (reconhece variações como "Spring" ~ "Spring Boot")
* Ranking de candidatos por relevância para cada vaga

### 📅 Entrevistas

* Recrutador agenda entrevista diretamente a partir de uma candidatura (data/hora, local ou link de videochamada, observações)
* Candidato vê suas próximas entrevistas no dashboard
* Notificação por e-mail automática ao agendar (ou mudar status de candidatura)

### 📊 Analytics

* Dashboard do recrutador com métricas agregadas calculadas no backend (total de vagas, candidaturas, taxa de aprovação, score médio real, distribuição por status, tendência dos últimos 7 dias, ranking de vagas e melhores candidatos) — tudo em uma única chamada de API

---

## 🏗️ Arquitetura da Solução

```text
┌─────────────────────┐
│      React SPA      │
│      Frontend       │
└──────────┬──────────┘
           │ REST API + WebSocket (chat)
           ▼
┌─────────────────────┐
│      FastAPI         │
│ Auth JWT + Socket.IO │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│    SQLAlchemy ORM    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  SQLite (arquivo     │
│  local, sem serviço  │
│  externo)             │
└─────────────────────┘
```

---

## 🛠️ Stack Tecnológica

### Backend

* Python 3.12
* FastAPI
* SQLAlchemy + SQLite (ou PostgreSQL via `DATABASE_URL`)
* JWT Authentication (python-jose + passlib)
* Socket.IO (chat em tempo real)
* Pydantic Settings
* scikit-learn (matching por TF-IDF + similaridade de cosseno)
* slowapi (rate limiting)
* pytest + httpx (testes automatizados)

### Frontend

* React 19
* Tailwind CSS
* Axios
* Recharts
* Socket.IO Client
* Lucide React

### Infraestrutura

* Docker / Docker Compose (local, com PostgreSQL opcional via profile)
* GitHub Actions (CI: testes de backend + build de frontend a cada push/PR)

---

## 🚀 Rodando Localmente

### Pré-requisitos

* [Docker Desktop](https://www.docker.com/products/docker-desktop/) (para a Opção 1)
* Ou, para rodar sem Docker: Python 3.12+ e Node.js 20+

### Opção 1 — Docker Compose (recomendado, sobe tudo com 1 comando)

Não precisa de PostgreSQL nem de nenhum serviço externo — o banco é um arquivo SQLite local, criado e populado automaticamente na primeira inicialização.

```bash
docker compose up --build
```

Acesse:

* **Frontend:** http://localhost:3000
* **Backend API:** http://localhost:8000
* **Swagger Docs:** http://localhost:8000/docs

Para parar:

```bash
docker compose down
```

> Como o código é copiado para dentro da imagem (não montado como volume), alterações no código exigem rodar `docker compose up --build` novamente. Para desenvolvimento ativo com hot-reload, prefira a Opção 2.

### Opção 2 — Rodando manualmente (sem Docker, com hot-reload)

#### Backend

```bash
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt

cp .env.example .env
# edite o .env se quiser trocar a SECRET_KEY

uvicorn app.main:app --reload
```

Backend disponível em `http://localhost:8000`.

#### Rodando os testes do backend

```bash
cd backend
source venv/bin/activate  # ou venv\Scripts\activate no Windows
pytest -v
```

#### Usando PostgreSQL em vez de SQLite

Por padrão o projeto usa SQLite (zero configuração). Para usar PostgreSQL:

```bash
# Via Docker Compose (sobe um Postgres já configurado)
docker compose --profile postgres up --build

# Ou manualmente: defina no .env
DATABASE_URL=postgresql+psycopg2://sva_user:sva_password@localhost:5432/sva_db
```

#### Frontend

```bash
cd frontend

npm install

npm start
```

Frontend disponível em `http://localhost:3000` (já aponta para `http://localhost:8000` por padrão).

---

## 🐛 Problemas Comuns

| Sintoma | Causa provável | Solução |
| --- | --- | --- |
| `ModuleNotFoundError: pydantic_settings` | Dependência não instalada | `pip install pydantic-settings==2.7.0` |
| `password cannot be longer than 72 bytes` | Versão incompatível do bcrypt | `pip install bcrypt==4.0.1` |
| Erro de CORS no navegador | `ALLOWED_ORIGINS` não inclui a URL do frontend | Confirme que `ALLOWED_ORIGINS` no `.env`/docker-compose contém exatamente `http://localhost:3000` |
| Chat não atualiza em tempo real | Backend antigo sem Socket.IO montado | Já corrigido nesta versão — confirme que está usando `app/main.py` atualizado |

---

## 🗺️ Roadmap

* [x] Seed automático do banco
* [x] Autenticação JWT
* [x] Chat em tempo real (Socket.IO)
* [x] Matching automático por TF-IDF + similaridade de cosseno
* [x] Testes automatizados (pytest)
* [x] CI/CD com GitHub Actions
* [x] PostgreSQL como opção de banco
* [x] Notificações por e-mail
* [x] Agendamento de entrevistas
* [x] Dashboard de analytics consolidado
* [ ] Integração com LinkedIn
* [ ] React Native App

---

## 👨‍💻 Autor

### Adan William

💼 Analista de TI | NOC | Desenvolvedor Full Stack

* GitHub: https://github.com/adanwilliamdev

---

## 📄 Licença

Distribuído sob a licença MIT. Consulte o arquivo **LICENSE** para mais informações.

---

<div align="center">

### ⭐ Gostou do projeto?

Se este projeto foi útil para você, considere deixar uma estrela no repositório.

**Feito com ❤️ por Adan William**

</div>
