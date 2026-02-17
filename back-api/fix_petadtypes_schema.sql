-- Fix PetAdTypes table schema
-- Add missing columns from PetAdTypeEntity

-- Add missing columns
ALTER TABLE "PetAdTypes" ADD COLUMN IF NOT EXISTS "Key" varchar(50) NOT NULL DEFAULT '';
ALTER TABLE "PetAdTypes" ADD COLUMN IF NOT EXISTS "Emoji" varchar(10) NOT NULL DEFAULT '';
ALTER TABLE "PetAdTypes" ADD COLUMN IF NOT EXISTS "IconName" varchar(100);
ALTER TABLE "PetAdTypes" ADD COLUMN IF NOT EXISTS "BackgroundColor" varchar(50) NOT NULL DEFAULT '';
ALTER TABLE "PetAdTypes" ADD COLUMN IF NOT EXISTS "DisplayOrder" integer NOT NULL DEFAULT 0;
ALTER TABLE "PetAdTypes" ADD COLUMN IF NOT EXISTS "IsActive" boolean NOT NULL DEFAULT true;
ALTER TABLE "PetAdTypes" ADD COLUMN IF NOT EXISTS "IsDeleted" boolean NOT NULL DEFAULT false;
ALTER TABLE "PetAdTypes" ADD COLUMN IF NOT EXISTS "DeletedAt" timestamp;
ALTER TABLE "PetAdTypes" ADD COLUMN IF NOT EXISTS "DeletedBy" uuid;
ALTER TABLE "PetAdTypes" ADD COLUMN IF NOT EXISTS "UpdatedAt" timestamp;
ALTER TABLE "PetAdTypes" ADD COLUMN IF NOT EXISTS "UpdatedBy" uuid;
ALTER TABLE "PetAdTypes" ADD COLUMN IF NOT EXISTS "CreatedBy" uuid;

-- Drop old Name column if exists
ALTER TABLE "PetAdTypes" DROP COLUMN IF EXISTS "Name";

-- Create indexes
CREATE INDEX IF NOT EXISTS "IX_PetAdTypes_Key" ON "PetAdTypes" ("Key");
CREATE INDEX IF NOT EXISTS "IX_PetAdTypes_IsActive" ON "PetAdTypes" ("IsActive");
CREATE INDEX IF NOT EXISTS "IX_PetAdTypes_IsDeleted" ON "PetAdTypes" ("IsDeleted");

SELECT 'PetAdTypes schema updated successfully!' as result;
