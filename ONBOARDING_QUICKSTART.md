# Onboarding Flow - Quick Start Guide

## 🚀 Início Rápido (5 minutos)

### 1. Backend - Rodar Migration

```bash
cd backend
npx prisma migrate dev
# Aplica as mudanças no banco de dados
```

**O que faz:**
- Adiciona coluna `goal` (TEXT, nullable)
- Adiciona coluna `onboarding_completed` (BOOLEAN, default false)

---

### 2. Frontend - Já Está Pronto!

Não precisa fazer nada. Tudo já está integrado:

```bash
cd frontend
npm run dev
# Acesse http://localhost:3000
```

---

### 3. Testar Onboarding

#### Opção A: Novo Usuário
1. Faça signup de um novo usuário
2. Será redirecionado automaticamente para `/onboarding`
3. Complete os 3 steps
4. Será redirecionado para `/dashboard`

#### Opção B: Usuário Existente
Reset o onboarding via SQL:

```sql
UPDATE users
SET onboarding_completed = false
WHERE email = 'seu-email@example.com';
```

Ou via Prisma Studio:

```bash
cd backend
npx prisma studio
# Abra o usuário e mude onboarding_completed para false
```

---

## 📱 Preview das Telas

### Step 1 - Welcome + Nome
```
┌─────────────────────────────────┐
│    Progress: 1/3                │
├─────────────────────────────────┤
│                                 │
│           👋                    │
│   Welcome to Fluentify!         │
│   Let's get started...          │
│                                 │
│   ┌───────────────────────┐    │
│   │ [👤] Enter your name  │    │
│   └───────────────────────┘    │
│                                 │
│   [     Continue     ]          │
│                                 │
│         Skip for now            │
└─────────────────────────────────┘
```

### Step 2 - Nível
```
┌─────────────────────────────────┐
│    Progress: 2/3                │
├─────────────────────────────────┤
│                                 │
│   What's your English level?    │
│                                 │
│   ┌─────────┐ ┌─────────┐     │
│   │ 🌱      │ │ 🚀      │     │
│   │BEGINNER │ │INTERMED.│     │
│   └─────────┘ └─────────┘     │
│                                 │
│   ┌─────────┐ ┌─────────┐     │
│   │ 💪      │ │ ⭐      │     │
│   │ADVANCED │ │ FLUENT  │     │
│   └─────────┘ └─────────┘     │
│                                 │
│   [Back] [Continue]             │
└─────────────────────────────────┘
```

### Step 3 - Objetivo
```
┌─────────────────────────────────┐
│    Progress: 3/3                │
├─────────────────────────────────┤
│                                 │
│     What's your goal?           │
│                                 │
│   ┌─────────┐ ┌─────────┐     │
│   │ ✈️      │ │ 💼      │     │
│   │ Travel  │ │  Work   │     │
│   └─────────┘ └─────────┘     │
│                                 │
│   ┌─────────┐ ┌─────────┐     │
│   │ 📚      │ │ 🌍      │     │
│   │ Study   │ │ General │     │
│   └─────────┘ └─────────┘     │
│                                 │
│   [Back] [Get Started]          │
└─────────────────────────────────┘
```

---

## 🔍 Verificar se Está Funcionando

### 1. Check API Response
```bash
# Login e pegue o token
curl -X GET http://localhost:3001/users/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Resposta deve ter:
```json
{
  "goal": "work",
  "onboardingCompleted": true
}
```

### 2. Check Redirect
- Acesse `/onboarding` com usuário que já completou
- Deve redirecionar para `/dashboard`

- Acesse `/dashboard` com usuário que NÃO completou
- Deve redirecionar para `/onboarding`

---

## 🐛 Troubleshooting

### Problema: "Cannot read property 'onboardingCompleted'"
**Causa:** Migration não rodou
**Solução:**
```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

### Problema: "Redirect loop infinito"
**Causa:** Hook useOnboarding em loop
**Solução:** Verificar console do browser, deve mostrar erro específico

### Problema: "Build error no frontend"
**Causa:** Arquivo `QUICK_INTEGRATION_EXAMPLE.tsx` com erro de tipo
**Solução:** Já foi renomeado para `.bak`, se aparecer de novo:
```bash
cd frontend
rm QUICK_INTEGRATION_EXAMPLE.tsx
```

---

## 📊 Arquivos Importantes

### Frontend
```
app/(protected)/onboarding/page.tsx       # Main wizard
components/onboarding/step-*.tsx          # Steps 1, 2, 3
hooks/useOnboarding.ts                    # Auto-redirect logic
```

### Backend
```
prisma/schema.prisma                      # User model
prisma/migrations/.../migration.sql       # SQL migration
src/modules/user/dto/update-user.dto.ts   # DTO com validações
```

---

## ✅ Checklist Rápido

Antes de testar:
- [ ] Migration rodou sem erro
- [ ] Frontend buildou sem erro (`npm run build`)
- [ ] Backend compilou sem erro
- [ ] Banco de dados está rodando
- [ ] Variáveis de ambiente configuradas

---

## 🎯 Próximos Passos

Após confirmar que funciona:

1. **Deploy Backend:**
   ```bash
   # Fly.io já vai rodar a migration automaticamente
   fly deploy
   ```

2. **Deploy Frontend:**
   ```bash
   # Vercel
   git push origin main
   # Auto-deploy acontece
   ```

3. **Monitorar:**
   - Taxa de conclusão do onboarding
   - Tempo médio por step
   - Abandono em cada step

---

## 📞 Suporte

Se algo não funcionar:
1. Check logs do backend
2. Check console do browser (frontend)
3. Verificar se migration rodou (`SELECT * FROM users LIMIT 1;`)
4. Verificar se Prisma gerou os tipos (`npx prisma generate`)

---

**Status:** ✅ Pronto para usar

**Tempo de setup:** ~5 minutos (com banco local já rodando)

**Compatibilidade:** Next.js 14+, NestJS 10+, Prisma 5+
