-- Check PetAdTypes structure and data
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'PetAdTypes'
ORDER BY ordinal_position;

-- Check current ad types
SELECT * FROM "PetAdTypes" ORDER BY "Id";
