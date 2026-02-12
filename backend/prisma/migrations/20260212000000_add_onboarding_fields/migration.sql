-- Add onboarding fields to users table
ALTER TABLE "users"
  ADD COLUMN "goal" TEXT,
  ADD COLUMN "onboarding_completed" BOOLEAN NOT NULL DEFAULT false;

-- Add comment
COMMENT ON COLUMN "users"."goal" IS 'User learning goal: travel, work, study, general';
COMMENT ON COLUMN "users"."onboarding_completed" IS 'Whether user has completed the onboarding flow';
