# Quick Start - Frontend

## 1. Setup Inicial

```bash
cd frontend
npm install
```

## 2. Configurar Environment

```bash
# Copiar .env.example para .env.local
cp .env.example .env.local

# Editar .env.local com suas credenciais
nano .env.local
```

**Variáveis necessárias:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_STORAGE_URL=http://localhost:3001/storage
```

## 3. Rodar Desenvolvimento

```bash
npm run dev
```

Abre em: http://localhost:3000

## 4. Testar Build

```bash
npm run build
```

## 5. Rotas Disponíveis

### Públicas
- `/` - Landing page
- `/login` - Login
- `/signup` - Cadastro

### Protegidas (requer autenticação)
- `/dashboard` - Dashboard principal
- `/topics` - Seleção de tópicos
- `/profile` - Perfil do usuário

## 6. Estrutura de Código

### Criar novo componente
```typescript
// components/my-component.tsx
'use client'; // Se usar hooks

export function MyComponent() {
  return <div>Hello</div>;
}
```

### Criar nova página
```typescript
// app/my-page/page.tsx
'use client'; // Se usar hooks

export default function MyPage() {
  return <div>My Page</div>;
}
```

### Fazer request API
```typescript
import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@/lib/api';

const { data, isLoading } = useQuery({
  queryKey: ['user-stats'],
  queryFn: () => usersApi.getStats(),
});
```

### Usar Auth
```typescript
import { useAuth } from '@/hooks/useAuth';

const { user, signIn, signOut } = useAuth();
```

## 7. Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Start produção
npm start

# Lint
npm run lint

# Format
npm run format
```

## 8. Troubleshooting

### Erro: Supabase URL inválida
- Verifique se `.env.local` está preenchido
- URL deve começar com `https://`

### Erro: API não responde
- Verifique se backend está rodando na porta 3001
- Rode: `cd ../backend && npm run start:dev`

### Erro: Build falha
- Delete `.next` folder: `rm -rf .next`
- Delete `node_modules`: `rm -rf node_modules`
- Reinstale: `npm install`
- Build novamente: `npm run build`

## 9. Integração com Backend

O frontend espera que o backend (NestJS) esteja rodando em:
```
http://localhost:3001
```

### Endpoints esperados:
- `POST /auth/signup` - Criar conta
- `POST /auth/signin` - Login
- `GET /auth/me` - Dados do usuário
- `GET /users/stats` - Estatísticas
- `GET /topics` - Lista de tópicos
- `POST /conversations` - Criar conversação

## 10. Deploy (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy produção
vercel --prod
```

**Environment variables no Vercel:**
- Adicionar todas as variáveis do `.env.local`
- Settings → Environment Variables

## 11. Stack

- **Framework**: Next.js 14+
- **Styling**: Tailwind CSS
- **State**: TanStack React Query
- **Auth**: Supabase Auth
- **Icons**: Lucide React
- **UI**: shadcn/ui style components

## 12. Arquivos Importantes

```
frontend/
├── app/
│   ├── (auth)/          # Login, Signup
│   ├── (protected)/     # Dashboard, Topics, Profile
│   └── layout.tsx       # Root layout com providers
├── components/
│   ├── ui/              # Card, Button
│   ├── layout/          # Sidebar, Header
│   └── dashboard/       # Stats, Activity
├── lib/
│   ├── api/             # API clients
│   └── supabase/        # Auth
├── hooks/
│   └── useAuth.ts
└── types/
    └── index.ts
```

## 13. Boas Práticas

### ✅ Fazer
- Usar `'use client'` apenas quando necessário (hooks)
- Usar TanStack Query para data fetching
- Usar Tailwind classes (não inline styles)
- Criar componentes reutilizáveis
- Usar TypeScript interfaces

### ❌ Não fazer
- Fetch direto no componente
- Inline styles
- Hardcoded values
- Ignore TypeScript errors
- Commit `.env.local`

## 14. Próximos Passos

Depois de rodar o frontend:

1. Criar conta em `/signup`
2. Fazer login em `/login`
3. Ver dashboard em `/dashboard`
4. Escolher tópico em `/topics`
5. Iniciar conversação (próxima fase)

## 15. Suporte

**Documentação completa:**
- `frontend/README.md`
- `FASE_3_COMPLETE.md`
- `FRONTEND_SUMMARY.md`

**Backend:**
- Veja `backend/README.md` para rodar a API

**Dúvidas?**
- Verifique se todas as dependências estão instaladas
- Verifique se `.env.local` está configurado
- Verifique se backend está rodando
- Rode `npm run build` para verificar erros
