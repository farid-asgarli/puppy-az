-- Fix Russian localizations for Sheep breeds
UPDATE "PetBreedLocalizations" SET "Title" = 'Овца' WHERE "PetBreedId" = 124 AND "AppLocaleId" = 3;
UPDATE "PetBreedLocalizations" SET "Title" = 'Мериносовая овца' WHERE "PetBreedId" = 132 AND "AppLocaleId" = 3;

-- Verify
SELECT pb."Id", pbl."Title", al."Code" 
FROM "PetBreeds" pb 
JOIN "PetBreedLocalizations" pbl ON pb."Id" = pbl."PetBreedId" 
JOIN "AppLocales" al ON pbl."AppLocaleId" = al."Id" 
WHERE pb."Id" IN (124, 132) 
ORDER BY pb."Id", al."Code";
