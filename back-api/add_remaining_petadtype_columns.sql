-- Add remaining missing columns to PetAdTypes

ALTER TABLE "PetAdTypes" ADD COLUMN IF NOT EXISTS "BorderColor" varchar(50) NOT NULL DEFAULT '';
ALTER TABLE "PetAdTypes" ADD COLUMN IF NOT EXISTS "SortOrder" integer NOT NULL DEFAULT 0;

-- Create missing indexes
CREATE UNIQUE INDEX IF NOT EXISTS "IX_PetAdTypes_Key_Unique" ON "PetAdTypes" ("Key");
CREATE INDEX IF NOT EXISTS "IX_PetAdTypes_SortOrder" ON "PetAdTypes" ("SortOrder");

SELECT 'All PetAdTypes columns added successfully!' as result;
