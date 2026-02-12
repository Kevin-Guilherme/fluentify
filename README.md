# 🎤 Fluentify

> **AI-Powered Language Learning Platform**
> Pratique idiomas através de conversações interativas por áudio com feedback personalizado em tempo real.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Diferenciais](#-diferenciais)
- [Stack Tecnológica](#-stack-tecnológica)
- [Progresso do Projeto](#-progresso-do-projeto)
- [Instalação](#-instalação)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Features Implementadas](#-features-implementadas)
- [Roadmap](#-roadmap)
- [Licença](#-licença)

---

## 🎯 Visão Geral

Fluentify é uma plataforma moderna de ensino de idiomas que utiliza IA conversacional para proporcionar uma experiência de aprendizado imersiva e personalizada. Através de conversações por áudio, os usuários praticam o idioma em cenários reais e recebem feedback detalhado sobre gramática, vocabulário e fluência.

### Principais Funcionalidades

- 🎤 **Conversação por Áudio**: Practice com IA usando sua voz
- 🤖 **IA Adaptativa**: Respostas personalizadas por nível (Beginner → Fluent)
- 📊 **Feedback Detalhado**: Análise de gramática, vocabulário e fluência
- 🎮 **Gamificação**: Sistema de XP, Streak e Levels
- 📈 **Progresso Visual**: Dashboard com estatísticas e gráficos
- 🎨 **Design Moderno**: Interface dark com animações suaves

---

## 🌟 Diferenciais

- **IA Conversacional Avançada**: Groq (Llama 3.3 70B) para conversas naturais
- **Feedback Instantâneo**: Análise completa em tempo real com 9 métricas
- **RAG Contextual**: Aprende com exemplos similares para respostas melhores
- **100% Gratuito**: Stack completa em free tier (0-500 usuários)
- **Open Source**: Código aberto sob licença MIT

---

## 🛠️ Stack Tecnológica

### Backend
- **Framework**: NestJS (TypeScript)
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **IA/LLM**: Groq (Whisper STT + Llama 3.3 70B)
- **Cache/Queue**: Upstash Redis + BullMQ
- **Storage**: Cloudflare R2
- **Vector DB**: Upstash Vector
- **Deploy**: Fly.io

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS + CSS Variables
- **UI Components**: shadcn/ui + Lucide Icons
- **State Management**: Zustand + TanStack React Query
- **Auth**: Supabase Auth Client
- **Forms**: React Hook Form + Zod
- **Animations**: Framer Motion
- **Deploy**: Vercel

### DevOps
- **Version Control**: Git + GitHub
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry (planejado)
- **Testing**: Jest + Playwright (planejado)

---

## 📊 Progresso do Projeto

**Status Atual:** MVP ~75% Completo
**Última Atualização:** 11/02/2026

### ✅ Fases Completas

#### FASE 0: Setup Inicial (100%)
- [x] Scaffold Backend (NestJS)
- [x] Scaffold Frontend (Next.js)
- [x] Tooling & Config (ESLint, Prettier)
- [x] Variáveis de Ambiente

#### FASE 1: Backend Core (100%)
- [x] Prisma Schema Completo
- [x] Shared Layer (BusinessException, Interceptors, Decorators)
- [x] Auth Module (Supabase JWT)
- [x] User Module (CRUD + Sync)
- [x] Conversation Module (Orchestration)
- [x] Storage Module (Local + R2 ready)
- [x] Topics Module
- [x] Swagger Documentation
- [x] Unit Tests

#### FASE 2: Integrações IA (100%)
- [x] Groq STT Service (Whisper large-v3-turbo)
- [x] Groq LLM Service (Llama 3.3 70B)
- [x] Groq Feedback Service (Análise detalhada)
- [x] RAG Service (Upstash Vector)
- [x] Orquestração de Conversa (STT→LLM→Feedback)
- [x] XP Calculator Service
- [x] Testes de Integração

**Destaques:**
- System prompts adaptados por nível (BEGINNER, INTERMEDIATE, ADVANCED, FLUENT)
- Feedback com 9 campos analíticos
- Fórmula XP: `baseScore × (1 + durationBonus + streakBonus) × levelMultiplier`

#### FASE 3: Frontend (100%)
- [x] Design System & CSS Variables
- [x] Logo Animado (4 variantes com ondas bilaterais)
- [x] Layout Principal (Sidebar + Header)
- [x] Auth Pages (Login/Signup)
- [x] Dashboard (Stats cards, Activity graph)
- [x] Topics Page (Grid interativo)
- [x] Conversation Page (Chat + Audio recorder)
- [x] Feedback Modal (Display completo)
- [x] Profile Page
- [x] API Client & React Query

**Componentes Principais:**
```
✓ Logo (ondas sonoras animadas)
✓ Sidebar (256px, sticky, responsive)
✓ Stats Cards (gradientes vibrantes)
✓ Activity Graph (weekly bar chart)
✓ Audio Recorder (MediaRecorder API)
✓ Feedback Modal (9 métricas)
```

### ⏳ Fases Pendentes

#### FASE 4: Gamificação & Polish (0%)
- [ ] Sistema XP & Level
- [ ] Sistema Streak
- [ ] Onboarding Flow
- [ ] Responsividade Mobile

#### FASE 5: Deploy & Infra (0%)
- [ ] Deploy Backend (Fly.io)
- [ ] Deploy Frontend (Vercel)
- [ ] CI/CD (GitHub Actions)
- [ ] Monitoring (Sentry)
- [ ] Performance Optimization

#### FASE 6: Testes & Polish (0%)
- [ ] Testes E2E
- [ ] Bug Fixes
- [ ] Documentação Final

---

## 🚀 Instalação

### Pré-requisitos

- Node.js 18+ (recomendado: v20+)
- npm ou yarn
- PostgreSQL (ou Supabase account)
- Groq API Key ([console.groq.com](https://console.groq.com))

### Setup Local

#### 1. Clone o repositório
```bash
git clone https://github.com/Kevin-Guilherme/fluentify.git
cd fluentify
```

#### 2. Backend Setup
```bash
cd backend
npm install

# Configure .env (copie do .env.example)
cp .env.example .env

# Edite .env com suas credenciais:
# - DATABASE_URL
# - GROQ_API_KEY
# - SUPABASE_URL e SUPABASE_ANON_KEY

# Execute migrations
npx prisma generate
npx prisma db push

# Inicie o servidor
npm run start:dev
```

**Backend rodando em:** `http://localhost:3001`

#### 3. Frontend Setup
```bash
cd ../frontend
npm install

# Configure .env.local
cp .env.example .env.local

# Edite .env.local:
# - NEXT_PUBLIC_API_URL=http://localhost:3001
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY

# Inicie o servidor
npm run dev
```

**Frontend rodando em:** `http://localhost:3000`

### 🎨 Modo Demo

Para testar a interface sem backend:
1. O auth guard está desabilitado em modo desenvolvimento
2. Dados mock são exibidos no sidebar e dashboard
3. Ideal para desenvolvimento de UI

---

## 📁 Estrutura do Projeto

```
fluentify/
├── backend/                 # API NestJS
│   ├── src/
│   │   ├── modules/        # Módulos de negócio
│   │   │   ├── auth/
│   │   │   ├── user/
│   │   │   ├── conversation/
│   │   │   ├── groq/       # Integração IA
│   │   │   └── gamification/
│   │   ├── shared/         # Código compartilhado
│   │   └── infrastructure/ # Config, Database, External
│   ├── prisma/
│   │   └── schema.prisma
│   └── test/
│
├── frontend/               # App Next.js
│   ├── app/
│   │   ├── (auth)/        # Rotas públicas
│   │   └── (protected)/   # Rotas protegidas
│   ├── components/
│   │   ├── ui/            # shadcn/ui
│   │   ├── layout/        # Sidebar, Header, Logo
│   │   ├── dashboard/     # Stats, Charts
│   │   └── conversation/  # Chat, Audio, Feedback
│   ├── lib/               # Utils, API client
│   ├── hooks/             # Custom hooks
│   └── types/             # TypeScript types
│
├── CLAUDE.md              # Especificação completa
├── PROGRESS.md            # Tracking de progresso
└── README.md              # Este arquivo
```

---

## ✨ Features Implementadas

### Backend

#### 🔐 Autenticação & Autorização
- Integração com Supabase Auth
- JWT validation via Passport
- Guard global com suporte a rotas públicas (@Public)
- Sync automático de usuários

#### 💬 Sistema de Conversação
- CRUD completo de conversas
- Orquestração STT → LLM → Feedback
- Suporte a áudio (upload + transcrição)
- Histórico de mensagens

#### 🤖 Integração IA (Groq)
- **STT**: Whisper large-v3-turbo para transcrição
- **LLM**: Llama 3.3 70B para respostas conversacionais
- **Feedback**: Análise detalhada com 9 métricas:
  - Grammar errors (com correções)
  - Vocabulary score + highlights
  - Fluency score + notes
  - Pronunciation issues
  - Overall score
  - Suggestions, strengths, focus areas

#### 🎯 Gamificação
- XP Calculator com fórmula completa
- Level system (BEGINNER → FLUENT)
- Multipliers por nível
- Bonuses de duração e streak

### Frontend

#### 🎨 Design System
- Tema dark vibrante com CSS variables
- 4 variantes de logo animado
- Componentes com gradientes e hover effects
- Responsivo (desktop-first)

#### 📱 Páginas
- **Landing**: Hero com logo animado
- **Auth**: Login/Signup com Supabase
- **Dashboard**: Stats cards, activity graph, recent conversations
- **Topics**: Grid interativo com filtros por dificuldade
- **Conversation**: Chat interface + audio recorder
- **Feedback**: Modal com análise completa
- **Profile**: Stats detalhadas + histórico

#### 🎤 Audio Recorder
- MediaRecorder API
- 3 estados: idle, recording, processing
- Visual feedback com animações
- Suporte a webm/opus

---

## 🗺️ Roadmap

### v0.1.0 (Atual - MVP 75%)
- [x] Backend core completo
- [x] Integração IA funcional
- [x] Frontend com todas as páginas
- [x] Design system implementado

### v0.2.0 (Próximo - Gamificação)
- [ ] Sistema XP & Level-up
- [ ] Streak tracking
- [ ] Onboarding flow
- [ ] Mobile responsive

### v1.0.0 (MVP Completo)
- [ ] Deploy produção
- [ ] CI/CD pipeline
- [ ] Testes E2E
- [ ] Monitoring com Sentry
- [ ] Performance optimization

### v1.1.0 (Futuro)
- [ ] TTS (IA falar resposta)
- [ ] Comparação de pronúncia
- [ ] Achievements avançados
- [ ] Social features
- [ ] Modo offline

---

## 📝 Documentação Adicional

- **[CLAUDE.md](./CLAUDE.md)**: Especificação técnica completa
- **[PROGRESS.md](./PROGRESS.md)**: Tracking detalhado de progresso
- **[GROQ_CONTEXT.md](./GROQ_CONTEXT.md)**: Contexto da integração IA
- **Frontend Guides**: `/frontend/COMPONENT_GUIDE.md`, `/frontend/DEPLOYMENT_CHECKLIST.md`

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor, siga os passos:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 👨‍💻 Autor

**Kevin Souza**
Senior Fullstack Developer & Software Architect
Surf Telecom

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 🙏 Agradecimentos

- [Groq](https://groq.com/) - IA inference ultrarrápida
- [Supabase](https://supabase.com/) - Backend as a Service
- [Vercel](https://vercel.com/) - Hosting do frontend
- [shadcn/ui](https://ui.shadcn.com/) - Componentes UI
- Comunidade open source

---

<p align="center">
  Feito com ❤️ e <strong>muita IA</strong>
</p>

<p align="center">
  <a href="https://github.com/Kevin-Guilherme/fluentify">⭐ Star no GitHub</a> •
  <a href="https://github.com/Kevin-Guilherme/fluentify/issues">🐛 Report Bug</a> •
  <a href="https://github.com/Kevin-Guilherme/fluentify/issues">✨ Request Feature</a>
</p>
