# 🚀 Quick Start - Fluentify

## ⚡ Setup Rápido (5 minutos)

### 1. Instalar Dependências do Frontend
```bash
cd frontend
npm install
cd ..
```

### 2. Criar Arquivos .env

**Backend:**
```bash
cd backend
cp .env.example .env
# Editar .env com suas credenciais
```

**Frontend:**
```bash
cd frontend
cp .env.example .env.local
# Editar .env.local com suas credenciais
```

### 3. Configurar Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Em `Project Settings > Database`:
   - Copie `Connection string` → `DATABASE_URL` no backend/.env
4. Em `Project Settings > API`:
   - Copie `URL` → `SUPABASE_URL` (backend e frontend)
   - Copie `anon public` → `SUPABASE_ANON_KEY` (backend e frontend)
   - Copie `JWT Secret` → `SUPABASE_JWT_SECRET` (backend)

### 4. Aplicar Schema no Banco

```bash
cd backend
npx prisma db push
npm run prisma:seed
```

Você verá:
```
✅ Created topic: Coffee Shop
✅ Created topic: Hotel Check-in
✅ Created topic: Restaurant Order
... (10 topics no total)
✨ Seeding completed!
```

### 5. Rodar os Projetos

**Opção 1 - Tudo junto (recomendado):**
```bash
# Na raiz do projeto
npm run dev
```

**Opção 2 - Separado:**
```bash
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 6. Acessar

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:3001
- **Health Check:** http://localhost:3001/health

---

## 🔑 Variáveis de Ambiente Mínimas

### backend/.env
```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
SUPABASE_URL=https://[PROJECT-REF].supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_JWT_SECRET=your-jwt-secret
PORT=3001
CORS_ORIGIN=http://localhost:3000
```

### frontend/.env.local
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

---

## ✅ Verificação

**Backend funcionando:**
```bash
curl http://localhost:3001/health
# Deve retornar: {"success":true,"data":{"status":"ok","timestamp":"..."}}
```

**Prisma funcionando:**
```bash
cd backend
npx prisma studio
# Abre interface visual do banco em http://localhost:5555
```

**Frontend funcionando:**
- Acesse http://localhost:3000
- Deve mostrar a landing page com "Fluentify" em gradiente

---

## 🛠️ Comandos Úteis

### Desenvolvimento
```bash
npm run dev              # Roda backend + frontend
npm run dev:backend      # Só backend
npm run dev:frontend     # Só frontend
```

### Build
```bash
npm run build            # Build completo
npm run build:backend    # Só backend
npm run build:frontend   # Só frontend
```

### Prisma
```bash
npm run prisma:generate  # Gera Prisma Client
npm run prisma:push      # Aplica schema no banco
npm run prisma:seed      # Popula topics
```

### Lint & Format
```bash
npm run lint             # Lint em ambos
npm run format           # Format em ambos
```

---

## 🐛 Troubleshooting

**Erro: "Cannot find module '@prisma/client'"**
```bash
cd backend
npx prisma generate
```

**Erro: "Port 3000 already in use"**
```bash
# Mata processo na porta 3000
lsof -ti:3000 | xargs kill -9
```

**Erro: "DATABASE_URL is required"**
- Verifique se o arquivo `.env` existe em `backend/`
- Verifique se DATABASE_URL está configurado corretamente

**Frontend não carrega CSS:**
```bash
cd frontend
rm -rf .next
npm run dev
```

---

## 📚 Próximos Passos

Agora que está tudo funcionando, você pode:

1. **Explorar o backend:**
   - Ver os endpoints: `http://localhost:3001/health`
   - Ver o schema Prisma: `backend/prisma/schema.prisma`
   - Ver os 10 topics no banco: `npx prisma studio`

2. **Explorar o frontend:**
   - Ver a estrutura: `frontend/app/`
   - Ver o design system: `frontend/app/globals.css`
   - Customizar a landing: `frontend/app/page.tsx`

3. **Continuar desenvolvimento:**
   - Próxima sessão: Auth Module (ver SETUP_COMPLETE.md)
   - Seguir o plano: CLAUDE.md (FASE 1, Task 1.3)

---

**🎉 Tudo pronto para começar a codificar!**
