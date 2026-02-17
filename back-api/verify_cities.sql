-- Verify Cities table schema
SELECT "Id", "NameAz", "NameEn", "NameRu", "IsMajorCity", "DisplayOrder"
FROM "Cities" 
ORDER BY "Id"
LIMIT 10;
