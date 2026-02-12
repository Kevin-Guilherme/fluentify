# Gamification Components Guide

## Overview

This guide explains how to use the gamification components (XP, Level, Streak) in the Fluentify frontend.

## Components

### 1. LevelUpModal

Displays a celebration modal when user levels up.

```tsx
import { LevelUpModal } from '@/components/shared';

function MyComponent() {
  const [showModal, setShowModal] = useState(false);

  return (
    <LevelUpModal
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      oldLevel="Beginner"
      newLevel="Intermediate"
      xpGained={100}
    />
  );
}
```

**Props:**
- `isOpen: boolean` - Controls modal visibility
- `onClose: () => void` - Callback when modal closes
- `oldLevel: string` - Previous level (e.g., "Beginner")
- `newLevel: string` - New level (e.g., "Intermediate")
- `xpGained: number` - XP earned in this level up

**Features:**
- Animated trophy icon with sparkles
- Gradient badge matching new level
- Smooth scale/fade animations
- Auto-plays celebration (optional sound)

---

### 2. XpAnimation

Floating +XP indicator that appears when user gains XP.

```tsx
import { XpAnimation } from '@/components/shared';

function ConversationComplete() {
  const [xpGained, setXpGained] = useState(0);
  const [triggerKey, setTriggerKey] = useState(0);

  const handleComplete = () => {
    setXpGained(50);
    setTriggerKey(prev => prev + 1);
  };

  return (
    <>
      <XpAnimation
        xpAmount={xpGained}
        triggerKey={triggerKey}
        onComplete={() => console.log('Animation done')}
      />
      <button onClick={handleComplete}>Complete</button>
    </>
  );
}
```

**Props:**
- `xpAmount: number` - Amount of XP to display
- `triggerKey?: string | number` - Change this to trigger animation
- `onComplete?: () => void` - Callback when animation finishes

**Behavior:**
- Floats up from center with fade out
- Shows for 2 seconds
- Includes particle effects

**Alternative: XpGainIndicator**

Compact inline version:

```tsx
import { XpGainIndicator } from '@/components/shared';

<XpGainIndicator xpAmount={50} position="bottom" />
```

---

### 3. LevelProgress

Progress bar showing progress to next level.

```tsx
import { LevelProgress } from '@/components/shared';

function Dashboard() {
  return (
    <LevelProgress
      currentXp={750}
      nextLevelXp={1000}
      level="Beginner"
      size="lg"
      showLabel={true}
    />
  );
}
```

**Props:**
- `currentXp: number` - User's current XP
- `nextLevelXp: number` - XP needed for next level
- `level: string` - Current level
- `size?: 'sm' | 'md' | 'lg'` - Size variant (default: 'md')
- `showLabel?: boolean` - Show labels and info (default: true)
- `className?: string` - Additional CSS classes

**Features:**
- Animated gradient progress bar
- Shimmer effect
- Shows XP remaining to next level
- Responsive text sizes

**Circular variant:**

```tsx
import { CircularLevelProgress } from '@/components/shared';

<CircularLevelProgress
  currentXp={750}
  nextLevelXp={1000}
  level="Beginner"
  size={120}
/>
```

---

### 4. StreakIndicator

Displays user's current streak with animations.

```tsx
import { StreakIndicator } from '@/components/shared';

function Header() {
  return (
    <StreakIndicator
      streak={7}
      showAnimation={true}
      size="md"
      compact={false}
    />
  );
}
```

**Props:**
- `streak: number` - Number of consecutive days
- `showAnimation?: boolean` - Animate when streak increases
- `size?: 'sm' | 'md' | 'lg'` - Size variant
- `compact?: boolean` - Show compact version (icon + number only)
- `className?: string` - Additional CSS classes

**Features:**
- Flame icon with pulse animation
- Color changes based on streak length
- Particle burst on streak increase
- Hover effects

**Color tiers:**
- 0-6 days: Amber
- 7-13 days: Yellow
- 14-29 days: Orange
- 30+ days: Red (hot streak)

**Card variant for dashboard:**

```tsx
import { StreakCard } from '@/components/shared';

<StreakCard
  streak={7}
  lastActiveDate="2026-02-12"
/>
```

---

## Hooks

### useGamification

Manages gamification state and logic.

```tsx
import { useGamification } from '@/hooks/useGamification';

function ConversationPage() {
  const {
    state,
    handleLevelUp,
    handleXpGain,
    closeLevelUpModal,
    resetXpAnimation
  } = useGamification();

  const onConversationComplete = (score: number) => {
    const xpEarned = calculateXp(score);

    // Show XP animation
    handleXpGain(xpEarned);

    // Check if leveled up
    const oldLevel = 'Beginner';
    const newLevel = checkLevel(currentXp + xpEarned);

    if (oldLevel !== newLevel) {
      handleLevelUp(oldLevel, newLevel, xpEarned);
    }
  };

  return (
    <>
      <XpAnimation
        xpAmount={state.xpGained}
        triggerKey={state.triggerKey}
        onComplete={resetXpAnimation}
      />

      <LevelUpModal
        isOpen={state.showLevelUpModal}
        onClose={closeLevelUpModal}
        oldLevel={state.oldLevel}
        newLevel={state.newLevel}
        xpGained={state.xpGained}
      />
    </>
  );
}
```

**Utility functions:**

```tsx
import {
  getNextLevelXp,
  calculateLevel,
  checkLevelUp,
  calculateConversationXp
} from '@/hooks/useGamification';

// Get XP needed for next level
const nextLevelXp = getNextLevelXp('Beginner'); // 1000

// Calculate level from XP
const level = calculateLevel(750); // "Beginner"

// Check if user leveled up
const { leveledUp, oldLevel, newLevel } = checkLevelUp(900, 1100);
// { leveledUp: true, oldLevel: "Beginner", newLevel: "Intermediate" }

// Calculate XP from conversation
const xp = calculateConversationXp(85, 8); // score=85, messages=8
// Returns: 20 (base) + 42 (score bonus) + 30 (message bonus) = 92 XP
```

---

## Integration Examples

### Example 1: Conversation Completion

```tsx
'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useGamification } from '@/hooks/useGamification';
import { XpAnimation, LevelUpModal } from '@/components/shared';
import { conversationsApi } from '@/lib/api';

export default function ConversationPage({ params }: { params: { id: string } }) {
  const {
    state,
    handleLevelUp,
    handleXpGain,
    closeLevelUpModal,
    resetXpAnimation
  } = useGamification();

  const completeMutation = useMutation({
    mutationFn: () => conversationsApi.complete(params.id),
    onSuccess: (data) => {
      const { xpEarned, oldLevel, newLevel } = data;

      // Always show XP animation
      handleXpGain(xpEarned);

      // Show level up modal if leveled up
      if (oldLevel !== newLevel) {
        setTimeout(() => {
          handleLevelUp(oldLevel, newLevel, xpEarned);
        }, 1500); // Delay to show XP animation first
      }
    }
  });

  return (
    <div>
      {/* XP Animation */}
      <XpAnimation
        xpAmount={state.xpGained}
        triggerKey={state.triggerKey}
        onComplete={resetXpAnimation}
      />

      {/* Level Up Modal */}
      <LevelUpModal
        isOpen={state.showLevelUpModal}
        onClose={closeLevelUpModal}
        oldLevel={state.oldLevel}
        newLevel={state.newLevel}
        xpGained={state.xpGained}
      />

      {/* Your conversation UI */}
      <button onClick={() => completeMutation.mutate()}>
        Complete Conversation
      </button>
    </div>
  );
}
```

---

### Example 2: Dashboard with All Components

```tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { LevelProgress, StreakCard } from '@/components/shared';
import { usersApi } from '@/lib/api';

export default function DashboardPage() {
  const { data: stats } = useQuery({
    queryKey: ['user-stats'],
    queryFn: () => usersApi.getStats()
  });

  return (
    <div className="p-8 space-y-6">
      {/* Level Progress */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <LevelProgress
          currentXp={stats?.xp || 0}
          nextLevelXp={1000}
          level={stats?.level || 'Beginner'}
          size="lg"
        />
      </div>

      {/* Streak Card */}
      <StreakCard
        streak={stats?.streak || 0}
        lastActiveDate={stats?.lastActiveDate}
      />
    </div>
  );
}
```

---

### Example 3: Header with Responsive Streak

```tsx
import { Header } from '@/components/layout/header';

function MyPage({ stats }) {
  return (
    <Header
      title="Dashboard"
      subtitle="Track your progress"
      xp={stats.xp}
      streak={stats.streak}
      level={stats.level}
    />
  );
}
```

The Header component automatically shows:
- Desktop: Full StreakIndicator with text
- Mobile: Compact StreakIndicator (icon + number only)

---

## Styling & Customization

### CSS Variables

The components use CSS variables from the design system:

```css
/* Colors */
--primary: #3B82F6;        /* Blue */
--secondary: #8B5CF6;      /* Purple */
--accent: #F59E0B;         /* Orange */

/* Gradients */
.bg-gradient-to-br from-blue-500 to-purple-600
.bg-gradient-to-r from-orange-500 to-red-500
```

### Tailwind Classes

All components use Tailwind CSS with the design system:
- Dark theme by default
- Responsive breakpoints (sm, md, lg)
- Hover states with transitions
- Framer Motion animations

### Custom Animations

Components use Framer Motion for smooth animations:
- Scale transforms
- Fade in/out
- Rotate effects
- Particle systems

---

## XP & Level Calculation

### Level Thresholds

```typescript
BEGINNER: 0 - 999 XP
INTERMEDIATE: 1000 - 2499 XP
ADVANCED: 2500+ XP
```

### XP Formula for Conversations

```typescript
baseXp = 20
scoreBonus = score * 0.5         // 0-50 XP (score 0-100)
messageBonus = min(messages * 5, 30)  // 5 XP per message, max 30

totalXp = baseXp + scoreBonus + messageBonus
```

**Examples:**
- Score 80, 6 messages: 20 + 40 + 30 = 90 XP
- Score 60, 3 messages: 20 + 30 + 15 = 65 XP
- Score 100, 10 messages: 20 + 50 + 30 = 100 XP

---

## Streak Logic

### Streak Rules

1. **Maintain streak**: User must complete at least 1 conversation per day
2. **Break streak**: Missing a day resets streak to 0
3. **Increase streak**: Completing first conversation of the day increments streak

### Backend Integration

The backend should:
1. Track `lastActiveDate` for each user
2. Compare with current date on conversation completion
3. Increment streak if dates are consecutive
4. Reset streak if gap > 1 day

```typescript
// Backend pseudo-code
async function updateStreak(userId: string) {
  const user = await getUser(userId);
  const today = new Date().toDateString();
  const lastActive = new Date(user.lastActiveDate).toDateString();

  if (lastActive === today) {
    // Same day, no change
    return user.streak;
  }

  const daysSince = daysDifference(lastActive, today);

  if (daysSince === 1) {
    // Consecutive day, increment
    user.streak += 1;
  } else if (daysSince > 1) {
    // Missed days, reset
    user.streak = 1;
  }

  user.lastActiveDate = new Date();
  await saveUser(user);

  return user.streak;
}
```

---

## Accessibility

All components include:
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader support
- Reduced motion support (respects `prefers-reduced-motion`)

---

## Performance

### Optimization Tips

1. **Use triggerKey for XpAnimation**: Prevents unnecessary re-renders
2. **Memoize callbacks**: Use `useCallback` for event handlers
3. **Lazy load modals**: Only render when `isOpen={true}`
4. **Optimize animations**: Framer Motion animations are GPU-accelerated

### Bundle Size

All gamification components are tree-shakeable:
- Import only what you need
- Total size: ~15KB gzipped (including Framer Motion)

---

## Testing

### Unit Tests

```tsx
import { render, screen } from '@testing-library/react';
import { LevelProgress } from '@/components/shared';

test('shows correct XP progress', () => {
  render(
    <LevelProgress
      currentXp={500}
      nextLevelXp={1000}
      level="Beginner"
    />
  );

  expect(screen.getByText('500')).toBeInTheDocument();
  expect(screen.getByText('1,000 XP')).toBeInTheDocument();
  expect(screen.getByText('500 XP to Intermediate')).toBeInTheDocument();
});
```

---

## Troubleshooting

### Animation Not Triggering

**Problem**: XpAnimation doesn't show
**Solution**: Make sure to update `triggerKey` prop

```tsx
// ❌ Wrong
<XpAnimation xpAmount={xp} />

// ✅ Correct
<XpAnimation xpAmount={xp} triggerKey={Date.now()} />
```

### Modal Not Closing

**Problem**: LevelUpModal stays open
**Solution**: Update `isOpen` state in `onClose` callback

```tsx
const [isOpen, setIsOpen] = useState(false);

<LevelUpModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)} // Must update state
  {...props}
/>
```

### Progress Bar Not Animating

**Problem**: LevelProgress bar appears instantly
**Solution**: Ensure Framer Motion is installed

```bash
npm install framer-motion
```

---

## Next Steps

1. Integrate gamification into conversation completion flow
2. Add sound effects for level up and XP gain
3. Implement streak notification system
4. Add achievement badges
5. Create leaderboard component

---

## Support

For questions or issues:
- Check COMPONENT_GUIDE.md for general UI patterns
- Review CLAUDE.md for design system details
- See hooks/useGamification.ts for state management

