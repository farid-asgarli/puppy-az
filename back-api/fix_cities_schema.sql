-- Fix Cities table schema to match new requirements
-- Old backup has: Name column
-- New code expects: NameAz, NameEn, NameRu columns

-- Add new columns
ALTER TABLE "Cities" ADD COLUMN IF NOT EXISTS "NameAz" varchar(100);
ALTER TABLE "Cities" ADD COLUMN IF NOT EXISTS "NameEn" varchar(100);
ALTER TABLE "Cities" ADD COLUMN IF NOT EXISTS "NameRu" varchar(100);
ALTER TABLE "Cities" ADD COLUMN IF NOT EXISTS "DisplayOrder" integer DEFAULT 0;
ALTER TABLE "Cities" ADD COLUMN IF NOT EXISTS "IsMajorCity" boolean DEFAULT false;

-- Copy existing Name data to NameAz (Azerbaijani)
UPDATE "Cities" SET "NameAz" = "Name" WHERE "NameAz" IS NULL;

-- Set default values for English and Russian names (same as Azerbaijani for now)
UPDATE "Cities" SET "NameEn" = "Name" WHERE "NameEn" IS NULL;
UPDATE "Cities" SET "NameRu" = "Name" WHERE "NameRu" IS NULL;

-- Make columns NOT NULL after populating data
ALTER TABLE "Cities" ALTER COLUMN "NameAz" SET NOT NULL;
ALTER TABLE "Cities" ALTER COLUMN "NameEn" SET NOT NULL;
ALTER TABLE "Cities" ALTER COLUMN "NameRu" SET NOT NULL;

-- Drop old Name column
ALTER TABLE "Cities" DROP COLUMN IF EXISTS "Name";

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS "IX_Cities_NameAz" ON "Cities" ("NameAz");
CREATE INDEX IF NOT EXISTS "IX_Cities_IsActive" ON "Cities" ("IsActive");
CREATE INDEX IF NOT EXISTS "IX_Cities_IsDeleted" ON "Cities" ("IsDeleted");

SELECT 'Cities schema updated successfully!' as result;
