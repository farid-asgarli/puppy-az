-- Check PetCategories table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'PetCategories'
ORDER BY ordinal_position;

-- Check current categories
SELECT * FROM "PetCategories" ORDER BY "Id";
