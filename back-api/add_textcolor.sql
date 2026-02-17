ALTER TABLE "PetAdTypes" ADD COLUMN IF NOT EXISTS "TextColor" varchar(50) NOT NULL DEFAULT '';
SELECT 'TextColor column added successfully!' as result;
