-- Add missing audit columns to StaticSections table
ALTER TABLE "StaticSections"
ADD COLUMN IF NOT EXISTS "CreatedBy" UUID,
ADD COLUMN IF NOT EXISTS "UpdatedBy" UUID,
ADD COLUMN IF NOT EXISTS "DeletedAt" TIMESTAMP,
ADD COLUMN IF NOT EXISTS "DeletedBy" UUID,
ADD COLUMN IF NOT EXISTS "IsDeleted" BOOLEAN NOT NULL DEFAULT FALSE;

-- Verify the changes
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'StaticSections'
ORDER BY ordinal_position;
