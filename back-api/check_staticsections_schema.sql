-- Check StaticSections table schema
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'StaticSections'
ORDER BY ordinal_position;
