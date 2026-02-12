# Fluentify Frontend

Frontend da plataforma Fluentify - Fase 3 concluída (Tasks 3.1-3.8)

## Stack

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- TanStack React Query
- Supabase Auth
- Zustand (para state global futura)
- shadcn/ui (componentes base)

## Estrutura

```
frontend/
├── app/
│   ├── (auth)/              # Rotas públicas
│   │   ├── login/
│   │   └── signup/
│   ├── (protected)/         # Rotas protegidas
│   │   ├── layout.tsx       # Layout com Sidebar
│   │   ├── dashboard/       # Dashboard principal
│   │   ├── topics/          # Seleção de tópicos
│   │   ├── conversation/    # Conversação (NEW)
│   │   │   └── [id]/page.tsx
│   │   └── profile/         # Perfil do usuário
│   ├── layout.tsx           # Root layout com providers
│   └── page.tsx             # Landing page
├── components/
│   ├── ui/                  # Componentes base (Card, Button)
│   ├── layout/              # Sidebar, Header
│   ├── dashboard/           # Stats, Activity Graph
│   └── conversation/        # Conversation components (NEW)
│       ├── message-list.tsx
│       ├── audio-recorder.tsx
│       └── feedback-modal.tsx
├── lib/
│   ├── api/                 # API clients
│   │   ├── client.ts        # Fetch wrapper
│   │   ├── auth.ts
│   │   ├── users.ts
│   │   ├── topics.ts
│   │   ├── conversations.ts
│   │   └── storage.ts
│   ├── supabase/            # Supabase Auth
│   │   ├── client.ts
│   │   └── auth-provider.tsx
│   └── utils.ts
├── hooks/
│   ├── useAuth.ts
│   └── useAudioRecorder.ts  # NEW
└── types/
    └── index.ts             # TypeScript interfaces
```

## Features Implementadas

### Task 3.1: Supabase Auth
- [x] Cliente Supabase configurado
- [x] AuthProvider com Context API
- [x] useAuth hook
- [x] signIn, signUp, signOut

### Task 3.2: API Client
- [x] Fetch wrapper com auto Bearer token
- [x] API endpoints: auth, users, topics, conversations, storage
- [x] TanStack React Query configurado
- [x] Error handling com ApiError

### Task 3.3: Layout & Navigation
- [x] Sidebar com navegação
- [x] Header com stats (XP, Streak, Level)
- [x] Layout protegido com auth check
- [x] Loading states

### Task 3.4: Dashboard
- [x] Stats cards (XP, Streak, Level, Conversations)
- [x] Weekly activity graph
- [x] Recent conversations list
- [x] Quick start button

### Task 3.5: Topics
- [x] Grid de tópicos
- [x] Filtro por dificuldade
- [x] Cards interativos
- [x] Criar conversação ao clicar

### Task 3.6: Conversation Page
- [x] Página de conversação com chat interface
- [x] Buscar conversação por ID via API
- [x] Exibir lista de mensagens (USER vs ASSISTANT)
- [x] Scroll automático para última mensagem
- [x] Loading state durante transcrição/resposta IA
- [x] Botão "Complete Conversation" no header
- [x] Auto-refetch quando aguardando resposta da IA
- [x] Card de contexto do tópico
- [x] Estado de conversação completa

### Task 3.7: Audio Recorder Component
- [x] Hook useAudioRecorder com MediaRecorder API
- [x] Estados: idle, recording, processing, error
- [x] Botão circular grande com gradiente
- [x] Animação pulsante durante gravação
- [x] Timer display (mm:ss)
- [x] Max 5 minutos de gravação
- [x] Error handling (permissão, timeout, upload fail)
- [x] Upload audio via FormData
- [x] Send message to API

### Task 3.8: Feedback Modal
- [x] Modal overlay com animação
- [x] Overall score e XP earned
- [x] Detailed scores com progress bars
- [x] Strengths (lista verde)
- [x] Suggestions (lista amarela)
- [x] Grammar errors (accordion expandível)
- [x] Botões: Close e View Dashboard
- [x] Responsivo (max-w-2xl)

## Setup

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local

# Preencher .env.local com:
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_STORAGE_URL=http://localhost:3001/storage
```

## Desenvolvimento

```bash
# Rodar dev server
npm run dev

# Build
npm run build

# Start production
npm start
```

## Páginas

- `/` - Landing page
- `/login` - Login
- `/signup` - Cadastro
- `/dashboard` - Dashboard principal (protegida)
- `/topics` - Seleção de tópicos (protegida)
- `/conversation/[id]` - Página de conversação (protegida) **NEW**
- `/profile` - Perfil do usuário (protegida)

## Design System

Seguindo CLAUDE.md:
- Tema dark padrão (slate-900/950)
- Cores: Blue (#3B82F6), Purple (#8B5CF6), Orange (#F59E0B)
- Font: Inter
- Icons: Lucide React
- Radius: rounded-xl
- Transitions: 200-300ms

## Componentes Principais

### Conversation Components

#### MessageList
- Exibe mensagens USER vs ASSISTANT
- Auto-scroll para última mensagem
- Avatares coloridos (blue para user, purple para AI)
- Loading indicator animado (3 dots bounce)
- Empty state com instruções

#### AudioRecorder
- Gravação de áudio via MediaRecorder API
- Botão circular grande (w-40 h-40)
- Estados visuais:
  - Idle: Gradiente blue→purple, ícone microfone
  - Recording: Gradiente red, ícone square, pulsante
  - Processing: Spinner, "Processing recording..."
- Timer em formato mm:ss
- Max 5 minutos
- Error handling completo

#### FeedbackModal
- Modal com overlay animado
- Score overall + XP earned
- Progress bars para Grammar, Vocabulary, Fluency
- Seções:
  - Strengths (verde, CheckCircle)
  - Suggestions (amarelo, AlertTriangle)
  - Grammar Errors (vermelho, accordion)
- Botões de ação: Close, View Dashboard

### Custom Hooks

#### useAudioRecorder
```typescript
{
  recordingState: 'idle' | 'recording' | 'processing' | 'error',
  audioBlob: Blob | null,
  recordingTime: number,
  error: string | null,
  startRecording: () => Promise<void>,
  stopRecording: () => void,
  resetRecording: () => void
}
```

## Próximas Fases

- **Fase 4**: Features essenciais (XP, Streak, Onboarding)
- **Fase 5**: Deploy (Vercel)

## Fluxo de Conversação

1. **Iniciar Conversação**
   - Usuário seleciona um tópico em `/topics`
   - API cria nova conversação
   - Redireciona para `/conversation/[id]`

2. **Gravar Mensagem**
   - Usuário clica no botão de microfone
   - Browser solicita permissão de microfone
   - Gravação inicia (botão fica vermelho e pulsa)
   - Timer mostra tempo decorrido
   - Usuário clica novamente para parar
   - Audio é processado e enviado para API

3. **Receber Resposta**
   - API transcreve áudio (Groq Whisper)
   - API gera resposta da IA (Groq LLM)
   - Mensagens aparecem no chat
   - Auto-scroll para última mensagem
   - Loading indicator durante processamento

4. **Completar Conversação**
   - Usuário clica em "Complete Conversation"
   - API analisa toda a conversação
   - Gera feedback detalhado
   - Modal de feedback aparece com:
     - Score overall
     - XP earned
     - Detailed scores
     - Strengths, Suggestions, Errors
   - Usuário pode ver dashboard ou iniciar nova conversa

## Notas Técnicas

- Build passa sem erros ✅
- Todas as rotas renderizam corretamente ✅
- Auth flow completo (sign up, sign in, sign out) ✅
- API client pronto para consumir backend NestJS ✅
- Responsivo mobile-first ✅
- MediaRecorder API com fallback (webm → mp4) ✅
- Auto-refetch quando aguardando resposta da IA ✅
- TypeScript strict mode ✅

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support (requires microphone permission)
- Mobile Safari: ✅ Supported
- Mobile Chrome: ✅ Supported

**Nota**: Gravação de áudio requer HTTPS em produção.
