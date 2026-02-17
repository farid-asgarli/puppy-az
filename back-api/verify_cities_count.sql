-- Count total and active cities
SELECT 
    COUNT(*) as total_cities, 
    COUNT(CASE WHEN "IsDeleted" = false THEN 1 END) as active_cities 
FROM "Cities";

-- Show first 10 active cities with all languages
SELECT "Id", "NameAz", "NameEn", "NameRu" 
FROM "Cities" 
WHERE NOT "IsDeleted"
ORDER BY "Id" 
LIMIT 10;
