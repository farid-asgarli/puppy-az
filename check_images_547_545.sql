SELECT "Id", "PetAdId", "FilePath", "FileName", "IsPrimary"
FROM "PetAdImages"
WHERE "PetAdId" IN (547, 545)
ORDER BY "PetAdId" DESC, "Id";
