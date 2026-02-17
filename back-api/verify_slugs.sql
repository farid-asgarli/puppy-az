SELECT pc."Id", pcl."Title", pcl."Slug", al."Code" as locale
FROM "PetCategories" pc
JOIN "PetCategoryLocalizations" pcl ON pc."Id" = pcl."PetCategoryId"
JOIN "AppLocales" al ON pcl."AppLocaleId" = al."Id"
WHERE pc."IsDeleted" = false
ORDER BY pc."Id", al."Code";
