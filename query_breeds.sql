SELECT pb."Id", pb."PetCategoryId", pbl."Title", al."Code" as locale
FROM "PetBreeds" pb
JOIN "PetBreedLocalizations" pbl ON pb."Id" = pbl."PetBreedId"
JOIN "AppLocales" al ON pbl."AppLocaleId" = al."Id"
WHERE pb."IsDeleted" = false AND pb."PetCategoryId" = 1
ORDER BY pb."Id", al."Code"
LIMIT 30;
