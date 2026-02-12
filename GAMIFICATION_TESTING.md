# Gamification System - Testing Guide

## Manual Testing with Curl

### Prerequisites
```bash
# 1. Start backend
cd backend
npm run start:dev

# 2. Get JWT token (login or signup)
# Save token as environment variable
export TOKEN="your-jwt-token-here"
```

---

## Test Scenarios

### Scenario 1: Check User Progress (New Endpoint)

```bash
# Get current user progress
curl -X GET http://localhost:3000/users/me/progress \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "currentXP": 0,
  "currentLevel": "BEGINNER",
  "nextLevel": "INTERMEDIATE",
  "nextLevelXP": 1000,
  "progressPercentage": 0,
  "xpToNextLevel": 1000
}
```

---

### Scenario 2: Complete First Conversation (Streak = 1)

```bash
# 1. Create conversation
curl -X POST http://localhost:3000/conversations \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "topicId": "your-topic-id-here"
  }'

# Save conversationId from response

# 2. Send a message (simulate conversation)
curl -X POST http://localhost:3000/conversations/{conversationId}/message \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Hello, I am learning English"
  }'

# 3. Complete conversation
curl -X POST http://localhost:3000/conversations/{conversationId}/complete \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "conversationId": "uuid-123",
  "status": "COMPLETED",
  "score": 75,
  "xpEarned": 80,
  "feedback": {
    "grammarScore": 75,
    "vocabularyScore": 70,
    "fluencyScore": 80,
    "overallScore": 75,
    "grammarErrors": [...],
    "suggestions": [...],
    "strengths": [...]
  },
  "streak": {
    "current": 1,
    "previous": 0,
    "continued": false,
    "broken": false
  },
  "levelUp": {
    "leveledUp": false,
    "previousLevel": "BEGINNER"
  }
}
```

---

### Scenario 3: Complete Multiple Conversations (Same Day)

```bash
# Complete 2nd conversation on same day
curl -X POST http://localhost:3000/conversations/{conversationId2}/complete \
  -H "Authorization: Bearer $TOKEN"

# Complete 3rd conversation on same day
curl -X POST http://localhost:3000/conversations/{conversationId3}/complete \
  -H "Authorization: Bearer $TOKEN"
```

**Expected streak in responses:**
```json
{
  "streak": {
    "current": 1,
    "previous": 1,
    "continued": false,
    "broken": false
  }
}
```

**Note:** Streak stays at 1 (same day = no change)

---

### Scenario 4: Continue Streak (Next Day)

```bash
# Wait until next day (or manually update user.lastActiveAt in DB)

# Complete conversation
curl -X POST http://localhost:3000/conversations/{conversationId}/complete \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
```json
{
  "streak": {
    "current": 2,
    "previous": 1,
    "continued": true,
    "broken": false
  }
}
```

---

### Scenario 5: Break Streak (Skip Days)

```bash
# Manually update user.lastActiveAt to 3 days ago in database:
# UPDATE users SET last_active_at = NOW() - INTERVAL '3 days' WHERE id = 'user-id';

# Then complete conversation
curl -X POST http://localhost:3000/conversations/{conversationId}/complete \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
```json
{
  "streak": {
    "current": 1,
    "previous": 5,
    "continued": false,
    "broken": true
  }
}
```

---

### Scenario 6: Level Up (BEGINNER → INTERMEDIATE)

```bash
# Manually set user XP to 950 (close to 1000 threshold)
# UPDATE users SET xp = 950 WHERE id = 'user-id';

# Complete high-score conversation (will earn 50+ XP)
curl -X POST http://localhost:3000/conversations/{conversationId}/complete \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
```json
{
  "xpEarned": 60,
  "levelUp": {
    "leveledUp": true,
    "newLevel": "INTERMEDIATE",
    "previousLevel": "BEGINNER"
  }
}
```

**Then check progress:**
```bash
curl -X GET http://localhost:3000/users/me/progress \
  -H "Authorization: Bearer $TOKEN"
```

**Expected:**
```json
{
  "currentXP": 1010,
  "currentLevel": "INTERMEDIATE",
  "nextLevel": "ADVANCED",
  "nextLevelXP": 5000,
  "progressPercentage": 0,
  "xpToNextLevel": 3990
}
```

---

### Scenario 7: Progress at Different Levels

#### User at 1500 XP (INTERMEDIATE)
```bash
# Set XP manually: UPDATE users SET xp = 1500, level = 'INTERMEDIATE'

curl -X GET http://localhost:3000/users/me/progress \
  -H "Authorization: Bearer $TOKEN"
```

**Expected:**
```json
{
  "currentXP": 1500,
  "currentLevel": "INTERMEDIATE",
  "nextLevel": "ADVANCED",
  "nextLevelXP": 5000,
  "progressPercentage": 12,
  "xpToNextLevel": 3500
}
```

**Calculation:**
- XP in current level: 1500 - 1000 = 500
- XP needed for next: 5000 - 1000 = 4000
- Progress: (500 / 4000) * 100 = 12.5% → 12%

---

#### User at 18000 XP (FLUENT - Max Level)
```bash
# Set XP manually: UPDATE users SET xp = 18000, level = 'FLUENT'

curl -X GET http://localhost:3000/users/me/progress \
  -H "Authorization: Bearer $TOKEN"
```

**Expected:**
```json
{
  "currentXP": 18000,
  "currentLevel": "FLUENT",
  "nextLevel": null,
  "nextLevelXP": null,
  "progressPercentage": 100,
  "xpToNextLevel": null
}
```

---

## Database Manual Testing

### View User Data
```sql
-- Check user gamification fields
SELECT
  id,
  name,
  email,
  level,
  xp,
  streak,
  last_active_at,
  created_at
FROM users
WHERE email = 'your-email@example.com';
```

### Simulate Scenarios

#### Reset User for Testing
```sql
UPDATE users
SET
  xp = 0,
  level = 'BEGINNER',
  streak = 0,
  last_active_at = NULL
WHERE id = 'user-id';
```

#### Set User Close to Level Up
```sql
UPDATE users
SET
  xp = 980,
  level = 'BEGINNER'
WHERE id = 'user-id';
```

#### Set User to Yesterday (Test Streak Continue)
```sql
UPDATE users
SET
  last_active_at = CURRENT_TIMESTAMP - INTERVAL '1 day',
  streak = 3
WHERE id = 'user-id';
```

#### Set User to 3 Days Ago (Test Streak Break)
```sql
UPDATE users
SET
  last_active_at = CURRENT_TIMESTAMP - INTERVAL '3 days',
  streak = 7
WHERE id = 'user-id';
```

---

## Automated Test Script

Create a file `test-gamification.sh`:

```bash
#!/bin/bash

# Configuration
API_URL="http://localhost:3000"
TOKEN="your-jwt-token-here"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Gamification System Tests ===${NC}\n"

# Test 1: Get Progress
echo -e "${YELLOW}Test 1: GET /users/me/progress${NC}"
curl -s -X GET "$API_URL/users/me/progress" \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.'
echo -e "\n"

# Test 2: Get User Stats
echo -e "${YELLOW}Test 2: GET /users/me/stats${NC}"
curl -s -X GET "$API_URL/users/me/stats" \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.'
echo -e "\n"

# Test 3: Create and Complete Conversation
echo -e "${YELLOW}Test 3: Create and Complete Conversation${NC}"

# Get first topic
TOPIC_ID=$(curl -s -X GET "$API_URL/topics" \
  -H "Authorization: Bearer $TOKEN" \
  | jq -r '.[0].id')

echo "Using topic: $TOPIC_ID"

# Create conversation
CONV_ID=$(curl -s -X POST "$API_URL/conversations" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"topicId\": \"$TOPIC_ID\"}" \
  | jq -r '.id')

echo "Created conversation: $CONV_ID"

# Send message
curl -s -X POST "$API_URL/conversations/$CONV_ID/message" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content": "Hello, I am testing the gamification system"}' \
  | jq '.'

# Complete conversation
echo -e "\n${YELLOW}Completing conversation...${NC}"
curl -s -X POST "$API_URL/conversations/$CONV_ID/complete" \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.'

echo -e "\n"

# Test 4: Check progress again
echo -e "${YELLOW}Test 4: GET /users/me/progress (after completion)${NC}"
curl -s -X GET "$API_URL/users/me/progress" \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.'

echo -e "\n${GREEN}Tests completed!${NC}"
```

**Run:**
```bash
chmod +x test-gamification.sh
./test-gamification.sh
```

---

## Unit Test Examples

### StreakService Tests

```typescript
// backend/src/modules/user/streak.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { StreakService } from './streak.service';
import { PrismaService } from '../../infrastructure/database/prisma.service';

describe('StreakService', () => {
  let service: StreakService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StreakService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<StreakService>(StreakService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('updateStreak', () => {
    it('should initialize streak to 1 for first activity', async () => {
      const userId = 'test-user-id';
      const mockUser = {
        id: userId,
        streak: 0,
        lastActiveAt: null,
      };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser);
      jest.spyOn(prisma.user, 'update').mockResolvedValue({
        ...mockUser,
        streak: 1,
        lastActiveAt: new Date(),
      });

      const result = await service.updateStreak(userId);

      expect(result.currentStreak).toBe(1);
      expect(result.isFirstActivity).toBe(true);
    });

    it('should increment streak for consecutive day', async () => {
      const userId = 'test-user-id';
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const mockUser = {
        id: userId,
        streak: 5,
        lastActiveAt: yesterday,
      };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser);
      jest.spyOn(prisma.user, 'update').mockResolvedValue({
        ...mockUser,
        streak: 6,
        lastActiveAt: new Date(),
      });

      const result = await service.updateStreak(userId);

      expect(result.currentStreak).toBe(6);
      expect(result.previousStreak).toBe(5);
      expect(result.streakContinued).toBe(true);
    });

    it('should reset streak after gap >1 day', async () => {
      const userId = 'test-user-id';
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      const mockUser = {
        id: userId,
        streak: 10,
        lastActiveAt: threeDaysAgo,
      };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser);
      jest.spyOn(prisma.user, 'update').mockResolvedValue({
        ...mockUser,
        streak: 1,
        lastActiveAt: new Date(),
      });

      const result = await service.updateStreak(userId);

      expect(result.currentStreak).toBe(1);
      expect(result.previousStreak).toBe(10);
      expect(result.streakBroken).toBe(true);
    });

    it('should not change streak for same day activity', async () => {
      const userId = 'test-user-id';
      const today = new Date();

      const mockUser = {
        id: userId,
        streak: 7,
        lastActiveAt: today,
      };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser);

      const result = await service.updateStreak(userId);

      expect(result.currentStreak).toBe(7);
      expect(result.previousStreak).toBe(7);
      expect(result.streakContinued).toBe(false);
      expect(result.streakBroken).toBe(false);
    });
  });
});
```

### UserService Level Tests

```typescript
// backend/src/modules/user/user.service.spec.ts
describe('UserService - Gamification', () => {
  describe('checkLevelUp', () => {
    it('should level up user from BEGINNER to INTERMEDIATE', async () => {
      const userId = 'test-user-id';
      const mockUser = {
        id: userId,
        xp: 1050,
        level: UserLevel.BEGINNER,
      };

      jest.spyOn(service, 'getUserById').mockResolvedValue(mockUser);
      jest.spyOn(prisma.user, 'update').mockResolvedValue({
        ...mockUser,
        level: UserLevel.INTERMEDIATE,
      });

      const result = await service.checkLevelUp(userId);

      expect(result.leveledUp).toBe(true);
      expect(result.newLevel).toBe(UserLevel.INTERMEDIATE);
      expect(result.previousLevel).toBe(UserLevel.BEGINNER);
    });

    it('should not level up if XP below threshold', async () => {
      const userId = 'test-user-id';
      const mockUser = {
        id: userId,
        xp: 500,
        level: UserLevel.BEGINNER,
      };

      jest.spyOn(service, 'getUserById').mockResolvedValue(mockUser);

      const result = await service.checkLevelUp(userId);

      expect(result.leveledUp).toBe(false);
      expect(result.newLevel).toBe(null);
    });
  });

  describe('getUserProgress', () => {
    it('should calculate progress correctly', async () => {
      const userId = 'test-user-id';
      const mockUser = {
        id: userId,
        xp: 1500,
        level: UserLevel.INTERMEDIATE,
      };

      jest.spyOn(service, 'getUserById').mockResolvedValue(mockUser);

      const result = await service.getUserProgress(userId);

      expect(result.currentXP).toBe(1500);
      expect(result.currentLevel).toBe(UserLevel.INTERMEDIATE);
      expect(result.nextLevel).toBe(UserLevel.ADVANCED);
      expect(result.nextLevelXP).toBe(5000);
      expect(result.progressPercentage).toBe(12); // (500/4000)*100
      expect(result.xpToNextLevel).toBe(3500);
    });

    it('should handle max level (FLUENT)', async () => {
      const userId = 'test-user-id';
      const mockUser = {
        id: userId,
        xp: 20000,
        level: UserLevel.FLUENT,
      };

      jest.spyOn(service, 'getUserById').mockResolvedValue(mockUser);

      const result = await service.getUserProgress(userId);

      expect(result.currentLevel).toBe(UserLevel.FLUENT);
      expect(result.nextLevel).toBe(null);
      expect(result.progressPercentage).toBe(100);
    });
  });
});
```

---

## Integration Test Example

```typescript
// backend/test/gamification.e2e-spec.ts
describe('Gamification (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    // Setup test app
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Login and get token
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'test123' });

    authToken = response.body.accessToken;
  });

  it('/users/me/progress (GET)', () => {
    return request(app.getHttpServer())
      .get('/users/me/progress')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('currentXP');
        expect(res.body).toHaveProperty('currentLevel');
        expect(res.body).toHaveProperty('progressPercentage');
      });
  });

  it('should update streak and level on conversation completion', async () => {
    // Create conversation
    const convResponse = await request(app.getHttpServer())
      .post('/conversations')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ topicId: 'test-topic-id' })
      .expect(201);

    const conversationId = convResponse.body.id;

    // Complete conversation
    const completeResponse = await request(app.getHttpServer())
      .post(`/conversations/${conversationId}/complete`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(completeResponse.body).toHaveProperty('streak');
    expect(completeResponse.body).toHaveProperty('levelUp');
    expect(completeResponse.body.streak.current).toBeGreaterThanOrEqual(1);
  });
});
```

---

## Expected Logs

When running tests, you should see logs like:

```
[UserService] User abc123 leveled up: BEGINNER → INTERMEDIATE (XP: 1050)
[StreakService] User abc123: Consecutive day activity, streak 7 → 8
[ConversationService] User abc123 streak updated: 7 → 8
[ConversationService] Conversation xyz789 completed. XP earned: 120
```

---

## Checklist

### Manual Testing
- [ ] Test GET /users/me/progress (new endpoint)
- [ ] Test first conversation completion (streak = 1)
- [ ] Test multiple conversations same day (streak unchanged)
- [ ] Test consecutive day (streak increments)
- [ ] Test gap >1 day (streak resets)
- [ ] Test level up from BEGINNER to INTERMEDIATE
- [ ] Test progress calculation at different XP levels
- [ ] Test max level (FLUENT) shows 100% progress

### Unit Testing
- [ ] Write tests for StreakService.updateStreak()
- [ ] Write tests for UserService.checkLevelUp()
- [ ] Write tests for UserService.getUserProgress()
- [ ] Test edge cases (null dates, max level, etc)

### Integration Testing
- [ ] Test full conversation flow with gamification
- [ ] Test error handling (invalid user, conversation not found)
- [ ] Test concurrent requests (race conditions)

---

**Testing Status**: ✅ Manual testing guide complete, ready for automated tests

