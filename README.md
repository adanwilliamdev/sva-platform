<div align="center">

# 🚀 SVA Platform

### Plataforma Inteligente de Recrutamento com Inteligência Artificial

Sistema Full Stack desenvolvido com **FastAPI**, **React** e **Machine Learning** para conectar candidatos e recrutadores através de análise automática de compatibilidade entre currículos e vagas.

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.12-blue" />
  <img src="https://img.shields.io/badge/FastAPI-009688" />
  <img src="https://img.shields.io/badge/React-61DAFB" />
  <img src="https://img.shields.io/badge/TailwindCSS-38BDF8" />
  <img src="https://img.shields.io/badge/Render-Deployed-success" />
  <img src="https://img.shields.io/badge/License-MIT-yellow" />
</p>

**Matching inteligente entre talentos e oportunidades utilizando IA**

</div>

---

## 📌 Sobre o Projeto

O **SVA Platform** é uma plataforma moderna de recrutamento e seleção que utiliza técnicas de **Processamento de Linguagem Natural (NLP)** para analisar currículos e vagas, gerando automaticamente um índice de compatibilidade entre candidatos e oportunidades.

A aplicação foi construída seguindo uma arquitetura Full Stack desacoplada, proporcionando escalabilidade, manutenção simplificada e facilidade de evolução.

---

## 🌐 Demonstração Online

### Aplicação

* 🔗 **Frontend:** https://sva-platform-frontend.onrender.com
* 🔗 **Backend API:** https://sva-platform-api.onrender.com
* 🔗 **Swagger Docs:** https://sva-platform-api.onrender.com/docs

### Credenciais de Teste

| Perfil          | Usuário    | Senha  |
| --------------- | ---------- | ------ |
| 👔 Recrutador   | recrutador | 123456 |
| 👨‍💼 Candidato | adan       | 123456 |

---

## ✨ Principais Funcionalidades

### 👔 Área do Recrutador

* Dashboard com métricas e indicadores
* Gestão completa de vagas (CRUD)
* Ranking inteligente de candidatos
* Visualização de currículos PDF e DOCX
* Comunicação via chat com candidatos
* Acompanhamento do processo seletivo

### 👨‍💼 Área do Candidato

* Upload e gerenciamento de currículos
* Aplicação simplificada para vagas
* Histórico de candidaturas
* Acompanhamento de status
* Score de compatibilidade com vagas

### 🤖 Inteligência Artificial

* Extração de habilidades
* Similaridade textual utilizando TF-IDF
* Matching automático entre vagas e currículos
* Ranking de candidatos por relevância
* Análise de aderência ao perfil da vaga

---

## 🏗️ Arquitetura da Solução

```text
┌─────────────────────┐
│     React 18        │
│   Frontend SPA      │
└──────────┬──────────┘
           │ REST API
           ▼
┌─────────────────────┐
│      FastAPI        │
│ Authentication JWT  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│    SQLAlchemy ORM   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ SQLite/PostgreSQL   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ IA - Scikit Learn   │
│ TF-IDF Matching     │
└─────────────────────┘
```

---

## 🛠️ Stack Tecnológica

### Backend

* Python 3.12
* FastAPI
* SQLAlchemy
* SQLite
* PostgreSQL
* JWT Authentication
* Scikit-Learn
* Pydantic Settings

### Frontend

* React 18
* Tailwind CSS
* Axios
* Recharts
* React Hook Form
* Lucide React

### DevOps

* GitHub
* Render
* Environment Variables
* Continuous Deployment

---

## 🚀 Instalação Local

### 1. Clone o Repositório

```bash
git clone https://github.com/adanwilliamdev/sva-platform.git

cd sva-platform
```

### 2. Backend

```bash
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

Servidor disponível em:

```text
http://localhost:8000
```

---

### 3. Frontend

```bash
cd frontend

npm install

npm start
```

Aplicação disponível em:

```text
http://localhost:3000
```

---

## 📦 Deploy no Render

### Backend

```text
Environment: Python 3
Build Command:
pip install -r backend/requirements.txt

Start Command:
cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### Variáveis de Ambiente

```env
PYTHON_VERSION=3.12.8
ALLOWED_ORIGINS=https://seu-frontend.onrender.com
DATABASE_URL=sqlite:///sva_platform.db
RUN_SEED=true
SECRET_KEY=sua_chave_jwt
```

---

### Frontend

```text
Build Command:
cd frontend && npm install && npm run build

Publish Directory:
frontend/build
```

```env
REACT_APP_API_URL=https://sva-platform-api.onrender.com
```

---

## 📈 Diferenciais Técnicos

✔ Arquitetura Full Stack desacoplada

✔ API REST documentada automaticamente (Swagger)

✔ Autenticação JWT

✔ Upload de arquivos PDF e DOCX

✔ Dashboard analítico com gráficos interativos

✔ Sistema de chat integrado

✔ Matching inteligente utilizando NLP

✔ Deploy contínuo via Render

✔ Estrutura preparada para PostgreSQL

---

## 🗺️ Roadmap

* [x] Deploy na nuvem
* [x] Seed automático do banco
* [x] Autenticação JWT
* [x] Sistema de Matching IA (TF-IDF)
* [ ] Integração com LinkedIn
* [ ] Notificações por e-mail
* [ ] PostgreSQL em produção
* [ ] Docker
* [ ] React Native App
* [ ] Testes automatizados
* [ ] CI/CD com GitHub Actions

---

## 🐛 Problemas Comuns

### pydantic_settings não encontrado

```bash
pip install pydantic-settings==2.7.0
```

### password cannot be longer than 72 bytes

```bash
pip install bcrypt==4.0.1
```

### Erro de CORS

Verifique se a variável:

```env
ALLOWED_ORIGINS
```

contém exatamente a URL do frontend.

---

## 👨‍💻 Autor

### Adan William

💼 Analista de TI | NOC | Desenvolvedor Full Stack

* GitHub: https://github.com/adanwilliamdev
* LinkedIn: Adan William

---

## 📄 Licença

Distribuído sob a licença MIT.

Consulte o arquivo **LICENSE** para mais informações.

---

<div align="center">

### ⭐ Gostou do projeto?

Se este projeto foi útil para você, considere deixar uma estrela no repositório.

**Feito com ❤️ por Adan William**

</div>
