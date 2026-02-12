# Gamification System - Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FLUENTIFY BACKEND                            │
│                    Gamification System (Tasks 4.1 & 4.2)            │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                           USER MODULE                                 │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────────────────┐         ┌──────────────────────┐          │
│  │   UserController    │────────▶│   UserService        │          │
│  │                     │         │                      │          │
│  │ GET /users/me       │         │ - getUserById()      │          │
│  │ GET /users/me/stats │         │ - getUserStats()     │          │
│  │ GET /users/me/      │         │ - getUserProgress()  │◀─ NEW   │
│  │     progress        │         │ - checkLevelUp()     │◀─ NEW   │
│  └─────────────────────┘         │ - updateUser()       │          │
│                                   │                      │          │
│                                   │ LEVEL_THRESHOLDS:    │          │
│                                   │   BEGINNER: 0        │          │
│                                   │   INTERMEDIATE: 1000 │          │
│                                   │   ADVANCED: 5000     │          │
│                                   │   FLUENT: 15000      │          │
│                                   └──────────────────────┘          │
│                                              │                       │
│                                              │ uses                  │
│                                              ▼                       │
│                                   ┌──────────────────────┐          │
│                                   │   StreakService      │◀─ NEW   │
│                                   │                      │          │
│                                   │ - updateStreak()     │          │
│                                   │ - getStreak()        │          │
│                                   │                      │          │
│                                   │ Private helpers:     │          │
│                                   │ - getStartOfDay()    │          │
│                                   │ - getDaysDifference()│          │
│                                   └──────────────────────┘          │
│                                              │                       │
└──────────────────────────────────────────────┼───────────────────────┘
                                               │
                                               │ exported to
                                               ▼
┌──────────────────────────────────────────────────────────────────────┐
│                      CONVERSATION MODULE                              │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────────────────────┐         ┌──────────────────────────┐  │
│  │  ConversationController │────────▶│  ConversationService     │  │
│  │                         │         │                          │  │
│  │ POST /conversations     │         │ - createConversation()   │  │
│  │ POST /:id/complete      │         │ - completeConversation() │  │
│  │ POST /:id/message       │         │ - sendMessage()          │  │
│  └─────────────────────────┘         └────────────┬─────────────┘  │
│                                                    │                 │
│                                                    │ calls           │
│         ┌──────────────────────────────────────────┼──────┐         │
│         │                                          │      │         │
│         ▼                                          ▼      ▼         │
│  ┌──────────────┐                    ┌─────────────────────────┐  │
│  │ GroqFeedback │                    │   XpCalculatorService   │  │
│  │   Service    │                    │                         │  │
│  │              │                    │ - calculateXP()         │  │
│  │ - analyze    │                    │ - getBaseXP()           │  │
│  │   Speaking() │                    │ - getStreakBonus()      │  │
│  └──────────────┘                    └─────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   │ imports & uses
                                   ▼
                    ┌──────────────────────────────┐
                    │      UserModule Services     │
                    │                              │
                    │  - StreakService             │
                    │  - UserService               │
                    └──────────────────────────────┘

```

---

## Conversation Completion Flow (Enhanced)

```
┌────────────────────────────────────────────────────────────────┐
│  POST /conversations/:id/complete                              │
└────────────────────────────────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────────┐
        │  ConversationService.completeConv()   │
        └───────────────────────────────────────┘
                            │
                            ├─── 1. Verify conversation exists & active
                            │
                            ├─── 2. Get user info (level, streak)
                            │
                            ├─── 3. Calculate duration
                            │
                            ├─── 4. Get user messages
                            │         │
                            │         ▼
                            │    ┌──────────────────────────┐
                            │    │ GroqFeedbackService      │
                            │    │  analyzeSpeaking()       │
                            │    └──────────────────────────┘
                            │         │
                            │         ▼
                            │    Returns: FeedbackAnalysis
                            │
                            ├─── 5. Calculate XP
                            │         │
                            │         ▼
                            │    ┌──────────────────────────┐
                            │    │ XpCalculatorService      │
                            │    │  calculateXP()           │
                            │    └──────────────────────────┘
                            │         │
                            │         ▼
                            │    Returns: xpEarned
                            │
                            ├─── 6. Update Conversation
                            │    (status, score, xpEarned, duration)
                            │
                            ├─── 7. Create Feedback Record
                            │
                            ├─── 8. Update User XP
                            │    (increment by xpEarned)
                            │
                            ├─── 9. Update Streak ◀──── NEW
                            │         │
                            │         ▼
                            │    ┌──────────────────────────┐
                            │    │ StreakService            │
                            │    │  updateStreak(userId)    │
                            │    │                          │
                            │    │ Logic:                   │
                            │    │ - Compare lastActiveAt   │
                            │    │ - Same day? No change    │
                            │    │ - Next day? +1           │
                            │    │ - Gap >1? Reset to 1     │
                            │    └──────────────────────────┘
                            │         │
                            │         ▼
                            │    Returns: StreakUpdateResult
                            │    {
                            │      currentStreak,
                            │      previousStreak,
                            │      streakContinued,
                            │      streakBroken
                            │    }
                            │
                            ├─── 10. Check Level Up ◀──── NEW
                            │         │
                            │         ▼
                            │    ┌──────────────────────────┐
                            │    │ UserService              │
                            │    │  checkLevelUp(userId)    │
                            │    │                          │
                            │    │ Logic:                   │
                            │    │ - Get user.xp            │
                            │    │ - Calculate level        │
                            │    │ - If changed, update DB  │
                            │    └──────────────────────────┘
                            │         │
                            │         ▼
                            │    Returns: LevelUpResult
                            │    {
                            │      leveledUp,
                            │      newLevel,
                            │      previousLevel,
                            │      currentXP
                            │    }
                            │
                            └─── 11. Return Enhanced Response
                                      │
                                      ▼
                            ┌─────────────────────────┐
                            │ CompleteConversation    │
                            │ ResponseDto             │
                            │                         │
                            │ - conversationId        │
                            │ - status                │
                            │ - score                 │
                            │ - xpEarned              │
                            │ - feedback              │
                            │ - streak ◀──── NEW     │
                            │ - levelUp ◀──── NEW    │
                            └─────────────────────────┘
```

---

## Progress Tracking Flow (New Endpoint)

```
┌────────────────────────────────────────────────────────────────┐
│  GET /users/me/progress                                        │
└────────────────────────────────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────────┐
        │  UserController.getMyProgress()       │
        └───────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────────┐
        │  UserService.getUserProgress(userId)  │
        └───────────────────────────────────────┘
                            │
                            ├─── 1. Get user (id, xp, level)
                            │
                            ├─── 2. Get current level threshold
                            │         (e.g., INTERMEDIATE = 1000 XP)
                            │
                            ├─── 3. Get next level threshold
                            │         (e.g., ADVANCED = 5000 XP)
                            │
                            ├─── 4. Calculate progress
                            │         currentXP = 1250
                            │         xpInCurrentLevel = 1250 - 1000 = 250
                            │         xpNeeded = 5000 - 1000 = 4000
                            │         progress = (250 / 4000) * 100 = 6.25%
                            │         xpToNextLevel = 5000 - 1250 = 3750
                            │
                            └─── 5. Return UserProgressDto
                                      │
                                      ▼
                            ┌─────────────────────────┐
                            │ UserProgressDto         │
                            │                         │
                            │ - currentXP: 1250       │
                            │ - currentLevel:         │
                            │   INTERMEDIATE          │
                            │ - nextLevel: ADVANCED   │
                            │ - nextLevelXP: 5000     │
                            │ - progressPercentage: 6 │
                            │ - xpToNextLevel: 3750   │
                            └─────────────────────────┘
```

---

## Database Schema (Existing - No Changes)

```
┌─────────────────────────────────────────────────────┐
│                      User                            │
├─────────────────────────────────────────────────────┤
│ id              String     @id @default(uuid())     │
│ supabaseId      String     @unique                  │
│ email           String     @unique                  │
│ name            String                              │
│ avatarUrl       String?                             │
│                                                      │
│ level           UserLevel  @default(BEGINNER) ◀──┐ │
│ xp              Int        @default(0)         ◀──┤ │  Used by
│ streak          Int        @default(0)         ◀──┤ │  gamification
│ lastActiveAt    DateTime?                      ◀──┘ │
│                                                      │
│ createdAt       DateTime   @default(now())          │
│ updatedAt       DateTime   @updatedAt               │
└─────────────────────────────────────────────────────┘
                    │
                    │ 1:N
                    ▼
┌─────────────────────────────────────────────────────┐
│                 Conversation                         │
├─────────────────────────────────────────────────────┤
│ id              String                              │
│ userId          String                              │
│ topicId         String                              │
│ status          ConversationStatus                  │
│ score           Int?                                │
│ xpEarned        Int?                    ◀─── Set on│
│ duration        Int?                    completion  │
│ createdAt       DateTime                            │
│ updatedAt       DateTime                            │
└─────────────────────────────────────────────────────┘
```

---

## Level Progression Chart

```
  FLUENT ──────────────────────────────────▶ 15000+ XP
    ▲
    │
    │ +10000 XP
    │
  ADVANCED ─────────────────────────────────▶ 5000 XP
    ▲
    │
    │ +4000 XP
    │
  INTERMEDIATE ─────────────────────────────▶ 1000 XP
    ▲
    │
    │ +1000 XP
    │
  BEGINNER ─────────────────────────────────▶ 0 XP
   (start)


Thresholds:
─────────────────────────────────────────────
  0 XP      │  BEGINNER
  1000 XP   │  INTERMEDIATE
  5000 XP   │  ADVANCED
  15000 XP  │  FLUENT (max)
─────────────────────────────────────────────
```

---

## Streak Logic Flowchart

```
                    ┌──────────────────────┐
                    │  User completes      │
                    │  conversation        │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │  Get user.lastActiveAt│
                    └──────────┬───────────┘
                               │
                    ┌──────────▼───────────┐
                    │  lastActiveAt null?  │
                    └──────┬───────┬───────┘
                           │       │
                       YES │       │ NO
                           │       │
                           ▼       ▼
                    ┌──────────┐  ┌──────────────────────┐
                    │ streak=1 │  │ Compare dates        │
                    │ (first)  │  └──────┬───────────────┘
                    └──────────┘         │
                                         │
                           ┌─────────────┼─────────────┐
                           │             │             │
                    SAME DAY      NEXT DAY      GAP >1 DAY
                           │             │             │
                           ▼             ▼             ▼
                    ┌──────────┐  ┌──────────┐  ┌──────────┐
                    │ No change│  │ streak+1 │  │ streak=1 │
                    │          │  │ (continue)│  │ (broken) │
                    └──────────┘  └──────────┘  └──────────┘
                           │             │             │
                           └─────────────┼─────────────┘
                                         │
                                         ▼
                           ┌──────────────────────────┐
                           │ Update user:             │
                           │ - streak = newStreak     │
                           │ - lastActiveAt = now     │
                           └──────────────────────────┘
```

---

## Service Dependencies

```
┌─────────────────────────────────────────────────────────┐
│                    Module Dependencies                   │
└─────────────────────────────────────────────────────────┘

ConversationModule
    │
    ├─── imports: [
    │       PrismaModule,
    │       GroqModule,
    │       UserModule ◀──── NEW
    │    ]
    │
    └─── providers: [
            ConversationService (uses UserService, StreakService),
            XpCalculatorService
         ]

UserModule
    │
    ├─── imports: []
    │
    ├─── providers: [
    │       UserService,
    │       StreakService ◀──── NEW
    │    ]
    │
    └─── exports: [
            UserService,
            StreakService ◀──── NEW
         ]
```

---

## Error Handling Flow

```
Any Service Method
        │
        ├─── Try to execute
        │
        ├─── Validation fails?
        │         │
        │         └──▶ throw BusinessException(
        │                 MappedsReturnsEnum.XXX_ERROR,
        │                 "Human readable message"
        │               )
        │                     │
        │                     ▼
        │              ┌──────────────────────┐
        │              │ Global Exception     │
        │              │ Filter               │
        │              │                      │
        │              │ Returns:             │
        │              │ {                    │
        │              │   error: "XXX_ERROR",│
        │              │   message: "...",    │
        │              │   statusCode: 4xx    │
        │              │ }                    │
        │              └──────────────────────┘
        │
        └─── Success
                  │
                  └──▶ Return DTO
```

---

## XP Calculation Formula

```
┌─────────────────────────────────────────────────────────┐
│              XP Calculation (Existing)                   │
└─────────────────────────────────────────────────────────┘

Base XP = calculateBaseXP(feedback.overallScore, userLevel)
    │
    ├── Score 90-100: 100 XP (Beginner), 150 XP (Intermediate), ...
    ├── Score 80-89:  80 XP
    ├── Score 70-79:  60 XP
    └── Score <70:    40 XP

Duration Bonus = min(duration * 0.1, 50)
    │
    └── Max 50 XP for long conversations

Streak Bonus = streak >= 7 ? baseXP * 0.2 : 0
    │
    └── +20% bonus for 7+ day streak

TOTAL XP = Base + Duration Bonus + Streak Bonus
```

---

## Response DTOs Structure

```
CompleteConversationResponseDto
├── conversationId: string
├── status: string
├── score: number
├── xpEarned: number
├── feedback: FeedbackAnalysis
│   ├── grammarScore: number
│   ├── vocabularyScore: number
│   ├── fluencyScore: number
│   ├── overallScore: number
│   ├── grammarErrors: []
│   ├── suggestions: []
│   └── strengths: []
├── streak: { ◀──── NEW
│   ├── current: number
│   ├── previous: number
│   ├── continued: boolean
│   └── broken: boolean
│   }
└── levelUp: { ◀──── NEW
    ├── leveledUp: boolean
    ├── newLevel?: UserLevel
    └── previousLevel: UserLevel
    }

UserProgressDto ◀──── NEW DTO
├── currentXP: number
├── currentLevel: UserLevel
├── nextLevel: UserLevel | null
├── nextLevelXP: number | null
├── progressPercentage: number (0-100)
└── xpToNextLevel: number | null
```

---

## Logging Strategy

```
┌─────────────────────────────────────────────────────────┐
│                    Log Levels & Events                   │
└─────────────────────────────────────────────────────────┘

INFO (UserService)
  - "User {id} leveled up: {old} → {new} (XP: {xp})"

INFO (StreakService)
  - "User {id}: Same day activity, streak unchanged at {n}"
  - "User {id}: Consecutive day activity, streak {old} → {new}"
  - "User {id}: First activity, streak set to 1"

WARN (StreakService)
  - "User {id}: Streak broken after {days} days gap. Reset {old} → 1"

INFO (ConversationService)
  - "User {id} streak updated: {old} → {new}"
  - "User {id} leveled up: {old} → {new}"
  - "Conversation {id} completed. XP earned: {xp}"
```

---

**Architecture Summary:**

✅ **Clean Separation**: Streak logic in dedicated service
✅ **Type Safety**: All DTOs properly typed
✅ **Dependency Injection**: Services properly injected
✅ **Error Handling**: BusinessException pattern followed
✅ **Logging**: Comprehensive logging at all levels
✅ **No Breaking Changes**: Backward compatible
✅ **Database Efficient**: Minimal queries, no N+1
✅ **Production Ready**: Compiled and tested

