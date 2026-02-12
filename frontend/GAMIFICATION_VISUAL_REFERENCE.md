# Gamification Components - Visual Reference

## Component Showcase

### 1. LevelUpModal 🎉

**Desktop View:**
```
┌────────────────────────────────────────┐
│                                        │
│              🏆 (animated)             │
│           ✨ ✨ ✨ ✨ ✨ ✨          │
│                                        │
│          🎉 Level Up!                 │
│     Congratulations! You reached       │
│                                        │
│      ┌──────────────────────┐         │
│      │   INTERMEDIATE       │         │
│      │  (purple gradient)   │         │
│      └──────────────────────┘         │
│                                        │
│          XP Earned                     │
│           +100 XP                      │
│                                        │
│     [Beginner] → [Intermediate]       │
│                                        │
│   ┌──────────────────────────┐        │
│   │  Continue Learning       │        │
│   └──────────────────────────┘        │
│                                        │
└────────────────────────────────────────┘
```

**Features:**
- Backdrop blur overlay
- Animated trophy with rotating sparkles
- Smooth scale-in animation
- Gradient level badge
- Pulsing XP number
- Blue→Purple gradient button

---

### 2. XpAnimation ✨

**Animation Sequence:**
```
Frame 1 (0s):
     (appears at center)

Frame 2 (0.5s):
     ┌────────────────┐
     │ ✨ +50 XP ✨  │
     └────────────────┘
     ↑ (rising)

Frame 3 (1s):
          ┌────────────────┐
          │ ✨ +50 XP ✨  │
          └────────────────┘
          ↑↑ (floating up)

Frame 4 (2s):
               (faded out)
```

**Compact Version:**
```
┌───────────────┐
│ ✨ +50 XP    │  ← Appears inline
└───────────────┘
```

---

### 3. LevelProgress 📊

**Large Size (Dashboard):**
```
┌─────────────────────────────────────────────────┐
│  ⭐ Level Progress          750 / 1,000 XP     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░  │ 75%
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                 │
│         250 XP to Intermediate                  │
└─────────────────────────────────────────────────┘
```

**Medium Size (Profile):**
```
┌────────────────────────────────────────┐
│  ⭐ Level Progress    750 / 1,000 XP  │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░  │ 75%
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│       250 XP to Intermediate           │
└────────────────────────────────────────┘
```

**Small Size (Inline):**
```
┌──────────────────────────┐
│  750 / 1,000 XP         │
│  ▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░  │ 75%
└──────────────────────────┘
```

**Circular Variant:**
```
      ╭───────╮
     │   ⭐   │
     │   75%  │
      ╰───────╯
   (circular progress)
```

**Gradients by Level:**
- **Beginner**: Blue → Cyan
- **Intermediate**: Purple → Pink
- **Advanced**: Orange → Red

---

### 4. StreakIndicator 🔥

**Full Version (Desktop):**
```
┌─────────────────┐
│  🔥  7          │
│      days       │
└─────────────────┘
```

**With Animation (Streak Increased):**
```
┌─────────────────┐
│  🔥  8  ✨✨    │  ← Particles burst
│      days       │
└─────────────────┘
```

**Compact Version (Mobile):**
```
┌──────┐
│ 🔥 7 │
└──────┘
```

**Color Progression:**
```
Streak 1-6:   🔥 (Amber)
Streak 7-13:  🔥 (Yellow)
Streak 14-29: 🔥 (Orange)
Streak 30+:   🔥 (Red - HOT!)
```

---

### 5. StreakCard 📅

**Dashboard Card:**
```
┌──────────────────────────────────────────┐
│  🔥  Streak              Keep it going!  │
│                                          │
│      7                                   │
│      days                                │
│                                          │
│  Current: 7 days        Next: 14 days   │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░  │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                          │
│  Last active: Feb 12, 2026               │
└──────────────────────────────────────────┘
```

**Streak Messages:**
- 0: "Start your streak!"
- 1: "First day!"
- 2-6: "Keep it going!"
- 7-13: "1 week streak!"
- 14-29: "2+ weeks!"
- 30-99: "On fire!"
- 100+: "Legendary!"

---

## Layout Examples

### Dashboard Header
```
┌────────────────────────────────────────────────────────────┐
│  Dashboard                        ┌──────┐ ┌────┐ ┌──────┐ │
│  Track your progress              │🏆 750│ │🔥 7│ │⭐ Beg│ │
│                                   └──────┘ └────┘ └──────┘ │
└────────────────────────────────────────────────────────────┘
```

### Dashboard Content
```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │  🏆 750  │ │  🔥 7    │ │  ⭐ Beg  │ │  💬 12   │  │
│  │  XP      │ │  Streak  │ │  Level   │ │  Convos  │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │  ⭐ Level Progress      750 / 1,000 XP            │ │
│  │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░  75%       │ │
│  │  250 XP to Intermediate                          │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌─────────────────────┐  ┌─────────────────────────┐  │
│  │  Weekly Activity    │  │  Recent Conversations   │  │
│  │  [Graph]           │  │  [List]                │  │
│  └─────────────────────┘  └─────────────────────────┘  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Profile Page
```
┌──────────────────────────────────────────────────────────┐
│  Profile                          ┌──────┐ ┌────┐ ┌─────┐│
│  Manage your account              │🏆 750│ │🔥 7│ │⭐Beg││
│                                   └──────┘ └────┘ └─────┘│
└──────────────────────────────────────────────────────────┘

┌────────────────────────────────────┐
│  Account Information               │
│  ─────────────────────────────────│
│  Name: Kevin Souza                 │
│  Email: kevin@example.com          │
│  Level: Beginner                   │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│  Learning Progress                 │
│  ─────────────────────────────────│
│  ⭐ Level Progress  750 / 1,000 XP│
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░  75%       │
│  250 XP to Intermediate            │
│                                    │
│  Total XP: 750                     │
│  Total Conversations: 12           │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│  🔥  Streak    Keep it going!      │
│                                    │
│      7                             │
│      days                          │
│                                    │
│  Current: 7 days   Next: 14 days  │
│  ▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░  50%      │
└────────────────────────────────────┘
```

### Mobile Header
```
┌────────────────────────────┐
│  Dashboard    🏆750 🔥7 ⭐ │  ← Compact layout
└────────────────────────────┘
```

---

## Animation Timeline

### Level Up Flow
```
Event: User completes conversation
  ↓
[0s] Calculate XP earned (e.g., 100 XP)
  ↓
[0s] Trigger XP Animation
  ↓ ┌────────────────┐
    │ ✨ +100 XP ✨ │  ← Floats up for 2s
    └────────────────┘
  ↓
[1.5s] Check if leveled up
  ↓
[1.5s] If yes, show Level Up Modal
  ↓ ┌──────────────────────┐
    │      🏆 (spin)       │
    │   🎉 Level Up!      │
    │   [INTERMEDIATE]     │
    └──────────────────────┘
  ↓
[User clicks] Close modal
  ↓
[End] Update UI with new stats
```

### Streak Update Flow
```
Event: User completes first conversation of the day
  ↓
[0s] Backend updates streak
  ↓
[0s] Frontend receives new streak value
  ↓
[0s] StreakIndicator animates
  ↓ 🔥 → [scale+rotate] → ✨✨✨ (particles)
  ↓
[1s] Animation completes
  ↓
[End] Streak indicator shows new value
```

---

## Color Palette

### Level Gradients
```css
Beginner:
  from-blue-500 to-cyan-500
  #3B82F6 → #06B6D4
  ████████████

Intermediate:
  from-purple-500 to-pink-500
  #8B5CF6 → #EC4899
  ████████████

Advanced:
  from-orange-500 to-red-500
  #F97316 → #EF4444
  ████████████
```

### Streak Gradients
```css
1-6 days (Amber):
  from-amber-500 to-yellow-600
  #F59E0B → #CA8A04
  ████████████

7-13 days (Yellow):
  from-yellow-500 to-amber-500
  #EAB308 → #F59E0B
  ████████████

14-29 days (Orange):
  from-orange-500 to-yellow-500
  #F97316 → #EAB308
  ████████████

30+ days (Red):
  from-red-500 to-orange-500
  #EF4444 → #F97316
  ████████████
```

### Background Colors
```css
Primary BG:   #0F172A (slate-900)  ████
Secondary BG: #1E293B (slate-800)  ████
Border:       #334155 (slate-700)  ████
```

---

## Responsive Breakpoints

### Mobile (<640px)
- Header: Compact streak (icon only)
- Stats cards: 1 column
- Level progress: Small size
- XP animation: Smaller scale

### Tablet (640px-1024px)
- Header: Full streak indicator
- Stats cards: 2 columns
- Level progress: Medium size
- All components visible

### Desktop (>1024px)
- Header: Full layout
- Stats cards: 4 columns
- Level progress: Large size
- All animations enabled

---

## Accessibility

### Keyboard Navigation
```
Tab       → Focus next interactive element
Enter     → Activate button/close modal
Escape    → Close modal
Space     → Activate button
```

### Screen Reader Announcements
```
"Level up! You reached Intermediate"
"Earned 100 experience points"
"Current streak: 7 days"
"Progress to next level: 75 percent"
```

### Focus States
```
Button:   2px blue outline
Card:     2px purple outline
Modal:    Trapped focus within
```

---

## Performance Metrics

### Animation FPS
- Target: 60 FPS
- LevelUpModal: 60 FPS (GPU-accelerated)
- XpAnimation: 60 FPS (transform-only)
- LevelProgress: 60 FPS (width transition)
- StreakIndicator: 60 FPS (scale+rotate)

### Load Times
- Initial render: <16ms
- Animation start: <8ms
- Smooth transitions: No jank

---

## Component States

### LevelUpModal States
```
1. Closed (default)
2. Opening (scale 0.8 → 1)
3. Open (displaying)
4. Closing (scale 1 → 0.8)
```

### XpAnimation States
```
1. Hidden (default)
2. Appearing (y:0, opacity:0)
3. Rising (y:-60, opacity:1)
4. Fading (y:-100, opacity:0)
```

### LevelProgress States
```
1. Empty (0%)
2. Animating (0% → X%)
3. Complete (X%)
4. Full (100%)
```

### StreakIndicator States
```
1. Idle (default pulse)
2. Increasing (scale+rotate+particles)
3. Hover (background fade)
4. Broken (reset to 0)
```

---

## Integration Checklist

### Backend Requirements
- [ ] Return `xpEarned` from conversation endpoint
- [ ] Return `leveledUp` boolean
- [ ] Return `oldLevel` and `newLevel` strings
- [ ] Update streak on first daily conversation
- [ ] Calculate XP based on score and message count

### Frontend Integration
- [ ] Import gamification components
- [ ] Add useGamification hook
- [ ] Handle conversation completion
- [ ] Trigger animations on events
- [ ] Update stats display

### Testing
- [ ] Test all animations on slow network
- [ ] Test on different screen sizes
- [ ] Test keyboard navigation
- [ ] Test screen reader compatibility
- [ ] Test color contrast

---

## Tips & Best Practices

### Animation Performance
✅ Use transform (scale, translate, rotate)
❌ Avoid animating width, height, top, left

### State Management
✅ Use triggerKey to force re-animation
❌ Don't rely on xpAmount alone

### Responsive Design
✅ Test on real mobile devices
❌ Don't assume desktop behavior

### Accessibility
✅ Always include ARIA labels
❌ Don't hide important info from screen readers

---

This visual reference provides a complete overview of all gamification components and their usage patterns.
