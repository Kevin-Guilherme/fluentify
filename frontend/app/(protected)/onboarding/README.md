# Onboarding Flow

Multi-step wizard para primeira experiência de novos usuários.

## Estrutura

### Steps
1. **Step 1 - Welcome + Nome**: Captura o nome do usuário
2. **Step 2 - Nível**: Seleção do nível de inglês (Beginner, Intermediate, Advanced, Fluent)
3. **Step 3 - Objetivo**: Escolha do objetivo (Travel, Work, Study, General)

### Componentes
- `page.tsx`: Página principal com state management e wizard
- `components/onboarding/step-name.tsx`: Step 1
- `components/onboarding/step-level.tsx`: Step 2
- `components/onboarding/step-goals.tsx`: Step 3
- `components/onboarding/progress-bar.tsx`: Indicador de progresso

### Features
- Progress bar animado (1/3, 2/3, 3/3)
- Transições suaves entre steps (Framer Motion)
- Validação de campos
- Navegação com Back/Continue
- Skip onboarding (link discreto)
- Loading state no submit
- Auto-redirect para dashboard após conclusão

### Lógica de Detecção
- Hook `useOnboarding()` verifica se usuário já completou
- Redirect automático para `/onboarding` se `onboardingCompleted === false`
- Redirect automático para `/dashboard` se já completou e está em `/onboarding`

### Backend Integration
- **Endpoint**: `PATCH /users/me`
- **Payload**:
  ```json
  {
    "name": "João Silva",
    "level": "intermediate",
    "goal": "work",
    "onboardingCompleted": true
  }
  ```

### Database Schema
```sql
ALTER TABLE "users"
  ADD COLUMN "goal" TEXT,
  ADD COLUMN "onboarding_completed" BOOLEAN NOT NULL DEFAULT false;
```

### Responsividade
- Desktop: Grid 2x2 para cards, layout centralizado
- Mobile: Stack vertical, full-width cards
- Animações adaptativas

### Quando executar migration
```bash
cd backend
npx prisma migrate dev
```

### Preview
Para testar o onboarding, defina `onboardingCompleted: false` no usuário via banco de dados ou API.
