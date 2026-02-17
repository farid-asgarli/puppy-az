-- Check current categories with icons and colors
SELECT 
    pc."Id",
    pcl."Title",
    pc."IconColor",
    pc."BackgroundColor",
    LEFT(pc."SvgIcon", 100) as "IconPreview"
FROM "PetCategories" pc
JOIN "PetCategoryLocalizations" pcl ON pc."Id" = pcl."PetCategoryId"
JOIN "AppLocales" al ON pcl."AppLocaleId" = al."Id"
WHERE al."Code" = 'az' AND pc."IsActive" = true
ORDER BY pc."Id";
