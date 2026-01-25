-- Delete and re-add Russian localizations for Pet Colors
BEGIN;

-- Delete existing Russian color localizations  
DELETE FROM "PetColorLocalizations"
WHERE "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

-- Re-add Russian localizations with proper translations
INSERT INTO "PetColorLocalizations" ("PetColorId", "AppLocaleId", "Title")
SELECT pc."Id",
       (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru'),
       CASE pc."Id"
           WHEN 1 THEN 'Чёрный'
           WHEN 2 THEN 'Белый'
           WHEN 3 THEN 'Коричневый'
           WHEN 4 THEN 'Золотой'
           WHEN 5 THEN 'Кремовый'
           WHEN 6 THEN 'Серый'
           WHEN 7 THEN 'Рыжий'
           WHEN 8 THEN 'Пятнистый'
           WHEN 9 THEN 'Полосатый'
           WHEN 10 THEN 'Тигровый'
           WHEN 11 THEN 'Трёхцветный'
           WHEN 12 THEN 'Мраморный'
           WHEN 13 THEN 'Соболиный'
           WHEN 14 THEN 'Голубой'
           WHEN 15 THEN 'Лиловый'
           WHEN 16 THEN 'Шоколадный'
           ELSE pcl."Title"
       END
FROM "PetColors" pc
JOIN "PetColorLocalizations" pcl ON pc."Id" = pcl."PetColorId"
JOIN "AppLocales" al ON pcl."AppLocaleId" = al."Id"
WHERE al."Code" = 'az';

COMMIT;
