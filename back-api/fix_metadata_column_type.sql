-- Change Metadata column from JSONB to TEXT
ALTER TABLE "StaticSectionLocalizations"
ALTER COLUMN "Metadata" TYPE TEXT USING "Metadata"::TEXT;

-- Verify the change
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'StaticSectionLocalizations' 
  AND column_name = 'Metadata';
