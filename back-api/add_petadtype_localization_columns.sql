-- Add missing Title and Description columns to PetAdTypeLocalizations table

BEGIN;

-- Add Title column (copy from Name if exists)
ALTER TABLE "PetAdTypeLocalizations" 
ADD COLUMN "Title" VARCHAR(100);

-- Copy data from Name to Title
UPDATE "PetAdTypeLocalizations" 
SET "Title" = "Name" 
WHERE "Name" IS NOT NULL;

-- Make Title NOT NULL after copying data
ALTER TABLE "PetAdTypeLocalizations" 
ALTER COLUMN "Title" SET NOT NULL;

-- Add Description column (nullable)
ALTER TABLE "PetAdTypeLocalizations" 
ADD COLUMN "Description" VARCHAR(500);

-- Verify changes
SELECT column_name, data_type, character_maximum_length, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'PetAdTypeLocalizations' 
ORDER BY ordinal_position;

COMMIT;
