<div align="center">

# 🚀 SVA Platform

### Plataforma Inteligente de Recrutamento

Uma plataforma Full Stack de recrutamento que conecta **candidatos e recrutadores**, automatizando a análise de compatibilidade entre currículos e vagas por meio de **TF-IDF, similaridade de cosseno e matching de habilidades**.

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.12-blue?style=for-the-badge&logo=python" alt="Python 3.12"/>
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi" alt="FastAPI"/>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React 19"/>
  <img src="https://img.shields.io/badge/TailwindCSS-38BDF8?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite" alt="SQLite"/>
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker" alt="Docker"/>
</p>

<p align="center">
  <a href="#-sobre-o-projeto">Sobre</a> •
  <a href="#-funcionalidades">Funcionalidades</a> •
  <a href="#-screenshots">Screenshots</a> •
  <a href="#-arquitetura">Arquitetura</a> •
  <a href="#-tecnologias">Tecnologias</a> •
  <a href="#-execução">Execução</a>
</p>

</div>

---

## 📌 Sobre o Projeto

O **SVA Platform** é uma plataforma inteligente de recrutamento e seleção desenvolvida com **FastAPI** no backend e **React** no frontend.

O sistema permite que candidatos cadastrem seus currículos e se candidatem a vagas, enquanto recrutadores podem criar oportunidades, analisar candidatos e acompanhar processos seletivos.

O principal diferencial é o **matching automático**, que analisa o conteúdo de currículos e vagas para calcular um **score de compatibilidade** e gerar um ranking dos candidatos mais relevantes.

### 🎯 Objetivos

* Automatizar parte do processo de triagem de candidatos
* Reduzir o tempo necessário para análise de currículos
* Identificar candidatos com maior aderência às vagas
* Centralizar vagas, candidaturas e processos seletivos
* Facilitar a comunicação entre candidatos e recrutadores
* Disponibilizar métricas e indicadores para acompanhamento do recrutamento

### 🖥️ Execução local

O projeto foi desenvolvido para funcionar **100% localmente**, utilizando SQLite por padrão e sem necessidade de serviços externos.

Também existe suporte opcional para **PostgreSQL**.

---

# 📸 Screenshots

## 🏠 Tela Inicial

<p align="center">
  <img src="frontend/public/inicio.png" alt="Tela Inicial do SVA Platform" width="900"/>
</p>

---

## 👨‍💼 Dashboard do Candidato

<p align="center">
  <img src="frontend/public/dashboard%20-%20candidato.png" alt="Dashboard do Candidato" width="900"/>
</p>

---

## 👔 Dashboard do Recrutador

<p align="center">
  <img src="frontend/public/dashboard%20-%20recrutador.png" alt="Dashboard do Recrutador" width="900"/>
</p>

---

## 📋 Vagas e Candidatos

<p align="center">
  <img src="frontend/public/vagas%20-%20candidatos.png" alt="Vagas e Candidatos" width="900"/>
</p>

---

# 🔑 Credenciais de Demonstração

O banco é populado automaticamente na primeira inicialização quando o seed está habilitado.

| Perfil          | Usuário      | Senha    |
| --------------- | ------------ | -------- |
| 👔 Recrutador   | `recrutador` | `123456` |
| 👨‍💼 Candidato | `adan`       | `123456` |

> Essas credenciais são destinadas exclusivamente ao ambiente de demonstração/local.

---

# ✨ Funcionalidades

## 👔 Área do Recrutador

* 📊 Dashboard com métricas e indicadores
* 📝 Criação, edição e exclusão de vagas
* 👥 Visualização de candidatos
* 🏆 Ranking de candidatos por compatibilidade
* 📄 Visualização de currículos PDF e DOCX
* 📋 Gerenciamento de candidaturas
* 💬 Chat em tempo real
* 📅 Agendamento de entrevistas
* 📧 Notificações por e-mail
* 📈 Analytics do processo seletivo

---

## 👨‍💼 Área do Candidato

* 👤 Perfil do candidato
* 📄 Upload e gerenciamento de currículo
* 🔎 Busca e visualização de vagas
* 📝 Candidatura simplificada
* 📊 Score de compatibilidade
* 📋 Histórico de candidaturas
* 🔄 Acompanhamento do status das candidaturas
* 📅 Visualização de entrevistas
* 💬 Comunicação com recrutadores

---

# 🤖 Matching Inteligente

O sistema possui um mecanismo de análise automática para estimar a compatibilidade entre um candidato e uma vaga.

### 🔎 Extração de informações

O sistema analisa o conteúdo textual de:

* Currículos
* Descrições de vagas
* Habilidades
* Tecnologias
* Experiências profissionais
* Termos relevantes

Também são utilizadas **stopwords em português** para reduzir o impacto de palavras que não agregam valor à análise.

### 🧠 TF-IDF

A similaridade textual utiliza **TF-IDF (Term Frequency-Inverse Document Frequency)** para identificar termos relevantes em cada documento.

Isso permite que palavras mais específicas tenham maior peso na comparação.

### 📐 Similaridade de Cosseno

Após a vetorização dos textos, o sistema calcula a **similaridade de cosseno** para estimar a proximidade entre o currículo e a descrição da vaga.

### 🔧 Matching de habilidades

Também existe matching difuso para reconhecer variações de tecnologias e habilidades.

Exemplo:

```text
Spring
Spring Boot
Spring Framework
```

Podem ser identificados como tecnologias relacionadas durante a análise.

### 🏆 Ranking

Os candidatos são classificados de acordo com o nível de compatibilidade encontrado para cada vaga.

---

# 📅 Entrevistas

O módulo de entrevistas permite que o recrutador gerencie as próximas etapas do processo seletivo.

### Recrutador

Pode:

* Agendar entrevistas
* Definir data e horário
* Informar local
* Adicionar link de videoconferência
* Adicionar observações
* Alterar o status da candidatura

### Candidato

Pode:

* Visualizar entrevistas agendadas
* Consultar data e horário
* Acessar informações da entrevista
* Acompanhar o processo seletivo

O sistema também possui **notificações automáticas por e-mail** para eventos relevantes do processo.

---

# 📊 Analytics

O dashboard do recrutador possui métricas consolidadas calculadas diretamente no backend.

Entre os indicadores disponíveis:

* Total de vagas
* Total de candidaturas
* Taxa de aprovação
* Score médio de compatibilidade
* Distribuição de candidaturas por status
* Tendência dos últimos 7 dias
* Ranking de vagas
* Melhores candidatos

Essas informações são disponibilizadas através de uma chamada consolidada da API, reduzindo requisições desnecessárias do frontend.

---

# 💬 Chat em Tempo Real

A plataforma possui comunicação em tempo real entre candidatos e recrutadores utilizando **Socket.IO**.

```text
Candidato
    │
    │ WebSocket
    ▼
FastAPI + Socket.IO
    │
    │ WebSocket
    ▼
Recrutador
```

O sistema permite comunicação diretamente dentro da plataforma sem necessidade de utilizar serviços externos de mensagens.

---

# 🏗️ Arquitetura

```text
                    ┌─────────────────────────┐
                    │       React 19          │
                    │       Frontend          │
                    │                         │
                    │ Tailwind • Axios        │
                    │ Recharts • Socket.IO    │
                    └────────────┬────────────┘
                                 │
                         REST API / WebSocket
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │        FastAPI          │
                    │        Backend          │
                    │                         │
                    │ JWT • Socket.IO         │
                    │ Business Logic          │
                    │ Analytics               │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │       SQLAlchemy        │
                    │          ORM            │
                    └────────────┬────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
                    ▼                         ▼
             ┌─────────────┐          ┌─────────────┐
             │   SQLite    │          │ PostgreSQL  │
             │   Default   │          │  Opcional   │
             └─────────────┘          └─────────────┘
```

---

# 🛠️ Tecnologias

## Backend

| Tecnologia        | Utilização                  |
| ----------------- | --------------------------- |
| Python 3.12       | Linguagem principal         |
| FastAPI           | Framework da API            |
| SQLAlchemy        | ORM                         |
| SQLite            | Banco padrão                |
| PostgreSQL        | Banco opcional              |
| Pydantic Settings | Configuração                |
| python-jose       | JWT                         |
| passlib           | Hash de senhas              |
| Socket.IO         | Comunicação em tempo real   |
| scikit-learn      | Machine Learning / Matching |
| slowapi           | Rate limiting               |
| pytest            | Testes automatizados        |
| httpx             | Testes HTTP                 |

---

## Frontend

| Tecnologia       | Utilização          |
| ---------------- | ------------------- |
| React 19         | Interface           |
| Tailwind CSS     | Estilização         |
| Axios            | Comunicação com API |
| Recharts         | Gráficos            |
| Socket.IO Client | Chat em tempo real  |
| Lucide React     | Ícones              |

---

## Infraestrutura

| Tecnologia     | Utilização            |
| -------------- | --------------------- |
| Docker         | Containerização       |
| Docker Compose | Orquestração local    |
| GitHub Actions | CI/CD                 |
| SQLite         | Persistência local    |
| PostgreSQL     | Persistência opcional |

---

# 📂 Estrutura do Projeto

```text
SVA-Platform/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── main.py
│   │
│   ├── tests/
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── public/
│   │   ├── inicio.png
│   │   ├── dashboard - candidato.png
│   │   ├── dashboard - recrutador.png
│   │   └── vagas - candidatos.png
│   │
│   ├── src/
│   ├── package.json
│   └── ...
│
├── docker-compose.yml
├── LICENSE
└── README.md
```

---

# 🚀 Execução

## 📋 Pré-requisitos

### Opção Docker

* Docker Desktop

### Execução manual

* Python 3.12+
* Node.js 20+
* npm

---

# 🐳 Docker Compose

A forma recomendada de executar o projeto é utilizando Docker Compose.

```bash
docker compose up --build
```

Após a inicialização:

| Serviço  | URL                        |
| -------- | -------------------------- |
| Frontend | http://localhost:3000      |
| Backend  | http://localhost:8000      |
| Swagger  | http://localhost:8000/docs |

Para parar os containers:

```bash
docker compose down
```

### 💡 Desenvolvimento

Como o código é copiado para dentro da imagem Docker, alterações no código exigem um novo build:

```bash
docker compose up --build
```

Para desenvolvimento com hot-reload, utilize a execução manual.

---

# 🐍 Backend

Entre na pasta:

```bash
cd backend
```

Crie o ambiente virtual:

```bash
python -m venv venv
```

### Windows

```bash
venv\Scripts\activate
```

### Linux / macOS

```bash
source venv/bin/activate
```

Instale as dependências:

```bash
pip install -r requirements.txt
```

Copie o arquivo de configuração:

```bash
cp .env.example .env
```

No Windows, caso `cp` não esteja disponível, copie manualmente `.env.example` para `.env`.

Execute a API:

```bash
uvicorn app.main:app --reload
```

Backend:

```text
http://localhost:8000
```

Documentação Swagger:

```text
http://localhost:8000/docs
```

---

# ⚛️ Frontend

Em outro terminal:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Execute:

```bash
npm start
```

Frontend:

```text
http://localhost:3000
```

O frontend já está configurado para utilizar o backend local em:

```text
http://localhost:8000
```

---

# 🧪 Testes

Para executar os testes do backend:

```bash
cd backend
pytest -v
```

O projeto utiliza:

* pytest
* httpx
* Testes automatizados de endpoints e funcionalidades da API

---

# 🐘 PostgreSQL

O projeto utiliza **SQLite por padrão**, eliminando a necessidade de configurar um banco externo.

Para utilizar PostgreSQL através do Docker Compose:

```bash
docker compose --profile postgres up --build
```

Ou configure manualmente no `.env`:

```env
DATABASE_URL=postgresql+psycopg2://sva_user:sva_password@localhost:5432/sva_db
```

---

# 🔐 Configuração

O projeto utiliza variáveis de ambiente para configurações sensíveis.

Exemplo:

```env
SECRET_KEY=your-secret-key
DATABASE_URL=sqlite:///./sva.db
ALLOWED_ORIGINS=http://localhost:3000
RUN_SEED=true
```

> Em ambientes reais, utilize uma `SECRET_KEY` forte e nunca versionada no repositório.

---

# 🐛 Problemas Comuns

| Problema                                  | Possível causa              | Solução                                   |
| ----------------------------------------- | --------------------------- | ----------------------------------------- |
| `ModuleNotFoundError: pydantic_settings`  | Dependência ausente         | `pip install pydantic-settings==2.7.0`    |
| `password cannot be longer than 72 bytes` | Incompatibilidade do bcrypt | `pip install bcrypt==4.0.1`               |
| Erro de CORS                              | Origem não autorizada       | Verifique `ALLOWED_ORIGINS`               |
| Chat não atualiza                         | Socket.IO não configurado   | Verifique o backend e o `app/main.py`     |
| Frontend não conecta à API                | Backend não iniciado        | Execute o Uvicorn na porta 8000           |
| Imagens não aparecem no README            | Arquivos não estão no Git   | Verifique `frontend/public` e faça commit |

---

# 🔄 CI/CD

O projeto utiliza **GitHub Actions** para automatizar verificações durante o desenvolvimento.

O pipeline executa tarefas como:

```text
Push / Pull Request
        │
        ▼
GitHub Actions
        │
        ├── Testes Backend
        │
        └── Build Frontend
```

Isso permite identificar problemas automaticamente antes de integrar alterações ao projeto principal.

---

# 🗺️ Roadmap

### Concluído

* [x] Autenticação JWT
* [x] Seed automático do banco
* [x] CRUD de vagas
* [x] Sistema de candidaturas
* [x] Upload de currículos
* [x] Matching automático
* [x] TF-IDF
* [x] Similaridade de cosseno
* [x] Matching difuso de habilidades
* [x] Ranking de candidatos
* [x] Chat em tempo real
* [x] Agendamento de entrevistas
* [x] Notificações por e-mail
* [x] Dashboard de analytics
* [x] Testes automatizados
* [x] GitHub Actions
* [x] Suporte a PostgreSQL

### Futuro

* [ ] Integração com LinkedIn
* [ ] Aplicativo mobile com React Native
* [ ] Melhorias no algoritmo de matching
* [ ] Mais filtros avançados de candidatos
* [ ] Relatórios personalizados
* [ ] Integração com serviços externos de videoconferência

---

# 🔒 Segurança

O projeto possui mecanismos básicos de segurança para uma aplicação Full Stack:

* Autenticação baseada em JWT
* Senhas armazenadas com hash
* Controle de acesso por perfil
* CORS configurável
* Rate limiting
* Variáveis sensíveis através de `.env`
* Validação de dados utilizando Pydantic

---

# 📈 Diferenciais Técnicos

O SVA Platform foi desenvolvido buscando aplicar conceitos utilizados em aplicações modernas de software:

* Arquitetura desacoplada
* API REST
* Autenticação JWT
* WebSocket
* Machine Learning aplicado à análise textual
* ORM
* Persistência relacional
* Testes automatizados
* Docker
* CI/CD
* Analytics
* Comunicação em tempo real
* Upload e processamento de documentos

O projeto combina **engenharia de software + análise de dados + desenvolvimento Full Stack** em uma aplicação prática.

---

# 👨‍💻 Autor

## Adan William

**Analista de TI | NOC | Desenvolvedor Full Stack**

Experiência em tecnologia, infraestrutura, redes e desenvolvimento de aplicações Full Stack, com foco atual em desenvolvimento de software e backend.

### 🔗 Links

* GitHub: https://github.com/adanwilliamdev

---

# 📄 Licença

Este projeto está distribuído sob a licença **MIT**.

Consulte o arquivo [`LICENSE`](LICENSE) para mais informações.

---

<div align="center">

## ⭐ Gostou do projeto?

Se o **SVA Platform** foi útil ou interessante, considere deixar uma ⭐ no repositório.

<br>

**Desenvolvido com ❤️ por Adan William**

</div>
