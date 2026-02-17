SELECT pbl."Slug", pbl."Title", al."Code" as locale
FROM "PetBreedLocalizations" pbl
JOIN "AppLocales" al ON pbl."AppLocaleId" = al."Id"
ORDER BY pbl."PetBreedId", al."Code"
LIMIT 30;
