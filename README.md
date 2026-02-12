# 🎯 Fluentify - AI-Powered Language Learning Platform

Plataforma de ensino de idiomas com IA que oferece conversação interativa por áudio, feedback personalizado em tempo real e gamificação.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm ou yarn
- PostgreSQL (via Supabase)
- Groq API key

### Setup

1. **Clone e instale dependências:**
```bash
# Backend
cd backend
npm install
cp .env.example .env
# Configure as variáveis de ambiente no .env

# Frontend
cd ../frontend
npm install
cp .env.example .env.local
# Configure as variáveis de ambiente
```

2. **Configure Prisma (Backend):**
```bash
cd backend
npm run prisma:generate
npm run prisma:push
npm run prisma:seed
```

3. **Rode os projetos:**
```bash
# Backend (porta 3001)
cd backend
npm run start:dev

# Frontend (porta 3000)
cd frontend
npm run dev
```

## 📁 Estrutura do Projeto

```
fluentify/
├── backend/          # NestJS API
│   ├── src/
│   │   ├── infrastructure/  # Config, Database, External
│   │   ├── modules/         # Business Logic
│   │   └── shared/          # Shared Code
│   └── prisma/
│       ├── schema.prisma
│       └── seed.ts
│
├── frontend/         # Next.js 14+ App
│   ├── app/         # App Router
│   ├── components/  # React Components
│   ├── lib/        # Utils & API Client
│   ├── hooks/      # Custom Hooks
│   └── store/      # Zustand Stores
│
├── CLAUDE.md       # Especificação Completa
└── README.md
```

## 🛠️ Stack Tecnológica

**Backend:**
- NestJS + TypeScript
- Prisma ORM + PostgreSQL (Supabase)
- Groq API (Whisper STT + Llama 3.3 LLM)
- Upstash (Redis + Vector DB)
- Cloudflare R2 (Storage)

**Frontend:**
- Next.js 14+ (App Router)
- Tailwind CSS + shadcn/ui
- TanStack React Query
- Zustand
- Supabase Auth Client

## 📝 Plano de Implementação

Veja o `CLAUDE.md` para o plano completo com 40+ sub-tasks organizadas em 7 fases.

**Fases:**
- ✅ FASE 0: Setup Inicial (Backend + Frontend + Tooling)
- 🔄 FASE 1: Backend Core (Auth, User, Conversation, Storage, Topics)
- 🔄 FASE 2: Integrações IA (Groq STT/LLM/Feedback, RAG)
- 🔄 FASE 3: Frontend (Design System, Auth, Dashboard, Conversation)
- 🔄 FASE 4: Gamificação (XP, Level, Streak, Onboarding)
- 🔄 FASE 5: Deploy (Fly.io + Vercel + CI/CD)
- 🔄 FASE 6: Testes & Polish

## 🔑 Variáveis de Ambiente

### Backend (.env)
```env
DATABASE_URL=postgresql://...
SUPABASE_URL=https://...
SUPABASE_JWT_SECRET=...
GROQ_API_KEY=gsk_...
UPSTASH_REDIS_URL=...
UPSTASH_VECTOR_URL=...
R2_ACCOUNT_ID=...
PORT=3001
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## 📚 Documentação

- [CLAUDE.md](./CLAUDE.md) - Especificação completa do projeto
- [Backend API Docs](http://localhost:3001/api/docs) - Swagger (após setup)

## 📄 Licença

MIT

---

**🎯 MVP em desenvolvimento - 120h estimadas**