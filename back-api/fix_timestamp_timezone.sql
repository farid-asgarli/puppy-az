-- Convert CreatedAt column to timestamp with timezone
ALTER TABLE "PetAdQuestionReplies" 
ALTER COLUMN "CreatedAt" TYPE timestamptz USING "CreatedAt" AT TIME ZONE 'UTC';

-- Also update other timestamp columns
ALTER TABLE "PetAdQuestionReplies" 
ALTER COLUMN "UpdatedAt" TYPE timestamptz USING "UpdatedAt" AT TIME ZONE 'UTC';

ALTER TABLE "PetAdQuestionReplies" 
ALTER COLUMN "DeletedAt" TYPE timestamptz USING "DeletedAt" AT TIME ZONE 'UTC';
