# Deployment Checklist - Frontend

## ✅ Pre-Deployment Verification

### Build Status
- [x] `npm run build` passes without errors
- [x] TypeScript compilation successful
- [x] No ESLint errors
- [x] All routes generate correctly
- [x] Static pages optimized
- [x] Dynamic routes configured

### Code Quality
- [x] All components follow CLAUDE.md design system
- [x] TypeScript strict mode enabled
- [x] No `any` types (except necessary)
- [x] Proper error handling
- [x] Loading states everywhere
- [x] Responsive design (mobile-first)
- [x] Accessibility (aria-labels)

### Features Complete
- [x] Authentication (Login/Signup)
- [x] Dashboard with stats
- [x] Topics selection
- [x] Conversation page
- [x] Audio recording
- [x] Message display
- [x] Feedback modal
- [x] Profile page

---

## 🔧 Environment Variables

### Required for Production

Create `.env.local` with:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Backend API
NEXT_PUBLIC_API_URL=https://your-backend-domain.fly.dev

# Storage
NEXT_PUBLIC_STORAGE_URL=https://your-backend-domain.fly.dev/storage
```

### Vercel Environment Variables

Add to Vercel dashboard:
1. Go to Project Settings > Environment Variables
2. Add each variable above
3. Select environments: Production, Preview, Development
4. Save and redeploy

---

## 🚀 Vercel Deployment

### Method 1: GitHub Integration (Recommended)

1. **Connect Repository**
   ```bash
   # Push to GitHub
   git add .
   git commit -m "feat: complete frontend Tasks 3.6-3.8"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Select root directory: `/frontend`
   - Framework preset: Next.js
   - Build command: `npm run build`
   - Output directory: `.next`

3. **Configure Environment Variables**
   - Add all variables from above
   - Click "Deploy"

4. **Domain Setup**
   - Vercel auto-assigns: `your-app.vercel.app`
   - Add custom domain if needed

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy from frontend directory
cd frontend
vercel

# Follow prompts:
# - Set up new project: Yes
# - Link to existing: No
# - Project name: fluentify-frontend
# - Framework: Next.js
# - Build command: npm run build
# - Output: .next

# Production deployment
vercel --prod
```

---

## 🔒 Security Checklist

- [x] Environment variables not committed
- [x] `.env.local` in `.gitignore`
- [x] API keys stored in Vercel env vars
- [x] CORS configured on backend
- [x] HTTPS only (Vercel default)
- [x] Authentication tokens in httpOnly cookies (Supabase default)
- [x] No sensitive data in client-side code

---

## 🎯 Performance Optimizations

### Already Implemented
- [x] Next.js App Router (automatic code splitting)
- [x] Static page generation where possible
- [x] Image optimization (Next.js default)
- [x] Font optimization (Google Fonts)
- [x] CSS optimization (Tailwind purge)
- [x] React Query caching
- [x] Lazy loading components

### To Consider (Future)
- [ ] Add next/image for user avatars
- [ ] Implement service worker (PWA)
- [ ] Add analytics (Vercel Analytics)
- [ ] Optimize audio blob size
- [ ] Add CDN for static assets

---

## 📊 Monitoring Setup

### Vercel Analytics (Built-in)
- Automatically enabled
- Real User Monitoring (RUM)
- Web Vitals tracking
- Edge Functions metrics

### Optional: Sentry Integration

```bash
npm install @sentry/nextjs
```

```javascript
// next.config.js
const { withSentryConfig } = require('@sentry/nextjs');

module.exports = withSentryConfig(
  {
    // Your Next.js config
  },
  {
    // Sentry config
    silent: true,
    org: 'your-org',
    project: 'fluentify-frontend',
  }
);
```

---

## 🧪 Testing Before Deploy

### Manual Testing Checklist

1. **Authentication Flow**
   - [ ] Sign up new user
   - [ ] Sign in existing user
   - [ ] Sign out
   - [ ] Session persistence
   - [ ] Protected routes redirect

2. **Dashboard**
   - [ ] Stats load correctly
   - [ ] Activity graph renders
   - [ ] Recent conversations display
   - [ ] Quick start button works

3. **Topics**
   - [ ] Topics grid loads
   - [ ] Filter by difficulty works
   - [ ] Click topic creates conversation
   - [ ] Redirects to conversation page

4. **Conversation**
   - [ ] Page loads conversation data
   - [ ] Messages display correctly
   - [ ] Audio recorder starts
   - [ ] Recording works
   - [ ] Timer updates
   - [ ] Stop recording works
   - [ ] Upload successful
   - [ ] AI response appears
   - [ ] Complete conversation works
   - [ ] Feedback modal shows

5. **Feedback Modal**
   - [ ] Scores display
   - [ ] Progress bars animate
   - [ ] Strengths/suggestions show
   - [ ] Grammar errors accordion
   - [ ] Navigation buttons work

6. **Responsive**
   - [ ] Mobile layout works
   - [ ] Tablet layout works
   - [ ] Desktop layout works
   - [ ] Touch interactions work

### Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

---

## 🔄 Deployment Process

### 1. Pre-Deploy
```bash
# Pull latest changes
git pull origin main

# Install dependencies
npm install

# Run build locally
npm run build

# Test production build
npm start
# Visit http://localhost:3000

# Run linter
npm run lint
```

### 2. Deploy
```bash
# Commit changes
git add .
git commit -m "chore: prepare for deployment"
git push origin main

# Vercel auto-deploys on push (if connected)
# Or manually:
vercel --prod
```

### 3. Post-Deploy Verification
- [ ] Visit production URL
- [ ] Test critical user flows
- [ ] Check Vercel logs for errors
- [ ] Monitor Web Vitals
- [ ] Test on mobile device

---

## 🐛 Troubleshooting

### Build Fails
```bash
# Clear cache
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

### Environment Variables Not Working
- Check Vercel dashboard
- Ensure variables are set for correct environment
- Redeploy after adding new variables
- Prefix must be `NEXT_PUBLIC_` for client-side access

### API Connection Issues
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check CORS settings on backend
- Ensure backend is deployed and running
- Test API endpoint directly

### Audio Recording Not Working
- Requires HTTPS in production (Vercel provides this)
- Check browser console for permission errors
- Test microphone access in browser settings
- Safari requires user interaction before mic access

---

## 📝 Post-Deployment Tasks

### Immediate
- [ ] Test all critical flows in production
- [ ] Monitor error logs (Vercel dashboard)
- [ ] Check performance metrics
- [ ] Verify analytics tracking

### Week 1
- [ ] Monitor user feedback
- [ ] Check conversion funnel
- [ ] Analyze Web Vitals
- [ ] Fix any reported bugs

### Ongoing
- [ ] Weekly deployment of updates
- [ ] Monthly dependency updates
- [ ] Quarterly performance reviews
- [ ] Regular security audits

---

## 📞 Support Resources

### Vercel
- Docs: https://vercel.com/docs
- Support: https://vercel.com/support
- Status: https://vercel-status.com

### Next.js
- Docs: https://nextjs.org/docs
- GitHub: https://github.com/vercel/next.js

### Supabase
- Docs: https://supabase.com/docs
- Status: https://status.supabase.com

---

## ✅ Final Checklist

Before marking as complete:

- [ ] All environment variables configured
- [ ] Production build successful
- [ ] Deployed to Vercel
- [ ] Custom domain configured (optional)
- [ ] SSL/HTTPS working
- [ ] All features tested in production
- [ ] Error monitoring setup
- [ ] Analytics configured
- [ ] Documentation updated
- [ ] Team notified

---

**Deployment Status**: Ready for Production ✅
**Last Updated**: Tasks 3.6-3.8 Completion
**Next Phase**: Fase 4 - Features Essenciais
