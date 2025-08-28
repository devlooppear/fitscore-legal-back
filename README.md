# 🏗️ Mini FitScore LEGAL™ — Backend

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](#)  
[![License](https://img.shields.io/badge/license-MIT-blue)](#)  
[![Backend](https://img.shields.io/badge/backend-NestJS-orange)](https://nestjs.com/)  
[![Database](https://img.shields.io/badge/database-Supabase-blueviolet)](https://supabase.com/)  

---

## 📌 Descrição
O **Mini FitScore LEGAL™** é uma versão simplificada do algoritmo de avaliação de candidatos, baseado em **Performance, Energia e Cultura**.  

O backend é responsável por:
- Persistir usuários e FitScores
- Calcular classificações automaticamente
- Enviar notificações assíncronas
- Suportar dashboard de recrutadores

---

## 📌 Entidades e Atributos

### 👤 User
Usuário base (candidato ou recrutador).

```ts
User {
  id: number (PK)
  name: string
  email: string (unique)
  passwordHash: string
  role: 'CANDIDATE' | 'RECRUITER' // padrão CANDIDATE
  createdAt: Date
}
```

## 🧮 FitScore
Respostas agregadas do formulário.

```ts
FitScore {
  id: number (PK)
  userId: number (FK → User.id)
  performance: number   // 0–100
  energy: number        // 0–100
  culture: number       // 0–100
  totalScore: number    // média
  classification: 'FIT_ALTISSIMO' | 'FIT_APROVADO' | 'FIT_QUESTIONAVEL' | 'FORA_DO_PERFIL'
  createdAt: Date
}
```
## 🔔 Notification
Registra notificações enviadas.

```ts
Notification {
  id: number (PK)
  userId: number (FK → User.id)
  type: 'RESULTADO' | 'RELATORIO_APROVADOS'
  message: string
  sentAt: Date
}
```

## 📌 Endpoints da API

### 🔐 Auth
POST /auth/register – Cadastra um novo usuário.

```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "123456",
  "role": "CANDIDATE"
}
```
POST /auth/login – Retorna token JWT.

```json
{
  "email": "joao@email.com",
  "password": "123456"
}
```
### 👤 Users
GET /users/me – Retorna informações do usuário logado.

```json
{
  "id": 1,
  "name": "João Silva",
  "email": "joao@email.com",
  "role": "CANDIDATE",
  "createdAt": "2025-08-26T10:00:00Z"
}
```

### 🧮 FitScore
POST /fitscore – Cria um FitScore para o candidato.

```json
{
  "performance": 80,
  "energy": 70,
  "culture": 90
}
```
GET /fitscore/me – Consulta o resultado do próprio FitScore.

```json
{
  "performance": 80,
  "energy": 70,
  "culture": 90,
  "totalScore": 80,
  "classification": "FIT_ALTISSIMO"
}
```
GET /fitscore/candidates – Lista candidatos avaliados (filtros opcionais).

GET /fitscore/candidates/:id – Detalhes de um candidato específico.

```json
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
```

### 🔔 Notifications
GET /notifications – Lista notificações recebidas pelo usuário.

```json
[
  {
    "id": 1,
    "type": "RESULTADO",
    "message": "Seu FitScore foi FIT_ALTISSIMO (80)",
    "sentAt": "2025-08-26T12:00:00Z"
  }
]
```

## ⚡ Lógica Assíncrona — Trigger de FitScore
Quando um candidato envia seu FitScore, o backend executa uma lógica assíncrona para calcular, salvar e notificar.

### 📝 Passo a passo do processo
Validação do usuário

Apenas usuários com role: CANDIDATE podem enviar respostas.

Caso contrário, é lançada uma exceção ForbiddenException.

Cálculo do FitScore

Média das três dimensões: performance, energy, culture.

Determinação da classificação (classification) baseada na média:

```
  FIT_ALTISSIMO: ≥ 80

  FIT_APROVADO: 60–79

  FIT_QUESTIONAVEL: 40–59

  FORA_DO_PERFIL: < 40
```

### 💾 Persistência

Cria e salva o registro no banco de dados (fitscores).

Trigger assíncrono de notificação

Após salvar o FitScore, o serviço chama NotificationsService.create.

Tipo da notificação: RESULTADO.

Mensagem enviada ao candidato com classificação e média.

## Resposta

Retorna o FitScore criado junto com os dados básicos do usuário.

### 📌 Fluxo Resumido
Candidato registra/login → envia formulário → POST /fitscore.

Backend calcula totalScore + classification → salva FitScore → cria Notification para candidato.

Candidato consulta seu resultado em /fitscore/me.

Recrutador acessa /fitscore/candidates (lista) e /fitscore/candidates/:id (detalhes).

Processo assíncrono gera relatório de aprovados (totalScore ≥ 80) → notifica gestor (RELATORIO_APROVADOS).

## ⚙️ Tecnologias
Backend: NestJS, TypeORM, PostgreSQL (Supabase)

Autenticação: JWT

Notificações: Trigger assíncrono via service

Estilo de código: TypeScript + ESLint + Prettier