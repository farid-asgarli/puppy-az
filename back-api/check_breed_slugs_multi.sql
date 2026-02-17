-- Check breeds with multiple locales (en, ru)
SELECT pbl."PetBreedId", pbl."Slug", pbl."Title", al."Code" as locale
FROM "PetBreedLocalizations" pbl
JOIN "AppLocales" al ON pbl."AppLocaleId" = al."Id"
WHERE pbl."PetBreedId" IN (
    SELECT "PetBreedId" FROM "PetBreedLocalizations" GROUP BY "PetBreedId" HAVING COUNT(*) > 1
)
ORDER BY pbl."PetBreedId", al."Code"
LIMIT 30;
