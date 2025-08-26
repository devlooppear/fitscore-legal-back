📌 Entidades e Atributos
User

Usuário base (candidato ou recrutador).

User {
  id: number (PK)
  name: string
  email: string (unique)
  passwordHash: string
  role: 'CANDIDATE' | 'RECRUITER'
  createdAt: Date
}

FitScore

Respostas agregadas do formulário.

FitScore {
  id: number (PK)
  userId: number (FK → User.id, role='CANDIDATE')
  performance: number   // 0–100
  energy: number        // 0–100
  culture: number       // 0–100
  totalScore: number    // média
  classification: 'FIT_ALTISSIMO' | 'FIT_APROVADO' | 'FIT_QUESTIONAVEL' | 'FORA_DO_PERFIL'
  createdAt: Date
}

Notification

Registra notificações enviadas.

Notification {
  id: number (PK)
  userId: number (FK → User.id)
  type: 'RESULTADO' | 'RELATORIO_APROVADOS'
  message: string
  sentAt: Date
}

📌 Endpoints da API
🔐 Auth

POST /auth/register
Cadastra um novo usuário.

{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "123456",
  "role": "CANDIDATE"
}


POST /auth/login
Retorna token JWT.

{
  "email": "joao@email.com",
  "password": "123456"
}


POST /auth/logout
Invalida sessão (ex.: blacklist do token).

👤 Candidate (autoatendimento)

POST /fitscore
Candidato envia respostas já agregadas.

{
  "performance": 80,
  "energy": 70,
  "culture": 90
}


→ Backend calcula totalScore + classification, salva e notifica candidato.

GET /fitscore/me
Consulta o resultado do próprio FitScore.

{
  "performance": 80,
  "energy": 70,
  "culture": 90,
  "totalScore": 80,
  "classification": "FIT_ALTISSIMO"
}

📊 Recruiter (dashboard)

GET /candidates
Lista candidatos avaliados (pode filtrar por classificação).

GET /candidates?classification=FIT_APROVADO


Response:

[
  {
    "id": 1,
    "name": "João Silva",
    "email": "joao@email.com",
    "fitScore": {
      "totalScore": 75,
      "classification": "FIT_APROVADO"
    }
  }
]


GET /candidates/:id
Detalhes completos de um candidato.

{
  "id": 1,
  "name": "João Silva",
  "email": "joao@email.com",
  "fitScore": {
    "performance": 80,
    "energy": 70,
    "culture": 75,
    "totalScore": 75,
    "classification": "FIT_APROVADO"
  },
  "createdAt": "2025-08-26T10:00:00Z"
}

🔔 Notifications

GET /notifications/me
Lista notificações recebidas pelo usuário (candidato ou recrutador).

[
  {
    "id": 1,
    "type": "RESULTADO",
    "message": "Seu FitScore foi FIT_ALTISSIMO (80)",
    "sentAt": "2025-08-26T12:00:00Z"
  }
]

📌 Resumo do Fluxo

Candidato registra/login → responde formulário → POST /fitscore.

Backend calcula totalScore + classification → salva FitScore → cria Notification para candidato.

Candidato pode consultar seu resultado em /fitscore/me.

Recrutador acessa /candidates (lista) e /candidates/:id (detalhes com scores).

Processo assíncrono gera relatório de aprovados (≥80) → notifica gestor (RELATORIO_APROVADOS).