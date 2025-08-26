# Mini FitScore LEGAL™ — Backend

## Contexto

O **FitScore LEGAL™** é um algoritmo que avalia candidatos com base em três pilares:
- **Performance:** Experiência e entregas
- **Energia:** Disponibilidade e ritmo
- **Cultura:** Valores da LEGAL

Este projeto implementa uma versão simplificada (mini-MVP) do FitScore LEGAL™, com backend para persistência, autenticação e lógica de negócio.

---

## Requisitos do Desafio

- **Formulário FitScore:** 10 perguntas em 3 blocos (Performance, Energia, Cultura)
- **Dashboard:** Listagem de candidatos avaliados, filtros, estados de loading/vazio/erro
- **Persistência:** Usar Supabase (preferencial), Firebase, JSON Server ou mock local
- **Processamento Assíncrono:**
  - Notificação de resultado ao candidato após avaliação
  - Relatório de aprovados (FitScore ≥ 80) para gestor a cada 12h
- **Deploy público do front**
- **README completo:** Fórmula, setup, decisões, explicação da solução assíncrona

---

## Modelos de Dados

### User

```ts
User {
  id: number (PK)
  name: string
  email: string (único)
  passwordHash: string
  role: 'RECRUITER' | 'CANDIDATE'
  createdAt: Date
}
```
> **Obs:** Usuários com role `'RECRUITER'` acessam como avaliadores; usuários com role `'CANDIDATE'` acessam como candidatos.

### Candidate

```ts
Candidate {
  id: number (PK)
  userId: number (FK → User.id)
  phone?: string
  resumeUrl?: string
  createdAt: Date
}
```

### FitScore

```ts
FitScore {
  id: number (PK)
  candidateId: number (FK → Candidate.id)
  performance: number  // 0–100
  energy: number       // 0–100
  culture: number      // 0–100
  totalScore: number   // média dos três
  classification: 'FIT_ALTISSIMO' | 'FIT_APROVADO' | 'FIT_QUESTIONAVEL' | 'FORA_DO_PERFIL'
  createdAt: Date
}
```

#### Classificação FitScore

| Classificação      | Score      |
|--------------------|------------|
| FIT_ALTISSIMO      | ≥ 80       |
| FIT_APROVADO       | 60–79      |
| FIT_QUESTIONAVEL   | 40–59      |
| FORA_DO_PERFIL     | < 40       |

### Notification

```ts
Notification {
  id: number (PK)
  userId: number (FK → User.id) // candidato ou recrutador
  type: 'RESULTADO' | 'RELATORIO_APROVADOS'
  message: string
  sentAt: Date
}
```

---

## Arquitetura & Decisões Técnicas

- **Backend:** Node.js + PostgreSQL (conexão direta, sem Supabase)
- **Frontend:** [Descrever no README do front]
- **Processamento Assíncrono:** [Descrever solução utilizada, ex: cron jobs, scripts Node, etc.]
- **Deploy:** [Descrever URL do deploy do front]

---

## Setup & Execução

1. **Clone o repositório**
2. **Configure o banco PostgreSQL localmente** com as variáveis:
   - `POSTGRES_USER=mehere`
   - `POSTGRES_PASSWORD=password80082`
   - `POSTGRES_DB=fitscore`
   - `DATABASE_URL=postgres://mehere:password80082@localhost:5432/fitscore`
   - `ENVIRONMENT=LOCAL`
   - `PORT=5780`
3. **Instale dependências:**  
   `npm install`
4. **Rode as migrations/seeds do banco** (se houver)
5. **Inicie o backend:**  
   `npm run dev`
6. **Configure o processamento assíncrono conforme sua solução**

---

## Fórmula de Cálculo do FitScore

```ts
totalScore = (performance + energy + culture) / 3
```
- Classificação conforme tabela acima.

---

## Referências

- [PostgreSQL Docs](https://www.postgresql.org/docs/)


---

## Observações

- Caso não seja possível usar Supabase, documentar alternativa utilizada.
- Explicação detalhada da solução assíncrona está no final deste README.

---