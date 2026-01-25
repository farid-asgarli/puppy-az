-- Update Russian localizations for Pet Categories (fix encoding)
BEGIN;

UPDATE "PetCategoryLocalizations" pcl
SET "Title" = CASE pcl."PetCategoryId"
    WHEN 1 THEN 'Собаки'
    WHEN 2 THEN 'Кошки'
    WHEN 3 THEN 'Птицы'
    WHEN 4 THEN 'Рыбы'
    WHEN 5 THEN 'Рептилии'
    WHEN 6 THEN 'Насекомые'
    WHEN 7 THEN 'Сельскохозяйственные животные'
    WHEN 8 THEN 'Грызуны'
    WHEN 9 THEN 'Дикие животные'
    WHEN 10 THEN 'Другие'
    ELSE pcl."Title"
END
FROM "AppLocales" al
WHERE pcl."AppLocaleId" = al."Id"
AND al."Code" = 'ru';

COMMIT;
