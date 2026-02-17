-- Verify cities encoding
SELECT "Id", "NameAz", "NameEn", "NameRu", 
       LENGTH("NameAz") as az_length,
       LENGTH("NameEn") as en_length,
       LENGTH("NameRu") as ru_length
FROM "Cities" 
WHERE "Id" IN (1, 2, 3, 4, 5, 6, 7, 8)
ORDER BY "Id";
