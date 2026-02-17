SELECT pc."Id", pcl."Title", pc."IconColor"
FROM "PetCategories" pc
JOIN "PetCategoryLocalizations" pcl ON pcl."PetCategoryId" = pc."Id"
JOIN "AppLocales" al ON al."Id" = pcl."AppLocaleId"
WHERE al."Code" = 'az'
ORDER BY pc."Id";
