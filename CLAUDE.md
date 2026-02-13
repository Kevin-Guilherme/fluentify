# ?? Fluentify - Plataforma de Ensino de Idiomas com IA

## ?? �ndice
- [Vis�o Geral](#vis�o-geral)
- [Identidade Visual](#identidade-visual)
- [Layout & Design System](#layout--design-system)
- [Stack Tecnol�gica](#stack-tecnol�gica)
- [Padr�es de Arquitetura](#padr�es-de-arquitetura)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Prefer�ncias de Desenvolvimento](#prefer�ncias-de-desenvolvimento)
- [Escopo Completo](#escopo-completo)
- [Checklist de Entrega](#checklist-de-entrega)
- [Plano de Implementação](#plano-de-implementação)

---

## 🗺️ Plano de Implementação

> Plano detalhado com checkboxes para rastrear progresso sessão a sessão.
> Cada sub-task lista: descrição, arquivos, dependências e critérios de aceite.

### Grafo de Dependências

```
FASE 0 (Setup)
  0.1 Scaffold Backend ──┐
  0.2 Scaffold Frontend ─┤
  0.3 Tooling ───────────┤
  0.4 Env Vars ──────────┘
           │
           ▼
FASE 1 (Backend Core)
  1.1 Prisma Schema ──► 1.2 Shared Layer ──► 1.3 Auth Module
                                                    │
                              1.7 Topics ◄──────────┤
                                                    ▼
                                              1.4 User Module
                                                    │
                              1.6 Storage ◄─────────┤
                                    │               ▼
                                    └──► 1.5 Conversation Module
                                                    │
                              1.8 Swagger ◄─────────┤
                              1.9 Tests ◄───────────┘
           │
           ▼
FASE 2 (Integrações IA)         FASE 3 (Frontend - paralelo)
  2.1 Groq STT ──────┐           3.1 Design System ─┐
  2.2 Groq LLM ──────┤           3.2 Layout ────────┤
  2.3 Groq Feedback ──┤           3.3 Auth Pages ◄───┤
  2.4 RAG Service ◄───┘           3.4 Dashboard ◄────┤
         │                        3.5 Topics ◄───────┤
         ▼                        3.6 Conversation ◄──┤
  2.5 Orquestração                3.7 Feedback ◄─────┤
         │                        3.8 Profile ◄──────┤
  2.6 Tests ◄─┘                   3.9 API Integration ◄┘
           │                              │
           ▼                              ▼
FASE 4 (Gamificação) ◄── depende de FASE 1-3
  4.1 XP/Level  4.2 Streak  4.3 Onboarding  4.4 Responsive
           │
           ▼
FASE 5 (Deploy)
  5.1 Fly.io  5.2 Vercel  5.3 CI/CD  5.4 Sentry  5.5 Performance
           │
           ▼
FASE 6 (Testes & Polish)
  6.1 E2E  6.2 Bug Fixes
```

---

## 📊 Status Atual do Projeto

**Última atualização:** 12 de Fevereiro de 2026

### ✅ Completado (MVP Funcional)

**Backend:**
- ✅ Autenticação Supabase (SupabaseAuthGuard com ECC JWT)
- ✅ Auth Module com sync de usuário local
- ✅ User Module com CRUD completo
- ✅ Conversation Module com orquestração de IA
- ✅ Groq LLM Service (Llama 3.3 70B)
- ✅ Groq Feedback Service (análise de conversas)
- ✅ Storage Service (local + preparado para R2)
- ✅ Topics Module com seed de exemplos
- ✅ Sistema de XP e Level
- ✅ Sistema de Streak
- ✅ Gamificação completa
- ✅ Exception handling com BusinessException
- ✅ Swagger docs completo

**Frontend:**
- ✅ Design System (tema dark + paleta de cores)
- ✅ Layout com Sidebar + Header
- ✅ Auth Pages (Login/Signup com Supabase)
- ✅ Dashboard com stats cards
- ✅ Topics Page
- ✅ Conversation Page (texto)
- ✅ Feedback Modal
- ✅ Profile Page
- ✅ Onboarding Flow (3 steps)
- ✅ API Client com Bearer token automático
- ✅ React Query cache management
- ✅ Responsive mobile

### 🚧 Em Progresso

- 🔄 **Audio Implementation** (postponed - MVP usa texto)
  - Groq STT (Whisper) existe mas não está integrado
  - AudioRecorder component existe mas não está em uso
  - Planejado para v1.1

### 📝 Próximas Implementações

**Fase 2 - IA (Pendentes):**
- [ ] 2.1 Groq STT integration (áudio → texto)
- [ ] 2.4 RAG Service (Upstash Vector)
- [ ] 2.6 Testes de integração IA

**Fase 5 - Deploy:**
- [ ] 5.1 Deploy Backend (Fly.io)
- [ ] 5.2 Deploy Frontend (Vercel)
- [ ] 5.3 CI/CD (GitHub Actions)
- [ ] 5.4 Monitoring (Sentry)
- [ ] 5.5 Performance optimization

**Fase 6 - Testes & Polish:**
- [ ] 6.1 E2E Testing
- [ ] 6.2 Bug fixes e polish

### 🐛 Bugs Corrigidos Nesta Sessão

1. **401 Unauthorized** - Guards locais sobrescrevendo guard global ✅
2. **400 Bad Request (Onboarding)** - Enum case sensitivity ✅
3. **500 Internal Server Error (Conversation)** - @CurrentUser decorator bug ✅
4. **Onboarding Loop** - React Query cache stale ✅
5. **IA Infinita "Thinking"** - Missing AI orchestration ✅

### 🎯 MVP v1.0 Status

**Funcionalidades Essenciais:** ✅ 100% Completo
- Criar conta e login ✅
- Iniciar conversação ✅
- Enviar mensagens (texto) ✅
- IA responde com Groq LLM ✅
- Feedback detalhado ✅
- Sistema XP e Level ✅
- Sistema Streak ✅
- Dashboard com stats ✅
- Histórico de conversas ✅

**Pronto para:** Testes beta com usuários reais (texto)
**Próximo marco:** Deploy em produção (Vercel + Fly.io)

---

### Tabela de Sessões Recomendadas

| Sessão | Fase | Tasks | Horas | Foco |
|--------|------|-------|-------|------|
| 1 | 0 | 0.1-0.4 | 3h | Setup inicial completo |
| 2 | 1 | 1.1-1.2 | 4h | Prisma + Shared layer |
| 3 | 1 | 1.3 | 5h | Auth module |
| 4 | 1 | 1.4 | 3h | User module |
| 5 | 1 | 1.5 | 6h | Conversation module |
| 6 | 1 | 1.6-1.7 | 5h | Storage + Topics |
| 7 | 1 | 1.8-1.9 | 4h | Swagger + Tests |
| 8 | 2 | 2.1 | 4h | Groq STT |
| 9 | 2 | 2.2 | 5h | Groq LLM |
| 10 | 2 | 2.3 | 5h | Groq Feedback |
| 11 | 2 | 2.4 | 6h | RAG Service |
| 12 | 2 | 2.5-2.6 | 5h | Orquestração + Tests |
| 13 | 3 | 3.1-3.2 | 5h | Design system + Layout |
| 14 | 3 | 3.3 | 4h | Auth pages |
| 15 | 3 | 3.4 | 4h | Dashboard |
| 16 | 3 | 3.5-3.6 | 5h | Topics + Conversation page |
| 17 | 3 | 3.7-3.9 | 5h | Feedback + Profile + API |
| 18 | 4 | 4.1-4.4 | 7h | Gamificação + Responsive |
| 19 | 5 | 5.1-5.3 | 5h | Deploy + CI/CD |
| 20 | 5 | 5.4-5.5 | 3h | Sentry + Performance |
| 21 | 6 | 6.1 | 5h | E2E testing |
| 22 | 6 | 6.2 | 4h | Bug fixes + Polish |
| | | **Total** | **~89h** | **Dentro do budget de 120h** |

---

### FASE 0: Setup Inicial (3h) - ✅ COMPLETA

#### - [x] 0.1 Scaffold Backend
**Descrição:** Criar projeto NestJS com estrutura de pastas conforme spec.
**Arquivos:**
```
backend/
├── src/
│   ├── infrastructure/
│   │   ├── config/
│   │   ├── database/
│   │   └── external/
│   │       ├── groq/
│   │       ├── supabase/
│   │       └── cloudflare/
│   ├── modules/
│   │   ├── auth/
│   │   ├── user/
│   │   ├── conversation/
│   │   ├── groq/
│   │   ├── rag/
│   │   └── storage/
│   ├── shared/
│   │   ├── filters/
│   │   ├── interceptors/
│   │   ├── pipes/
│   │   ├── decorators/
│   │   ├── enums/
│   │   └── exceptions/
│   ├── app.module.ts
│   └── main.ts
├── prisma/
│   └── schema.prisma
├── .env.example
├── nest-cli.json
├── tsconfig.json
└── package.json
```
**Dependências:** Nenhuma
**Critérios de Aceite:**
- `npm run start:dev` roda sem erros
- Estrutura de pastas criada
- `GET /health` retorna 200

#### - [x] 0.2 Scaffold Frontend
**Descrição:** Criar projeto Next.js 14+ com App Router, Tailwind CSS, shadcn/ui.
**Arquivos:**
```
frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (protected)/
│   │   ├── dashboard/page.tsx
│   │   ├── conversation/[id]/page.tsx
│   │   ├── topics/page.tsx
│   │   ├── profile/page.tsx
│   │   └── layout.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/ (shadcn)
│   ├── layout/
│   ├── dashboard/
│   ├── conversation/
│   └── profile/
├── lib/
│   ├── api/
│   ├── supabase/
│   ├── utils.ts
│   └── constants.ts
├── hooks/
├── store/
├── types/
├── tailwind.config.ts
├── next.config.ts
└── package.json
```
**Dependências:** Nenhuma
**Critérios de Aceite:**
- `npm run dev` roda sem erros
- shadcn/ui inicializado com componentes base (button, card, input, dialog)
- CSS variables do design system no `globals.css`

#### - [x] 0.3 Tooling & Config
**Descrição:** ESLint, Prettier, Git hooks (husky + lint-staged) em ambos os projetos.
**Arquivos:**
```
.husky/pre-commit
backend/.eslintrc.js
backend/.prettierrc
frontend/.eslintrc.json
frontend/.prettierrc
```
**Dependências:** 0.1, 0.2
**Critérios de Aceite:**
- `npm run lint` passa em ambos os projetos
- Pre-commit hook executa lint automaticamente

#### - [x] 0.4 Variáveis de Ambiente
**Descrição:** Configurar `.env.example` e validação de env vars com `@nestjs/config` + Zod.
**Arquivos:**
```
backend/.env.example
backend/src/infrastructure/config/env.validation.ts
backend/src/infrastructure/config/config.module.ts
frontend/.env.example
frontend/.env.local (gitignored)
```
**Variáveis Backend:**
```env
# Database
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_JWT_SECRET=your-jwt-secret

# Groq
GROQ_API_KEY=gsk_...

# Upstash Redis
UPSTASH_REDIS_URL=https://...
UPSTASH_REDIS_TOKEN=...

# Upstash Vector
UPSTASH_VECTOR_URL=https://...
UPSTASH_VECTOR_TOKEN=...

# Cloudflare R2
R2_ACCOUNT_ID=...
R2_ACCESS_KEY=...
R2_SECRET_KEY=...
R2_BUCKET_NAME=fluentify-audio
R2_PUBLIC_URL=https://...

# App
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```
**Variáveis Frontend:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```
**Dependências:** 0.1, 0.2
**Critérios de Aceite:**
- App falha com mensagem clara se env var obrigatória estiver faltando
- `.env.example` documenta todas as variáveis

---

### FASE 1: Backend Core (35h) - ✅ COMPLETA

#### - [x] 1.1 Prisma Schema Completo
**Descrição:** Schema completo com todos os models, enums, relations e @@map para snake_case.
**Arquivos:**
```
backend/prisma/schema.prisma
backend/prisma/seed.ts
```
**Schema:**
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

enum UserLevel {
  BEGINNER
  INTERMEDIATE
  ADVANCED
  FLUENT
}

enum ConversationStatus {
  ACTIVE
  COMPLETED
  ABANDONED
}

enum MessageRole {
  USER
  ASSISTANT
  SYSTEM
}

model User {
  id            String    @id @default(uuid())
  supabaseId    String    @unique @map("supabase_id")
  email         String    @unique
  name          String
  avatarUrl     String?   @map("avatar_url")
  level         UserLevel @default(BEGINNER)
  xp            Int       @default(0)
  streak        Int       @default(0)
  lastActiveAt  DateTime? @map("last_active_at")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")

  conversations Conversation[]
  achievements  UserAchievement[]

  @@map("users")
}

model Topic {
  id          String   @id @default(uuid())
  slug        String   @unique
  title       String
  description String
  emoji       String
  difficulty  UserLevel @default(BEGINNER)
  category    String
  systemPrompt String  @map("system_prompt") @db.Text
  isActive    Boolean  @default(true) @map("is_active")
  sortOrder   Int      @default(0) @map("sort_order")
  createdAt   DateTime @default(now()) @map("created_at")

  conversations Conversation[]

  @@map("topics")
}

model Conversation {
  id        String             @id @default(uuid())
  userId    String             @map("user_id")
  topicId   String             @map("topic_id")
  status    ConversationStatus @default(ACTIVE)
  score     Int?
  xpEarned  Int?               @map("xp_earned")
  duration  Int?               // segundos
  createdAt DateTime           @default(now()) @map("created_at")
  updatedAt DateTime           @updatedAt @map("updated_at")

  user      User               @relation(fields: [userId], references: [id], onDelete: Cascade)
  topic     Topic              @relation(fields: [topicId], references: [id])
  messages  Message[]
  feedback  ConversationFeedback?

  @@map("conversations")
}

model Message {
  id             String      @id @default(uuid())
  conversationId String      @map("conversation_id")
  role           MessageRole
  content        String      @db.Text
  audioUrl       String?     @map("audio_url")
  duration       Int?        // segundos do áudio
  createdAt      DateTime    @default(now()) @map("created_at")

  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)

  @@map("messages")
}

model ConversationFeedback {
  id              String   @id @default(uuid())
  conversationId  String   @unique @map("conversation_id")
  grammarScore    Int      @map("grammar_score")    // 0-100
  vocabularyScore Int      @map("vocabulary_score")  // 0-100
  fluencyScore    Int      @map("fluency_score")     // 0-100
  overallScore    Int      @map("overall_score")     // 0-100
  grammarErrors   Json     @map("grammar_errors")    // [{error, correction, explanation}]
  suggestions     Json                                // [string]
  strengths       Json                                // [string]
  createdAt       DateTime @default(now()) @map("created_at")

  conversation    Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)

  @@map("conversation_feedbacks")
}

model UserAchievement {
  id          String   @id @default(uuid())
  userId      String   @map("user_id")
  type        String   // "first_conversation", "streak_7", "level_up", etc
  metadata    Json?    // dados extras do achievement
  unlockedAt  DateTime @default(now()) @map("unlocked_at")

  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, type])
  @@map("user_achievements")
}
```
**Dependências:** 0.1, 0.4
**Critérios de Aceite:**
- `npx prisma generate` sem erros
- `npx prisma db push` aplica schema no Supabase
- Seed com 10+ topics funciona

#### - [ ] 1.2 Shared Layer
**Descrição:** Exceptions, filters, interceptors e decorators compartilhados.
**Arquivos:**
```
backend/src/shared/enums/mapped-returns.enum.ts
backend/src/shared/exceptions/business.exception.ts
backend/src/shared/filters/all-exceptions.filter.ts
backend/src/shared/interceptors/transform.interceptor.ts
backend/src/shared/decorators/current-user.decorator.ts
backend/src/shared/decorators/public.decorator.ts
backend/src/shared/pipes/validation.pipe.ts
```
**Código-chave - BusinessException:**
```typescript
// business.exception.ts
import { HttpException, HttpStatus } from '@nestjs/common';
import { MappedsReturnsEnum } from '../enums/mapped-returns.enum';

export class BusinessException extends HttpException {
  constructor(
    public readonly code: MappedsReturnsEnum,
    message: string,
    httpStatus: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super({ code, message, statusCode: httpStatus }, httpStatus);
  }
}
```
**Código-chave - MappedsReturnsEnum:**
```typescript
// mapped-returns.enum.ts
export enum MappedsReturnsEnum {
  // Auth
  INVALID_CREDENTIALS = 'AUTH_001',
  TOKEN_EXPIRED = 'AUTH_002',
  UNAUTHORIZED = 'AUTH_003',

  // User
  USER_NOT_FOUND = 'USER_001',
  USER_ALREADY_EXISTS = 'USER_002',

  // Conversation
  CONVERSATION_NOT_FOUND = 'CONV_001',
  CONVERSATION_ALREADY_COMPLETED = 'CONV_002',
  CONVERSATION_LIMIT_REACHED = 'CONV_003',

  // Groq
  GROQ_API_ERROR = 'GROQ_001',
  GROQ_TRANSCRIPTION_FAILED = 'GROQ_002',
  GROQ_RATE_LIMIT = 'GROQ_003',

  // Storage
  STORAGE_UPLOAD_FAILED = 'STOR_001',
  INVALID_AUDIO_FORMAT = 'STOR_002',

  // Topic
  TOPIC_NOT_FOUND = 'TOPIC_001',

  // RAG
  RAG_SEARCH_FAILED = 'RAG_001',
}
```
**Código-chave - AllExceptionsFilter:**
```typescript
// all-exceptions.filter.ts
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (exception instanceof BusinessException) {
      const body = exception.getResponse() as any;
      return response.status(exception.getStatus()).json({
        success: false,
        error: { code: body.code, message: body.message },
        timestamp: new Date().toISOString(),
      });
    }

    if (exception instanceof HttpException) {
      return response.status(exception.getStatus()).json({
        success: false,
        error: { code: 'INTERNAL', message: exception.message },
        timestamp: new Date().toISOString(),
      });
    }

    this.logger.error('Unhandled exception', exception);
    return response.status(500).json({
      success: false,
      error: { code: 'INTERNAL', message: 'Internal server error' },
      timestamp: new Date().toISOString(),
    });
  }
}
```
**Código-chave - TransformInterceptor:**
```typescript
// transform.interceptor.ts
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
```
**Código-chave - Decorators:**
```typescript
// current-user.decorator.ts
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

// public.decorator.ts
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```
**Dependências:** 0.1
**Critérios de Aceite:**
- BusinessException retorna formato `{ success, error: { code, message }, timestamp }`
- TransformInterceptor wrapa respostas em `{ success, data, timestamp }`
- @Public() e @CurrentUser() funcionam
- AllExceptionsFilter captura e formata todos os tipos de erro

#### - [ ] 1.3 Auth Module
**Descrição:** Autenticação via Supabase JWT com Passport, guard global e sync de usuário local.
**Arquivos:**
```
backend/src/modules/auth/auth.module.ts
backend/src/modules/auth/auth.controller.ts
backend/src/modules/auth/auth.service.ts
backend/src/modules/auth/strategies/supabase-jwt.strategy.ts
backend/src/modules/auth/guards/supabase-jwt.guard.ts
backend/src/modules/auth/dto/auth-response.dto.ts
```
**Fluxo:**
1. Frontend autentica com Supabase (login/signup)
2. Frontend envia `Authorization: Bearer <supabase_access_token>` nas requests
3. Backend valida JWT com `SUPABASE_JWT_SECRET` via Passport
4. Guard global aplica em todas as rotas (exceto @Public())
5. Na primeira request, cria user local via `auth.service.syncUser()`

**Endpoints:**
- `POST /auth/sync` - Sync user local (chamado após login no frontend)
- `GET /auth/me` - Retorna dados do user autenticado

**Dependências:** 1.1, 1.2
**Critérios de Aceite:**
- Requests sem token retornam 401
- Requests com token válido passam
- @Public() bypassa guard
- User local criado automaticamente no primeiro acesso
- `@CurrentUser()` retorna user com id, email, name, level

#### - [ ] 1.4 User Module
**Descrição:** CRUD de usuário, stats, atualização de perfil.
**Arquivos:**
```
backend/src/modules/user/user.module.ts
backend/src/modules/user/user.controller.ts
backend/src/modules/user/user.service.ts
backend/src/modules/user/dto/update-user.dto.ts
backend/src/modules/user/dto/user-stats.dto.ts
```
**Endpoints:**
- `GET /users/me` - Perfil do user autenticado
- `PATCH /users/me` - Atualizar nome, avatar
- `GET /users/me/stats` - XP, streak, level, total conversations, achievements
- `GET /users/me/history` - Histórico de conversas (paginado)

**Dependências:** 1.3
**Critérios de Aceite:**
- Stats calculados corretamente (XP, streak, level, counts)
- Histórico paginado com cursor-based pagination
- Validação de DTOs com class-validator

#### - [ ] 1.5 Conversation Module
**Descrição:** Criar, listar, gerenciar conversas e mensagens.
**Arquivos:**
```
backend/src/modules/conversation/conversation.module.ts
backend/src/modules/conversation/conversation.controller.ts
backend/src/modules/conversation/conversation.service.ts
backend/src/modules/conversation/dto/create-conversation.dto.ts
backend/src/modules/conversation/dto/send-message.dto.ts
backend/src/modules/conversation/dto/conversation-response.dto.ts
```
**Endpoints:**
- `POST /conversations` - Criar conversa (body: { topicId })
- `GET /conversations/:id` - Detalhes + mensagens
- `POST /conversations/:id/messages` - Enviar mensagem de texto
- `POST /conversations/:id/audio` - Enviar áudio (multipart)
- `POST /conversations/:id/complete` - Finalizar conversa + gerar feedback
- `GET /conversations` - Listar conversas do user (paginado)

**Dependências:** 1.3, 1.4
**Critérios de Aceite:**
- Criar conversa gera mensagem system (do topic.systemPrompt)
- Enviar áudio faz upload → transcrição → resposta IA (orquestração na Fase 2)
- Complete gera feedback e calcula XP
- Validação: user só acessa próprias conversas

#### - [ ] 1.6 Storage Module (Cloudflare R2)
**Descrição:** Upload e gerenciamento de áudios no Cloudflare R2.
**Arquivos:**
```
backend/src/modules/storage/storage.module.ts
backend/src/modules/storage/storage.service.ts
backend/src/infrastructure/external/cloudflare/r2.client.ts
```
**Métodos:**
- `uploadAudio(file: Buffer, userId: string): Promise<string>` - Retorna URL pública
- `deleteAudio(key: string): Promise<void>`
- Validação: aceitar apenas `audio/webm`, `audio/mp4`, `audio/wav` (max 10MB)

**Dependências:** 0.4
**Critérios de Aceite:**
- Upload funciona com arquivos até 10MB
- URL pública acessível
- Formatos inválidos rejeitados com BusinessException(INVALID_AUDIO_FORMAT)

#### - [ ] 1.7 Topics Module
**Descrição:** CRUD de tópicos/cenários de conversa.
**Arquivos:**
```
backend/src/modules/topics/topics.module.ts
backend/src/modules/topics/topics.controller.ts
backend/src/modules/topics/topics.service.ts
backend/prisma/seed.ts (atualizar com topics)
```
**Endpoints:**
- `GET /topics` - Listar todos (filtrar por difficulty, category)
- `GET /topics/:slug` - Detalhes de um tópico

**Seed (10+ tópicos):**
```
☕ Coffee Shop - Beginner - daily-life
🏨 Hotel Check-in - Beginner - travel
🍕 Restaurant Order - Beginner - daily-life
✈️ Airport - Intermediate - travel
💼 Job Interview - Intermediate - professional
🏥 Doctor Visit - Intermediate - daily-life
📊 Business Meeting - Advanced - professional
🎓 University Lecture - Advanced - academic
⚖️ Legal Consultation - Advanced - professional
🌍 Travel Planning - Intermediate - travel
```

**Dependências:** 1.1
**Critérios de Aceite:**
- Seed popula 10+ tópicos
- Filtro por difficulty e category funciona
- Cada tópico tem systemPrompt adequado

#### - [ ] 1.8 Swagger / OpenAPI
**Descrição:** Documentação automática da API com @nestjs/swagger.
**Arquivos:**
```
backend/src/main.ts (atualizar)
```
**Dependências:** 1.3, 1.4, 1.5, 1.6, 1.7
**Critérios de Aceite:**
- Swagger UI acessível em `/api/docs`
- Todos os endpoints documentados com DTOs
- Bearer auth configurado no Swagger

#### - [ ] 1.9 Testes Backend Core
**Descrição:** Testes unitários e de integração para módulos core.
**Arquivos:**
```
backend/src/modules/auth/auth.service.spec.ts
backend/src/modules/user/user.service.spec.ts
backend/src/modules/conversation/conversation.service.spec.ts
backend/src/shared/filters/all-exceptions.filter.spec.ts
backend/test/app.e2e-spec.ts
```
**Dependências:** 1.3, 1.4, 1.5
**Critérios de Aceite:**
- Coverage > 70% nos services
- Testes de integração passam
- `npm test` roda sem falhas

---

### FASE 2: Integrações IA (25h) - 🔄 PARCIAL (LLM + Orquestração ✅)

#### - [ ] 2.1 Groq STT Service (Whisper)
**Descrição:** Transcrição de áudio usando Groq Whisper large-v3-turbo.
**Arquivos:**
```
backend/src/modules/groq/groq.module.ts
backend/src/modules/groq/groq-stt.service.ts
backend/src/infrastructure/external/groq/groq.client.ts
```
**Comportamento:**
- Aceita Buffer de áudio (webm/mp4/wav)
- Retorna texto transcrito + language detected
- Retry com backoff exponencial (3 tentativas)
- Rate limit handling (Groq free: 20 req/min)

**Dependências:** 0.4, 1.6
**Critérios de Aceite:**
- Transcrição funciona com áudio webm
- Retry automático em caso de rate limit
- BusinessException(GROQ_TRANSCRIPTION_FAILED) em caso de falha

#### - [x] 2.2 Groq LLM Service (Llama 3.3)
**Descrição:** Geração de respostas conversacionais com Llama 3.3 70B.
**Arquivos:**
```
backend/src/modules/groq/groq-llm.service.ts
backend/src/modules/groq/prompts/system-prompts.ts
```
**System Prompts por Nível:**
```typescript
const SYSTEM_PROMPTS = {
  BEGINNER: `You are a friendly English tutor. Use simple vocabulary,
    short sentences. Gently correct mistakes. Speak slowly and clearly.
    Always encourage the student.`,
  INTERMEDIATE: `You are an English conversation partner. Use varied
    vocabulary, idioms occasionally. Point out grammar mistakes naturally.
    Challenge the student with follow-up questions.`,
  ADVANCED: `You are a native English speaker having a natural conversation.
    Use complex structures, idioms, phrasal verbs. Discuss nuances.
    Only correct significant errors.`,
};
```
**Dependências:** 0.4
**Critérios de Aceite:**
- Respostas contextuais baseadas no histórico de mensagens
- System prompt varia por nível do user
- Timeout de 30s com fallback
- Respostas em inglês, naturais e educativas

#### - [ ] 2.3 Groq Feedback Service
**Descrição:** Análise detalhada da conversa (gramática, vocabulário, fluência).
**Arquivos:**
```
backend/src/modules/groq/groq-feedback.service.ts
backend/src/modules/groq/prompts/feedback-prompt.ts
```
**Output esperado (JSON):**
```typescript
interface FeedbackResponse {
  grammarScore: number;    // 0-100
  vocabularyScore: number; // 0-100
  fluencyScore: number;    // 0-100
  overallScore: number;    // 0-100
  grammarErrors: Array<{
    original: string;
    correction: string;
    explanation: string;
  }>;
  suggestions: string[];
  strengths: string[];
}
```
**Dependências:** 0.4
**Critérios de Aceite:**
- Prompt faz LLM retornar JSON válido (json_mode)
- Scores entre 0-100
- Parsing robusto com fallback
- Feedback em inglês, construtivo e específico

#### - [ ] 2.4 RAG Service (Upstash Vector)
**Descrição:** Busca semântica de exemplos similares para enriquecer respostas.
**Arquivos:**
```
backend/src/modules/rag/rag.module.ts
backend/src/modules/rag/rag.service.ts
backend/src/infrastructure/external/upstash/vector.client.ts
backend/src/modules/rag/seed-examples.ts
```
**Métodos:**
- `addExample(text: string, metadata: object): Promise<void>`
- `findSimilar(query: string, topK: number): Promise<Example[]>`
- `seedExamples(): Promise<void>` - Popula 50-100 exemplos

**Exemplos de seed:**
- Frases comuns por cenário (coffee shop, airport, etc)
- Erros gramaticais comuns e correções
- Expressões idiomáticas por nível

**Dependências:** 0.4
**Critérios de Aceite:**
- Busca retorna exemplos relevantes (similarity > 0.7)
- Seed popula 50+ exemplos
- Fallback silencioso se RAG falhar (não bloqueia conversa)

#### - [x] 2.5 Orquestração de Conversa
**Descrição:** Integrar STT + LLM + RAG + Feedback no fluxo de conversa.
**Status:** Implementado para texto. STT e RAG postponed para v1.1.
**Arquivos:**
```
backend/src/modules/conversation/conversation.service.ts (atualizar)
```
**Fluxo completo:**
```
1. User envia áudio
2. Storage: upload do áudio → URL
3. STT: transcrição do áudio → texto
4. RAG: buscar exemplos similares
5. LLM: gerar resposta (contexto + RAG + histórico)
6. Salvar mensagens (user + assistant)
7. Retornar resposta

Ao completar conversa:
8. Feedback: analisar toda a conversa
9. Calcular XP e atualizar score
10. Salvar feedback
11. Atualizar streak do user
```
**Dependências:** 1.5, 2.1, 2.2, 2.3, 2.4
**Critérios de Aceite:**
- Fluxo completo funciona end-to-end
- Erro em qualquer etapa retorna mensagem clara
- RAG é opcional (falha silenciosa)
- XP calculado: `overallScore * 0.1 * (levelMultiplier)`

#### - [ ] 2.6 Testes de Integração IA
**Descrição:** Testes com mocks para serviços Groq e RAG.
**Arquivos:**
```
backend/src/modules/groq/groq-stt.service.spec.ts
backend/src/modules/groq/groq-llm.service.spec.ts
backend/src/modules/groq/groq-feedback.service.spec.ts
backend/src/modules/rag/rag.service.spec.ts
```
**Dependências:** 2.1, 2.2, 2.3, 2.4
**Critérios de Aceite:**
- Mocks para APIs externas (Groq, Upstash)
- Testes de retry logic
- Testes de fallback em caso de erro
- `npm test` passa

---

### FASE 3: Frontend (30h) - ✅ COMPLETA

#### - [x] 3.1 Design System & CSS Variables
**Descrição:** Configurar CSS variables, tokens de design, tema dark/light no globals.css.
**Arquivos:**
```
frontend/app/globals.css
frontend/tailwind.config.ts
frontend/lib/constants.ts
```
**Inclui:**
- CSS variables conforme spec (dark/light)
- Tailwind config estendido com cores customizadas
- Font Inter + JetBrains Mono via next/font
- Animações customizadas (fadeIn, slideUp, pulse)

**Dependências:** 0.2
**Critérios de Aceite:**
- Toggle dark/light funciona
- Todas as CSS variables do design system configuradas
- Fonts carregadas corretamente

#### - [x] 3.2 Layout Principal (Sidebar + Header)
**Descrição:** Layout com sidebar fixa, header sticky e área de conteúdo.
**Arquivos:**
```
frontend/components/layout/sidebar.tsx
frontend/components/layout/header.tsx
frontend/components/layout/mobile-nav.tsx
frontend/app/(protected)/layout.tsx
```
**Comportamento responsivo:**
- Desktop (>1024px): Sidebar 256px + Content
- Tablet (768-1024px): Sidebar colapsável
- Mobile (<768px): Bottom nav + Full-width

**Dependências:** 3.1
**Critérios de Aceite:**
- Sidebar com logo, nav items, user profile card
- Header com título da página, stats badges
- Responsivo nos 3 breakpoints
- Transições suaves ao colapsar sidebar

#### - [x] 3.3 Auth Pages (Login/Signup)
**Descrição:** Páginas de login e cadastro com Supabase Auth.
**Arquivos:**
```
frontend/lib/supabase/client.ts
frontend/lib/supabase/middleware.ts
frontend/hooks/useAuth.ts
frontend/store/auth-store.ts
frontend/app/(auth)/login/page.tsx
frontend/app/(auth)/signup/page.tsx
frontend/app/(auth)/layout.tsx
frontend/middleware.ts
```
**Fluxo:**
1. User faz login/signup via Supabase Auth UI
2. Supabase retorna session com access_token
3. Middleware redireciona não-autenticados para /login
4. Após login, chama `POST /auth/sync` para criar user local
5. Zustand store mantém estado do user

**Dependências:** 3.2
**Critérios de Aceite:**
- Login com email/password funciona
- Signup cria conta + sync com backend
- Redirect automático (não-auth → login, auth → dashboard)
- Loading states durante auth
- Mensagens de erro claras

#### - [x] 3.4 Dashboard Page
**Descrição:** Dashboard com stats, progresso semanal e ações rápidas.
**Arquivos:**
```
frontend/app/(protected)/dashboard/page.tsx
frontend/components/dashboard/stats-cards.tsx
frontend/components/dashboard/weekly-progress.tsx
frontend/components/dashboard/recent-conversations.tsx
frontend/components/dashboard/quick-actions.tsx
```
**Componentes:**
- **Stats Cards**: XP, Streak, Level, Total Conversations (4 cards grid)
- **Weekly Progress**: Gráfico de atividade dos últimos 7 dias
- **Recent Conversations**: Últimas 5 conversas com score
- **Quick Actions**: Botões para iniciar conversa rápida

**Dependências:** 3.3
**Critérios de Aceite:**
- Stats carregados via React Query
- Skeleton loading enquanto carrega
- Empty state se não houver dados
- Cards com gradientes conforme design system

#### - [x] 3.5 Topics Page
**Descrição:** Grid de tópicos/cenários disponíveis para prática.
**Arquivos:**
```
frontend/app/(protected)/topics/page.tsx
frontend/components/topics/topic-card.tsx
frontend/components/topics/topic-filter.tsx
```
**Funcionalidades:**
- Grid 2-3 colunas com topic cards
- Filtro por dificuldade (Beginner, Intermediate, Advanced)
- Filtro por categoria
- Click no card → inicia conversa (POST /conversations)

**Dependências:** 3.3
**Critérios de Aceite:**
- Topics carregados da API
- Filtros funcionam
- Hover state com scale(1.05)
- Click redireciona para /conversation/[id]

#### - [x] 3.6 Conversation Page
**Descrição:** Página principal de conversação com áudio recording e chat.
**Status:** Implementado com texto. Audio postponed para v1.1.
**Arquivos:**
```
frontend/app/(protected)/conversation/[id]/page.tsx
frontend/components/conversation/message-list.tsx
frontend/components/conversation/audio-recorder.tsx
frontend/components/conversation/conversation-header.tsx
frontend/hooks/useAudioRecorder.ts
frontend/hooks/useConversation.ts
```
**Código-chave - useAudioRecorder:**
```typescript
export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'audio/webm;codecs=opus',
    });

    mediaRecorder.ondataavailable = (e) => chunksRef.current.push(e.data);
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
      setAudioBlob(blob);
      chunksRef.current = [];
      stream.getTracks().forEach((t) => t.stop());
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  return { isRecording, audioBlob, startRecording, stopRecording, clearAudio: () => setAudioBlob(null) };
}
```
**Layout:** Grid 3 colunas (2 col chat + 1 col context/timer)

**Dependências:** 3.3
**Critérios de Aceite:**
- Recording button com estados (idle/recording) conforme design
- Mensagens exibidas em formato chat
- Timer mostrando duração da conversa
- Auto-scroll para última mensagem
- Loading state enquanto IA responde

#### - [x] 3.7 Feedback Modal
**Descrição:** Modal com feedback detalhado após completar conversa.
**Arquivos:**
```
frontend/components/conversation/feedback-modal.tsx
frontend/components/conversation/score-display.tsx
```
**Conteúdo:**
- Overall Score (círculo animado)
- Grammar / Vocabulary / Fluency (barras de progresso)
- Grammar Errors (lista com original → correction + explanation)
- Suggestions (lista)
- Strengths (lista)
- XP Earned (animação)
- Botão "Back to Topics"

**Dependências:** 3.6
**Critérios de Aceite:**
- Scores exibidos com animação (contagem progressiva)
- Barras de progresso com gradientes
- Erros gramaticais com destaque visual
- XP earned com animação de +XP
- Responsivo

#### - [x] 3.8 Profile Page
**Descrição:** Página de perfil com stats detalhados e histórico.
**Arquivos:**
```
frontend/app/(protected)/profile/page.tsx
frontend/components/profile/profile-header.tsx
frontend/components/profile/stats-detail.tsx
frontend/components/profile/conversation-history.tsx
```
**Funcionalidades:**
- Avatar, nome, nível, data de entrada
- Stats detalhados (XP, streak, level, total conversations)
- Progress bar para próximo nível
- Histórico de conversas (tabela paginada)
- Achievements unlocked

**Dependências:** 3.3
**Critérios de Aceite:**
- Dados carregados da API
- Editar nome funciona
- Histórico paginado com infinite scroll
- Level progress bar mostra progresso para próximo nível

#### - [x] 3.9 API Client & React Query Setup
**Descrição:** API client centralizado com Bearer token automático + React Query provider.
**Arquivos:**
```
frontend/lib/api/client.ts
frontend/lib/api/users.ts
frontend/lib/api/conversations.ts
frontend/lib/api/topics.ts
frontend/app/providers.tsx
```
**Código-chave - API Client:**
```typescript
// lib/api/client.ts
import { createClient } from '@/lib/supabase/client';

class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL!;
  }

  private async getHeaders(): Promise<HeadersInit> {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    return {
      'Content-Type': 'application/json',
      ...(session?.access_token && {
        Authorization: `Bearer ${session.access_token}`,
      }),
    };
  }

  async get<T>(endpoint: string): Promise<T> {
    const res = await fetch(`${this.baseURL}${endpoint}`, {
      headers: await this.getHeaders(),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error?.error?.message || 'Request failed');
    }
    return res.json().then((r) => r.data);
  }

  async post<T>(endpoint: string, body?: unknown): Promise<T> {
    const res = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: await this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error?.error?.message || 'Request failed');
    }
    return res.json().then((r) => r.data);
  }

  async postFormData<T>(endpoint: string, formData: FormData): Promise<T> {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: {
        ...(session?.access_token && {
          Authorization: `Bearer ${session.access_token}`,
        }),
      },
      body: formData,
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error?.error?.message || 'Request failed');
    }
    return res.json().then((r) => r.data);
  }

  async patch<T>(endpoint: string, body: unknown): Promise<T> {
    const res = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PATCH',
      headers: await this.getHeaders(),
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error?.error?.message || 'Request failed');
    }
    return res.json().then((r) => r.data);
  }
}

export const api = new ApiClient();
```
**Dependências:** 0.2
**Critérios de Aceite:**
- Bearer token injetado automaticamente
- Métodos: get, post, postFormData, patch
- React Query provider configurado com defaults (staleTime, retry)
- Módulos de API separados (users.ts, conversations.ts, topics.ts)

---

### FASE 4: Gamificação & Polish (12h) - ✅ COMPLETA

#### - [x] 4.1 Sistema XP & Level
**Descrição:** Cálculo de XP, progressão de nível e notificações de level-up.
**Arquivos:**
```
backend/src/modules/user/xp.service.ts
frontend/components/shared/level-up-modal.tsx
frontend/components/shared/xp-animation.tsx
```
**Regras:**
```
XP por conversa = overallScore * levelMultiplier
  BEGINNER: 1.0x
  INTERMEDIATE: 1.5x
  ADVANCED: 2.0x

Níveis:
  BEGINNER: 0-999 XP
  INTERMEDIATE: 1000-4999 XP
  ADVANCED: 5000-14999 XP
  FLUENT: 15000+ XP
```
**Dependências:** 1.4, 3.4
**Critérios de Aceite:**
- XP calculado corretamente ao completar conversa
- Level-up automático ao atingir threshold
- Animação de +XP no frontend
- Modal de level-up quando user sobe de nível

#### - [x] 4.2 Sistema Streak
**Descrição:** Rastreamento de dias consecutivos de prática.
**Arquivos:**
```
backend/src/modules/user/streak.service.ts
frontend/components/shared/streak-indicator.tsx
```
**Regras:**
- Streak incrementa se user pratica em dia diferente do lastActiveAt
- Streak reseta se pula 1+ dias
- lastActiveAt atualizado ao completar conversa
- Streak exibido no header e dashboard

**Dependências:** 1.4, 3.2
**Critérios de Aceite:**
- Streak calculado corretamente
- Reset funciona ao pular dia
- Exibido no header com ícone de fogo
- Animação quando streak aumenta

#### - [x] 4.3 Onboarding Flow
**Descrição:** Fluxo de primeira experiência para novos usuários.
**Arquivos:**
```
frontend/app/(protected)/onboarding/page.tsx
frontend/components/onboarding/step-name.tsx
frontend/components/onboarding/step-level.tsx
frontend/components/onboarding/step-goals.tsx
```
**Steps:**
1. Welcome + definir nome
2. Selecionar nível (Beginner/Intermediate/Advanced)
3. Selecionar objetivo (Travel, Work, Study, General)
4. Redirect para dashboard

**Dependências:** 3.3
**Critérios de Aceite:**
- Detecta primeiro acesso (user sem nome/nível)
- 3 steps com animação de transição
- Salva preferências na API
- Redirect para dashboard ao finalizar

#### - [x] 4.4 Responsividade Mobile
**Descrição:** Ajustes finais de responsividade em todas as páginas.
**Arquivos:**
```
frontend/components/layout/mobile-nav.tsx (atualizar)
Todas as pages (ajustes pontuais)
```
**Dependências:** 3.2-3.8
**Critérios de Aceite:**
- Todas as páginas funcionam em 375px (iPhone SE)
- Bottom nav no mobile com 5 itens
- Recording button centralizado e grande no mobile
- Feedback modal em full-screen no mobile
- Sem scroll horizontal em nenhuma página

---

### FASE 5: Deploy & Infra (10h)

#### - [ ] 5.1 Deploy Backend (Fly.io)
**Descrição:** Deploy do backend NestJS no Fly.io free tier.
**Arquivos:**
```
backend/Dockerfile
backend/fly.toml
backend/.dockerignore
```
**Config:**
- Machine: shared-cpu-1x, 256MB RAM
- Region: gru (São Paulo)
- Health check: GET /health
- Secrets: todas as env vars via `fly secrets set`

**Dependências:** FASE 1+2 completas
**Critérios de Aceite:**
- `fly deploy` funciona
- Health check passando
- API acessível publicamente
- Secrets configurados (não hardcoded)

#### - [ ] 5.2 Deploy Frontend (Vercel)
**Descrição:** Deploy do frontend Next.js na Vercel.
**Arquivos:**
```
frontend/vercel.json (se necessário)
```
**Config:**
- Framework preset: Next.js
- Env vars: NEXT_PUBLIC_API_URL, NEXT_PUBLIC_SUPABASE_*
- Domain customizado (opcional)

**Dependências:** FASE 3 completa
**Critérios de Aceite:**
- Deploy automático via git push
- Env vars configuradas na Vercel
- Site acessível publicamente
- Auth flow funciona em produção

#### - [ ] 5.3 CI/CD (GitHub Actions)
**Descrição:** Pipeline de CI com lint, test e deploy automático.
**Arquivos:**
```
.github/workflows/ci.yml
.github/workflows/deploy-backend.yml
.github/workflows/deploy-frontend.yml
```
**Pipeline:**
- Push para main: lint → test → deploy
- Pull request: lint → test only

**Dependências:** 5.1, 5.2
**Critérios de Aceite:**
- CI roda em PRs (lint + test)
- Deploy automático no merge para main
- Secrets do GitHub configurados

#### - [ ] 5.4 Monitoring (Sentry)
**Descrição:** Error tracking com Sentry no backend e frontend.
**Arquivos:**
```
backend/src/main.ts (atualizar)
frontend/sentry.client.config.ts
frontend/sentry.server.config.ts
frontend/next.config.ts (atualizar)
```
**Dependências:** 5.1, 5.2
**Critérios de Aceite:**
- Erros capturados no Sentry automaticamente
- Source maps configurados
- Alertas de email para erros críticos

#### - [ ] 5.5 Performance & Otimização
**Descrição:** Cache, rate limiting e otimizações finais.
**Arquivos:**
```
backend/src/shared/guards/throttle.guard.ts
backend/src/infrastructure/cache/redis-cache.module.ts
```
**Inclui:**
- Rate limiting: 60 req/min por user
- Cache Redis: topics (5min), user stats (1min)
- Compression middleware
- CORS configurado para domínio de produção

**Dependências:** 5.1
**Critérios de Aceite:**
- Rate limit funciona (retorna 429)
- Cache reduz queries ao DB
- CORS bloqueia origens não autorizadas

---

### FASE 6: Testes & Polish (10h)

#### - [ ] 6.1 Testes E2E
**Descrição:** Testes end-to-end dos fluxos principais.
**Arquivos:**
```
backend/test/auth.e2e-spec.ts
backend/test/conversation.e2e-spec.ts
frontend/e2e/auth.spec.ts (Playwright, opcional)
```
**Fluxos a testar:**
1. Signup → Login → Dashboard
2. Selecionar topic → Iniciar conversa → Enviar mensagem → Completar → Feedback
3. Verificar XP/Streak atualizados

**Dependências:** FASE 1-5 completas
**Critérios de Aceite:**
- Fluxos principais passam
- Mocks para Groq API nos testes
- CI executa testes

#### - [ ] 6.2 Bug Fixes & Polish Final
**Descrição:** Correção de bugs encontrados, ajustes visuais e documentação.
**Arquivos:**
```
README.md (documentação final)
CONTRIBUTING.md (opcional)
```
**Inclui:**
- Fix bugs encontrados durante E2E
- Ajustes visuais finais
- README com setup local, deploy e arquitetura
- Verificar checklist de entrega MVP

**Dependências:** 6.1
**Critérios de Aceite:**
- Todos os bugs críticos corrigidos
- README completo
- Checklist de entrega MVP 100%

---

## ?? Vis�o Geral

### Objetivo
Plataforma de ensino de idiomas com IA que oferece conversa��o interativa por �udio, feedback personalizado em tempo real e gamifica��o para acelerar o aprendizado.

### Diferenciais
- **IA Conversacional**: Groq (Llama 3.3 70B) para conversas naturais
- **Feedback Instant�neo**: An�lise de gram�tica, vocabul�rio e flu�ncia
- **RAG Contextual**: Aprende com exemplos similares para respostas melhores
- **Gamifica��o**: XP, Streak, Levels para engajamento
- **100% Gratuito**: Stack completa em free tier (0-500 usu�rios)

### Caracter�sticas Core
- Conversa��o por �udio (Speech-to-Text via Groq Whisper)
- An�lise de resposta com feedback detalhado
- Personaliza��o por n�vel (Beginner ? Advanced)
- Sistema de progresso (XP, Streak, Dashboard)
- Suporte a m�ltiplas faixas et�rias

---

## ?? Identidade Visual

### Logo - Mic Wave Conversation ??

**Conceito:**
Microfone central com ondas sonoras bilaterais representando:
- ?? **Microfone** = Input de �udio (usu�rio fala)
- ?? **Ondas esquerda** (Azul) = Captura de voz
- ?? **Ondas direita** (Roxo) = IA respondendo
- ? **Bilateral** = Conversa��o ativa e cont�nua

**Varia��es:**
1. **Full Logo** - �cone + wordmark + tagline (landing page, emails)
2. **Logomark** - �cone + wordmark (navbar, footer, sidebar)
3. **Icon Only** - Mark isolado (favicon, app icon, splash)
4. **Wordmark** - Texto apenas (men��es, documentos)

**Especifica��es:**
- Altura m�nima: 32px (logomark), 48px (full)
- Clear space: 1.5x altura do �cone
- Formatos: SVG (prim�rio), PNG (fallback)
- Font: Inter ExtraBold 800

---

### Paleta de Cores

#### ?? Tema ESCURO (padr�o)
```css
:root[data-theme="dark"] {
  /* Primary - Azul Tech */
  --primary: #3B82F6;
  --primary-hover: #2563EB;
  --primary-light: #60A5FA;
  --primary-bg: rgba(59, 130, 246, 0.1);
  
  /* Secondary - Roxo Premium */
  --secondary: #8B5CF6;
  --secondary-hover: #7C3AED;
  --secondary-light: #A78BFA;
  --secondary-bg: rgba(139, 92, 246, 0.1);
  
  /* Accent - Laranja Energia */
  --accent: #F59E0B;
  --accent-hover: #D97706;
  --accent-light: #FBBF24;
  --accent-bg: rgba(245, 158, 11, 0.1);
  
  /* Backgrounds */
  --bg-primary: #0F172A;      /* bg-slate-900 */
  --bg-secondary: #1E293B;    /* bg-slate-800 */
  --bg-tertiary: #334155;     /* bg-slate-700 */
  --bg-elevated: #475569;     /* bg-slate-600 */
  --bg-app: #020617;          /* bg-slate-950 */
  
  /* Borders */
  --border: rgba(148, 163, 184, 0.2);        /* border-slate-800 */
  --border-hover: rgba(148, 163, 184, 0.4);  /* border-slate-700 */
  
  /* Text */
  --text-primary: #F1F5F9;    /* text-white */
  --text-secondary: #CBD5E1;  /* text-gray-300 */
  --text-tertiary: #94A3B8;   /* text-gray-400 */
  --text-muted: #64748B;      /* text-gray-500 */
}
```

#### ?? Tema CLARO
```css
:root[data-theme="light"] {
  /* Primary - Azul (ajustado contraste) */
  --primary: #2563EB;
  --primary-hover: #1D4ED8;
  --primary-light: #3B82F6;
  --primary-bg: rgba(37, 99, 235, 0.08);
  
  /* Secondary - Roxo (ajustado) */
  --secondary: #7C3AED;
  --secondary-hover: #6D28D9;
  --secondary-light: #8B5CF6;
  --secondary-bg: rgba(124, 58, 237, 0.08);
  
  /* Accent - Laranja (ajustado) */
  --accent: #EA580C;
  --accent-hover: #C2410C;
  --accent-light: #F97316;
  --accent-bg: rgba(234, 88, 12, 0.08);
  
  /* Backgrounds */
  --bg-primary: #FAFAFA;
  --bg-secondary: #FFFFFF;
  --bg-tertiary: #F5F5F5;
  --bg-elevated: #FFFFFF;
  
  /* Borders */
  --border: rgba(0, 0, 0, 0.08);
  --border-hover: rgba(0, 0, 0, 0.12);
  
  /* Text */
  --text-primary: #18181B;
  --text-secondary: #3F3F46;
  --text-tertiary: #71717A;
  --text-muted: #A1A1AA;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
```

---

### Tipografia

```yaml
Primary Font: Inter
  Heading: Inter Bold (700) / ExtraBold (800)
  Body: Inter Regular (400) / Medium (500)
  UI: Inter Medium (500)

Monospace: JetBrains Mono
  Code, tech elements
  Weight: Regular (400) / Medium (500)

Escalas:
  text-xs: 12px
  text-sm: 14px
  text-base: 16px
  text-lg: 18px
  text-xl: 20px
  text-2xl: 24px
  text-3xl: 30px
  text-4xl: 36px
  text-5xl: 48px
```

---

### Espa�amento & Radius

```yaml
Spacing:
  space-1: 4px
  space-2: 8px
  space-3: 12px
  space-4: 16px
  space-6: 24px
  space-8: 32px
  space-12: 48px
  space-16: 64px

Border Radius:
  rounded-sm: 4px     # Small elements
  rounded-md: 6px     # Buttons, inputs
  rounded-lg: 8px     # Cards
  rounded-xl: 12px    # Large cards
  rounded-2xl: 16px   # Hero sections
  rounded-full: 9999px # Avatars, badges
```

---

### Iconografia

```yaml
Library: Lucide React
Style: Outline (stroke-based)
Stroke Width: 2px
Sizes: 20px, 24px (primary), 32px, 48px

�cones Core:
  - Trophy (XP)
  - Flame (Streak)
  - Star (Level)
  - MessageSquare (Conversa��o)
  - Mic (�udio)
  - Zap (Energia/A��o)
  - TrendingUp (Progresso)
```

---

## ?? Layout & Design System

### Estrutura de Layout Principal

#### **Layout Padr�o - Desktop First**
```yaml
Estrutura:
  - Sidebar Fixa (256px) - Navega��o principal
  - Main Content (flex-1) - Conte�do din�mico
  - Header Sticky - Stats e a��es r�pidas

Breakpoints:
  sm: 640px
  md: 768px
  lg: 1024px
  xl: 1280px
  2xl: 1536px

Comportamento Responsivo:
  Desktop (>1024px): Sidebar + Content side-by-side
  Tablet (768-1024px): Sidebar colaps�vel + Content
  Mobile (<768px): Bottom nav + Full-width content
```

---

### ?? Sidebar Navigation

**Estrutura:**
```html
<aside class="w-64 bg-slate-900 border-r border-slate-800">
  <!-- Logo Section -->
  <div class="p-6 border-b border-slate-800">
    [Logo + Brand]
  </div>
  
  <!-- Navigation Links -->
  <nav class="flex-1 p-4 space-y-1">
    [Navigation Items]
  </nav>
  
  <!-- User Profile -->
  <div class="p-4 border-t border-slate-800">
    [User Card]
  </div>
</aside>
```

**Componentes:**

1. **Logo Section**
```yaml
Padding: 24px
Border: Bottom 1px slate-800
Elementos:
  - Logo icon (40x40) com gradiente blue?purple
  - Wordmark "SpeakIA" (text-xl, bold)
```

2. **Navigation Item**
```yaml
Estados:
  - Default: text-gray-400, hover:bg-slate-800
  - Active: bg-blue-600, text-white

Estrutura:
  - Icon (20px, left)
  - Label (flex-1)
  - Badge (opcional, right)

Padding: px-4 py-3
Radius: rounded-lg
Transition: colors 200ms
```

3. **User Profile Card**
```yaml
Background: bg-slate-800
Padding: px-4 py-3
Radius: rounded-lg

Elementos:
  - Avatar (40x40, gradiente)
  - Nome (text-sm, font-semibold)
  - N�vel (text-xs, text-gray-400)
```

---

### ?? Header Bar

**Estrutura:**
```html
<header class="bg-slate-900 border-b border-slate-800 px-8 py-4 sticky top-0 z-10">
  <div class="flex items-center justify-between">
    <!-- Title Section -->
    <div>
      <h1>Page Title</h1>
      <p>Subtitle</p>
    </div>
    
    <!-- Action Section -->
    <div class="flex items-center gap-4">
      [Stats + Actions]
    </div>
  </div>
</header>
```

**Componentes:**

1. **Stats Badge**
```yaml
Background: bg-slate-800
Padding: px-4 py-2
Radius: rounded-lg
Gap: 8px

Elementos:
  - Emoji/Icon
  - Value (font-semibold)
  
Hover: Subtle scale transform
```

2. **Action Button**
```yaml
Size: w-10 h-10
Background: bg-slate-800
Radius: rounded-lg
Hover: bg-slate-700
Transition: colors 200ms
```

---

### ?? Card Patterns

#### **Card Base**
```yaml
Background: bg-slate-900
Border: border-slate-800 (1px)
Radius: rounded-xl
Padding: p-6
Shadow: Nenhuma (flat design)
```

#### **Interactive Card (Cen�rios)**
```yaml
Estados:
  - Default: bg-slate-800, border-slate-700
  - Hover: bg-slate-750, border-slate-600, transform scale-105
  - Active: border-blue-600, bg-gradient blue?purple/20

Padding: p-6
Transition: all 300ms ease
Cursor: pointer

Estrutura:
  - Icon/Emoji (text-5xl, mb-3)
  - Title (font-semibold, text-white)
  - Description (text-xs, text-gray-400)
```

#### **Stats Card (Dashboard)**
```yaml
Background: bg-gradient-to-br
  - Blue: from-blue-900/40 to-blue-800/40
  - Purple: from-purple-900/40 to-purple-800/40
  - Green: from-green-900/40 to-green-800/40
  - Orange: from-orange-900/40 to-orange-800/40

Border: Matching color (opacity 50%)
Padding: p-6
Radius: rounded-xl

Estrutura:
  - Label + Emoji (top, space-between)
  - Value (text-4xl, font-bold)
  - Subtitle (text-sm, matching color/300)
```

#### **Context Card (AI Prompt)**
```yaml
Background: bg-gradient-to-r from-purple-900/30 to-pink-900/30
Border: border-purple-500/30
Padding: p-6
Radius: rounded-xl

Estrutura:
  - Icon Box (left, 48x48, gradiente)
  - Content (right, flex-1)
    - Label (font-semibold, text-purple-300)
    - Text (text-sm, text-gray-300)
```

---

### ?? Button System

#### **Primary Button (CTA)**
```yaml
Background: bg-gradient-to-br from-blue-500 to-purple-600
Hover: from-blue-600 to-purple-700
Text: text-white, font-bold
Padding: py-4 px-6 (large), py-3 px-4 (default)
Radius: rounded-xl
Shadow: shadow-2xl shadow-blue-500/30
Transform: hover:scale-105
Transition: all 300ms
```

#### **Secondary Button**
```yaml
Background: bg-slate-800
Hover: bg-slate-700
Border: border-slate-700
Text: text-gray-200, font-semibold
Padding: py-3 px-4
Radius: rounded-xl
Transition: colors 200ms
```

#### **Recording Button (Special)**
```yaml
Estados:
  - Idle:
    - Size: w-40 h-40
    - Background: gradient blue?purple
    - Icon: Microphone (w-20 h-20)
    - Shadow: shadow-2xl shadow-blue-500/30
    
  - Recording:
    - Background: gradient red-500?red-600
    - Icon: Square (stop)
    - Animation: animate-pulse
    - Shadow: shadow-2xl shadow-red-500/30

Transform: hover:scale-110
Transition: all 300ms
```

---

### ?? Progress & Data Visualization

#### **Progress Bar**
```yaml
Container:
  - Background: bg-slate-800
  - Height: h-2 (thin), h-3 (medium)
  - Radius: rounded-full
  - Width: w-full

Fill:
  - Background: bg-gradient-to-r from-blue-500 to-purple-600
  - Height: Herda do container
  - Radius: rounded-full
  - Width: Dynamic (%)
  - Transition: width 500ms ease

Header:
  - Label: text-gray-300, text-sm
  - Value: text-blue-400, font-semibold
  - Spacing: mb-2
```

#### **Timer Display**
```yaml
Font: font-mono
Size: text-5xl
Weight: font-bold
Color: text-white
Margin: mb-2

Subtitle:
  - Size: text-sm
  - Color: text-gray-400
```

#### **Activity Graph**
```yaml
Container: flex gap-2

Bar Item:
  - Width: flex-1
  - Height: Variable por atividade
  - Background: bg-green-500/20
  - Border: border-green-500
  - Radius: rounded-lg
  - Content: text-xs (count)
  
Label:
  - Size: text-xs
  - Color: text-gray-400
  - Position: Below bar
```

---

### ?? Grid System

#### **Dashboard Grid**
```yaml
# 4 Cards Stats
grid-cols-1 md:grid-cols-2 lg:grid-cols-4
gap-6

# 2 Columns Content
grid-cols-1 lg:grid-cols-2
gap-6

# 3 Columns Scenarios
grid-cols-2 md:grid-cols-3
gap-4
```

#### **Practice Page Layout**
```yaml
# Main Grid
grid-cols-3
gap-6

# Left Content (2 columns)
col-span-2
space-y-6

# Right Sidebar (1 column)
space-y-6
```

---

### ?? States & Interactions

#### **Hover States**
```yaml
Cards:
  - Background: Lighten +1 shade
  - Border: Lighten +1 shade
  - Transform: scale(1.05) ou translateY(-2px)
  
Links:
  - Color: Lighten
  - Underline: Opcional
  
Buttons:
  - Background: Gradient shift
  - Transform: scale(1.05)
```

#### **Active/Selected States**
```yaml
Nav Items:
  - Background: bg-blue-600
  - Text: text-white
  - Icon: text-white
  
Cards:
  - Border: border-blue-600 (2px)
  - Background: Gradiente sutil do tema
```

#### **Loading States**
```yaml
Spinner:
  - Size: w-16 h-16 (medium), w-32 h-32 (large)
  - Border: 8px border-blue-500/20
  - Border-top: border-blue-500
  - Animation: animate-spin
  - Radius: rounded-full

Container:
  - Center: flex items-center justify-center
  - Padding: py-12
```

#### **Disabled States**
```yaml
Opacity: opacity-50
Cursor: cursor-not-allowed
Pointer-events: none
```

---

### ?? Table Design

```yaml
Container:
  - Background: bg-slate-900
  - Border: border-slate-800
  - Radius: rounded-xl
  - Overflow: overflow-hidden

Header:
  - Background: bg-slate-800/50
  - Text: text-gray-400, font-semibold
  - Padding: px-6 py-4

Row:
  - Border: border-t border-slate-800
  - Hover: bg-slate-800/30
  - Padding: px-6 py-4
  - Transition: colors 200ms

Cell:
  - Default: text-gray-300
  - Highlight: text-white, font-semibold
  - Accent: text-[color]-400 (green, yellow, etc)
```

---

### ?? Gradient Patterns

#### **Background Gradients**
```yaml
App Container:
  bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900

Cards Accent:
  bg-gradient-to-r from-purple-500/10 to-pink-500/10
  bg-gradient-to-br from-blue-900/30 to-cyan-900/30

Stats Cards:
  bg-gradient-to-br from-[color]-900/40 to-[color]-800/40
```

#### **Text Gradients**
```yaml
Brand Text:
  bg-gradient-to-r from-blue-400 to-purple-500
  bg-clip-text
  text-transparent
```

#### **Button Gradients**
```yaml
Primary:
  bg-gradient-to-br from-blue-500 to-purple-600

Recording Active:
  bg-gradient-to-br from-red-500 to-red-600
```

---

### ?? Notification & Toast

```yaml
Container:
  - Position: fixed bottom-4 right-4
  - Background: bg-slate-900
  - Border: border-slate-700
  - Padding: p-4
  - Radius: rounded-xl
  - Shadow: shadow-lg
  - Width: max-w-md
  - Animation: Slide from right

Variants:
  - Success: border-green-500/50, text-green-400
  - Error: border-red-500/50, text-red-400
  - Warning: border-yellow-500/50, text-yellow-400
  - Info: border-blue-500/50, text-blue-400
```

---

### ? Animations & Transitions

```yaml
Micro-interactions:
  - Hover: 200ms ease
  - Scale: 300ms ease
  - Color: 200ms ease
  - Opacity: 150ms ease

Loading:
  - Spin: animate-spin
  - Pulse: animate-pulse
  - Bounce: animate-bounce

Page Transitions:
  - Fade: 300ms ease-in-out
  - Slide: 400ms ease-out
```

---

### ?? Spacing System

```yaml
Container Max Width:
  - Small: max-w-4xl (conversation)
  - Medium: max-w-5xl (practice)
  - Large: max-w-6xl (dashboard)
  - Full: max-w-7xl (wide content)

Content Padding:
  - Page: p-8
  - Section: p-6
  - Card: p-6
  - Compact: p-4

Content Spacing:
  - Section gap: space-y-6
  - Card gap: space-y-4
  - Element gap: space-y-3
  - Text gap: space-y-2
```

---

### ?? Component Checklist

**Sempre incluir em componentes:**
```yaml
? Transition classes
? Hover states
? Active states
? Loading states
? Error states
? Empty states
? Responsive breakpoints
? Accessibility (aria-labels)
? Dark/light theme variables
```

**Nunca fazer:**
```yaml
? Inline styles (usar Tailwind)
? Hardcoded colors (usar CSS vars)
? Fixed heights sem min-h
? Absolute positioning sem fallback
? Animations excessivas
```

---

## ?? Stack Tecnol�gica

### Backend
```yaml
Framework: NestJS (TypeScript)
Database: Supabase (PostgreSQL)
ORM: Prisma
Queue: BullMQ + Upstash Redis
Cache: Upstash Redis
Storage: Cloudflare R2
IA/LLM: Groq (Whisper STT + Llama 3.3 LLM)
Vector DB: Upstash Vector
Deploy: Fly.io (FREE at� 3 VMs)
```

### Frontend
```yaml
Framework: Next.js 14+ (TypeScript)
Styling: Tailwind CSS
UI Components: shadcn/ui
State: Zustand
Data Fetching: TanStack React Query
Auth: Supabase Auth Client
Forms: React Hook Form + Zod
Charts: Recharts ou Tremor
Animations: Framer Motion
Deploy: Vercel (FREE)
```

### Custo Mensal
```
0-500 usu�rios: R$ 0/m�s (100% free tier)
500-2000 usu�rios: R$ 500-1000/m�s
2000+ usu�rios: Escalar conforme necess�rio
```

---

## ?? Padr�es de Arquitetura

### Backend (NestJS)

#### Estrutura de M�dulos
```
src/
??? infrastructure/          # Config, Database, External
?   ??? config/
?   ??? database/
?   ?   ??? prisma.service.ts
?   ?   ??? prisma.module.ts
?   ??? external/
?       ??? groq/
?       ??? supabase/
?       ??? cloudflare/
??? modules/                 # Business Logic
?   ??? auth/
?   ?   ??? auth.controller.ts
?   ?   ??? auth.service.ts
?   ?   ??? auth.module.ts
?   ?   ??? strategies/
?   ?   ??? guards/
?   ?   ??? dto/
?   ??? user/
?   ??? conversation/
?   ??? groq/
?   ??? rag/
?   ??? storage/
??? shared/                  # C�digo Compartilhado
?   ??? filters/
?   ??? interceptors/
?   ??? pipes/
?   ??? decorators/
?   ??? enums/
?   ??? exceptions/
??? app.module.ts
??? main.ts
```

#### Naming Conventions
```typescript
// Fun��es: camelCase
async getUser(userId: string) {}
async calculateTotal() {}

// Classes: PascalCase + sufixo
class UserService {}
class OrderController {}

// Constantes: UPPER_SNAKE_CASE
const MAX_RETRY_ATTEMPTS = 3;

// Arquivos: kebab-case
user-service.ts
jwt-auth.guard.ts
```

#### Error Handling (CR�TICO)
```typescript
// ? NUNCA usar
throw new NotFoundException("User not found");

// ? SEMPRE usar
throw new BusinessException(
  MappedsReturnsEnum.USER_NOT_FOUND,
  "User not found"
);

// Enum de c�digos
export enum MappedsReturnsEnum {
  USER_NOT_FOUND = 'USER_001',
  INVALID_CREDENTIALS = 'AUTH_001',
  CONVERSATION_NOT_FOUND = 'CONV_001',
  GROQ_API_ERROR = 'GROQ_001',
}
```

---

### Frontend (Next.js)

#### Estrutura de Pastas
```
frontend/
??? app/                        # App Router
?   ??? (auth)/
?   ?   ??? login/page.tsx
?   ?   ??? signup/page.tsx
?   ??? (protected)/
?   ?   ??? dashboard/page.tsx
?   ?   ??? conversation/[id]/page.tsx
?   ?   ??? topics/page.tsx
?   ?   ??? profile/page.tsx
?   ?   ??? layout.tsx
?   ??? layout.tsx
?   ??? page.tsx
?   ??? globals.css
??? components/                 # Reutiliz�veis
?   ??? ui/                     # shadcn/ui
?   ??? layout/
?   ?   ??? navbar.tsx
?   ?   ??? sidebar.tsx
?   ?   ??? footer.tsx
?   ??? dashboard/
?   ?   ??? stats-cards.tsx
?   ?   ??? weekly-progress.tsx
?   ??? conversation/
?   ?   ??? message-list.tsx
?   ?   ??? audio-recorder.tsx
?   ?   ??? feedback-modal.tsx
?   ??? profile/
??? lib/
?   ??? api/
?   ?   ??? client.ts
?   ?   ??? auth.ts
?   ?   ??? users.ts
?   ??? supabase/
?   ??? utils.ts
?   ??? constants.ts
??? hooks/
?   ??? useAuth.ts
?   ??? useAudioRecorder.ts
?   ??? useConversation.ts
??? store/
?   ??? auth-store.ts
?   ??? conversation-store.ts
??? types/
```

#### Page Component Pattern
```typescript
// app/dashboard/page.tsx
'use client';

import {useQuery} from '@tanstack/react-query';
import {StatsCards} from '@/components/dashboard/stats-cards';
import {api} from '@/lib/api/client';

export default function DashboardPage() {
  const {data: stats, isLoading} = useQuery({
    queryKey: ['user-stats'],
    queryFn: () => api.users.getStats(),
  });
  
  if (isLoading) return <DashboardSkeleton />;
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <StatsCards xp={stats.xp} streak={stats.streak} level={stats.level} />
    </div>
  );
}
```

#### Reusable Component Pattern
```typescript
// components/dashboard/stats-cards.tsx
interface StatsCardsProps {
  xp: number;
  streak: number;
  level: string;
}

export function StatsCards({xp, streak, level}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>XP Total</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-secondary">{xp}</p>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## ?? Anti-Patterns (NUNCA FAZER)

### Backend
```typescript
// ? NUNCA: Commit/push sem autoriza��o
// ? NUNCA: Hardcoded credentials
const apiKey = 'sk-1234'; // ERRADO!

// ? SEMPRE: Vari�veis de ambiente
const apiKey = process.env.GROQ_API_KEY;

// ? NUNCA: Catch vazio
try {
  await riskyOperation();
} catch (error) {} // ERRADO!

// ? SEMPRE: Tratar erros
try {
  await riskyOperation();
} catch (error) {
  this.logger.error('Operation failed', error);
  throw new BusinessException(...);
}
```

### Frontend
```typescript
// ? NUNCA: Fetch no componente
useEffect(() => {
  fetch('/api/users').then(r => r.json()); // ERRADO!
}, []);

// ? SEMPRE: React Query
const {data} = useQuery({
  queryKey: ['users'],
  queryFn: () => api.users.getAll(),
});

// ? NUNCA: Inline styles
<div style={{backgroundColor: 'red'}}> // ERRADO!

// ? SEMPRE: Tailwind classes
<div className="bg-red-500">
```

---

## ?? Escopo Completo

### Resumo Executivo
- **Total:** 120 horas
- **Prazo:** 20-25 dias �teis (4-6h/dia)
- **Custo:** R$ 0 (100% free tier)

### Distribui��o
```
Setup Inicial: 8h
Backend Core: 35h
Integra��es IA: 25h
Frontend: 30h
Deploy: 10h
Testes: 12h
```

### FASE 0: SETUP INICIAL (8h)

**Task 0.1: Contas (2h)**
```bash
? Groq API key
? Supabase projeto
? Upstash (Redis + Vector)
? Cloudflare R2
? Fly.io
? GitHub repo
```

**Task 0.2: Backend (3h)**
```bash
? nest new backend-idiomas
? Instalar deps
? Setup Prisma
? Estrutura pastas
? ESLint + Prettier
```

**Task 0.3: Frontend (3h)**
```bash
? create-next-app
? Instalar deps
? Setup Supabase Auth
? Estrutura pastas
? Tailwind config
```

---

### FASE 1: BACKEND CORE (35h)

**Task 1.1: Database Schema (4h)**
```prisma
model User {
  id         String   @id @default(uuid())
  email      String   @unique
  name       String
  level      String   @default("beginner")
  xp         Int      @default(0)
  streak     Int      @default(0)
  conversations Conversation[]
}

model Conversation {
  id         String   @id @default(uuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id])
  topic      String
  score      Int
  xpEarned   Int
  messages   Message[]
}

model Message {
  id              String       @id @default(uuid())
  conversationId  String
  conversation    Conversation @relation(fields: [conversationId], references: [id])
  role            String
  content         String
  audioUrl        String?
}
```

**Tasks restantes:**
- 1.2: Auth Module (5h)
- 1.3: User Module (3h)
- 1.4: Conversation Module (6h)
- 1.5: Storage Module (4h)
- 1.6: Exception Handling (3h)
- 1.7: Validation + DTOs (3h)
- 1.8: Swagger Docs (2h)
- 1.9: Tests (5h)

---

### FASE 2: INTEGRA��ES IA (25h)

**Task 2.1: Groq STT (4h)**
```typescript
// GroqSttService: transcribeAudio
// Whisper large-v3-turbo
// Retry logic
```

**Task 2.2: Groq LLM (5h)**
```typescript
// GroqLlmService: generateResponse
// Llama 3.3 70B
// System prompts por n�vel
```

**Task 2.3: Groq Feedback (5h)**
```typescript
// GroqFeedbackService: analyzeSpeaking
// JSON: grammarErrors, scores, suggestions
```

**Task 2.4: Vector DB (6h)**
```typescript
// RagService: addExample, findSimilar
// Upstash Vector
// Seed 50-100 exemplos
```

**Tasks restantes:**
- 2.5: RAG + Conversa��o (3h)
- 2.6: Tests IA (2h)

---

### FASE 3: FRONTEND (30h)

**Tasks:**
- 3.1: Setup Auth (4h)
- 3.2: Layout + Design (5h)
- 3.3: Dashboard (4h)
- 3.4: Conversation Page (8h)
- 3.5: Feedback Modal (3h)
- 3.6: Profile (3h)
- 3.7: Topics (3h)

---

### FASE 4: FEATURES ESSENCIAIS (12h)

**Tasks:**
- 4.1: XP e Level (3h)
- 4.2: Streak System (2h)
- 4.3: Onboarding (4h)
- 4.4: Responsive Mobile (3h)

---

### FASE 5: DEPLOY (10h)

**Tasks:**
- 5.1: Deploy Backend Fly.io (3h)
- 5.2: Deploy Frontend Vercel (2h)
- 5.3: CI/CD GitHub Actions (2h)
- 5.4: Monitoring Sentry (2h)
- 5.5: Performance (1h)

---

### FASE 6: TESTES FINAIS (10h)

**Tasks:**
- 6.1: Beta Testing (5h)
- 6.2: Bug Fixes (5h)

---

## ? Checklist de Entrega MVP

### Features Obrigat�rias
```bash
? Criar conta e login
? Iniciar conversa��o
? Gravar �udio e enviar
? IA transcreve (Groq Whisper)
? IA responde (Groq LLM)
? Feedback (gram�tica, vocabul�rio, flu�ncia)
? Sistema XP e Level
? Sistema Streak
? Dashboard com stats
? Hist�rico conversa��es
? Deploy (Vercel + Fly.io)
```

### Nice to Have (v1.1)
```bash
? TTS (IA falar resposta)
? Compara��o pron�ncia
? Gamifica��o avan�ada
? Modo offline
? Social features
```

---

## ?? Custos e Timeline

### Custo Mensal
```yaml
0-500 usu�rios: R$ 0/m�s
500-2000 usu�rios: R$ 500-1000/m�s
2000+ usu�rios: Escalar
```

### Timeline
```yaml
Semana 1: Setup + Backend (32h)
Semana 2: Backend + IA (30h)
Semana 3: Frontend (28h)
Semana 4: Deploy + Tests (30h)

Total: 120h (~4 semanas)
```

---

## ????? Prefer�ncias - Kevin Souza

### Contexto
```yaml
Cargo: Senior Fullstack ? Software Architect
Empresa: Surf Telecom
Comunica��o: PT-BR, informal, direto
```

### Stack Familiar
```yaml
Backend: NestJS, TypeScript
Database: MySQL, PostgreSQL, Prisma
Frontend: React, Next.js, Tailwind
Infra: AWS, Kubernetes, Docker
Queue: BullMQ + Redis
Test: Jest
```

### Anti-Patterns
```bash
? Commit/push sem autoriza��o
? Hardcoded credentials
? Catch vazio
? Solu��es complexas (KISS)
? Features n�o solicitadas (YAGNI)
```

### Comunica��o
- Solu��o direta + c�digo completo
- Justificativa t�cnica
- Checklist
- Alternativas (se aplic�vel)

---

## ?? Refer�ncias

- [NestJS](https://docs.nestjs.com/)
- [Next.js](https://nextjs.org/docs)
- [Groq API](https://console.groq.com/docs)
- [Supabase](https://supabase.com/docs)
- [Upstash](https://docs.upstash.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**?? MVP funcional em 120h com stack 100% gratuita!**

**?? Licen�a:** MIT