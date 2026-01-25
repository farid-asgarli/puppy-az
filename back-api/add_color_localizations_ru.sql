-- Rənglərin RU lokallaşdırmasını əlavə et
BEGIN;

-- Rənglərin rus dilində tərcümələrini əlavə et
-- Əgər RU lokallaşdırma yoxdursa, əlavə et

INSERT INTO "PetColorLocalizations" ("Title", "PetColorId", "AppLocaleId")
SELECT 'Чёрный', pc."Id", al."Id"
FROM "PetColors" pc
CROSS JOIN "AppLocales" al
LEFT JOIN "PetColorLocalizations" existing ON existing."PetColorId" = pc."Id" AND existing."AppLocaleId" = al."Id"
WHERE pc."Key" = 'black' AND al."Code" = 'ru' AND existing."Id" IS NULL;

INSERT INTO "PetColorLocalizations" ("Title", "PetColorId", "AppLocaleId")
SELECT 'Белый', pc."Id", al."Id"
FROM "PetColors" pc
CROSS JOIN "AppLocales" al
LEFT JOIN "PetColorLocalizations" existing ON existing."PetColorId" = pc."Id" AND existing."AppLocaleId" = al."Id"
WHERE pc."Key" = 'white' AND al."Code" = 'ru' AND existing."Id" IS NULL;

INSERT INTO "PetColorLocalizations" ("Title", "PetColorId", "AppLocaleId")
SELECT 'Коричневый', pc."Id", al."Id"
FROM "PetColors" pc
CROSS JOIN "AppLocales" al
LEFT JOIN "PetColorLocalizations" existing ON existing."PetColorId" = pc."Id" AND existing."AppLocaleId" = al."Id"
WHERE pc."Key" = 'brown' AND al."Code" = 'ru' AND existing."Id" IS NULL;

INSERT INTO "PetColorLocalizations" ("Title", "PetColorId", "AppLocaleId")
SELECT 'Серый', pc."Id", al."Id"
FROM "PetColors" pc
CROSS JOIN "AppLocales" al
LEFT JOIN "PetColorLocalizations" existing ON existing."PetColorId" = pc."Id" AND existing."AppLocaleId" = al."Id"
WHERE pc."Key" = 'gray' AND al."Code" = 'ru' AND existing."Id" IS NULL;

INSERT INTO "PetColorLocalizations" ("Title", "PetColorId", "AppLocaleId")
SELECT 'Золотистый', pc."Id", al."Id"
FROM "PetColors" pc
CROSS JOIN "AppLocales" al
LEFT JOIN "PetColorLocalizations" existing ON existing."PetColorId" = pc."Id" AND existing."AppLocaleId" = al."Id"
WHERE pc."Key" = 'golden' AND al."Code" = 'ru' AND existing."Id" IS NULL;

INSERT INTO "PetColorLocalizations" ("Title", "PetColorId", "AppLocaleId")
SELECT 'Кремовый', pc."Id", al."Id"
FROM "PetColors" pc
CROSS JOIN "AppLocales" al
LEFT JOIN "PetColorLocalizations" existing ON existing."PetColorId" = pc."Id" AND existing."AppLocaleId" = al."Id"
WHERE pc."Key" = 'cream' AND al."Code" = 'ru' AND existing."Id" IS NULL;

INSERT INTO "PetColorLocalizations" ("Title", "PetColorId", "AppLocaleId")
SELECT 'Рыжий', pc."Id", al."Id"
FROM "PetColors" pc
CROSS JOIN "AppLocales" al
LEFT JOIN "PetColorLocalizations" existing ON existing."PetColorId" = pc."Id" AND existing."AppLocaleId" = al."Id"
WHERE pc."Key" = 'ginger' AND al."Code" = 'ru' AND existing."Id" IS NULL;

INSERT INTO "PetColorLocalizations" ("Title", "PetColorId", "AppLocaleId")
SELECT 'Оранжевый', pc."Id", al."Id"
FROM "PetColors" pc
CROSS JOIN "AppLocales" al
LEFT JOIN "PetColorLocalizations" existing ON existing."PetColorId" = pc."Id" AND existing."AppLocaleId" = al."Id"
WHERE pc."Key" = 'orange' AND al."Code" = 'ru' AND existing."Id" IS NULL;

INSERT INTO "PetColorLocalizations" ("Title", "PetColorId", "AppLocaleId")
SELECT 'Трёхцветный', pc."Id", al."Id"
FROM "PetColors" pc
CROSS JOIN "AppLocales" al
LEFT JOIN "PetColorLocalizations" existing ON existing."PetColorId" = pc."Id" AND existing."AppLocaleId" = al."Id"
WHERE pc."Key" = 'tricolor' AND al."Code" = 'ru' AND existing."Id" IS NULL;

INSERT INTO "PetColorLocalizations" ("Title", "PetColorId", "AppLocaleId")
SELECT 'Пятнистый', pc."Id", al."Id"
FROM "PetColors" pc
CROSS JOIN "AppLocales" al
LEFT JOIN "PetColorLocalizations" existing ON existing."PetColorId" = pc."Id" AND existing."AppLocaleId" = al."Id"
WHERE pc."Key" = 'spotted' AND al."Code" = 'ru' AND existing."Id" IS NULL;

INSERT INTO "PetColorLocalizations" ("Title", "PetColorId", "AppLocaleId")
SELECT 'Полосатый', pc."Id", al."Id"
FROM "PetColors" pc
CROSS JOIN "AppLocales" al
LEFT JOIN "PetColorLocalizations" existing ON existing."PetColorId" = pc."Id" AND existing."AppLocaleId" = al."Id"
WHERE pc."Key" = 'striped' AND al."Code" = 'ru' AND existing."Id" IS NULL;

INSERT INTO "PetColorLocalizations" ("Title", "PetColorId", "AppLocaleId")
SELECT 'Мраморный', pc."Id", al."Id"
FROM "PetColors" pc
CROSS JOIN "AppLocales" al
LEFT JOIN "PetColorLocalizations" existing ON existing."PetColorId" = pc."Id" AND existing."AppLocaleId" = al."Id"
WHERE pc."Key" = 'marble' AND al."Code" = 'ru' AND existing."Id" IS NULL;

INSERT INTO "PetColorLocalizations" ("Title", "PetColorId", "AppLocaleId")
SELECT 'Тигровый', pc."Id", al."Id"
FROM "PetColors" pc
CROSS JOIN "AppLocales" al
LEFT JOIN "PetColorLocalizations" existing ON existing."PetColorId" = pc."Id" AND existing."AppLocaleId" = al."Id"
WHERE pc."Key" = 'brindle' AND al."Code" = 'ru' AND existing."Id" IS NULL;

INSERT INTO "PetColorLocalizations" ("Title", "PetColorId", "AppLocaleId")
SELECT 'Соболиный', pc."Id", al."Id"
FROM "PetColors" pc
CROSS JOIN "AppLocales" al
LEFT JOIN "PetColorLocalizations" existing ON existing."PetColorId" = pc."Id" AND existing."AppLocaleId" = al."Id"
WHERE pc."Key" = 'sable' AND al."Code" = 'ru' AND existing."Id" IS NULL;

INSERT INTO "PetColorLocalizations" ("Title", "PetColorId", "AppLocaleId")
SELECT 'Синий', pc."Id", al."Id"
FROM "PetColors" pc
CROSS JOIN "AppLocales" al
LEFT JOIN "PetColorLocalizations" existing ON existing."PetColorId" = pc."Id" AND existing."AppLocaleId" = al."Id"
WHERE pc."Key" = 'blue' AND al."Code" = 'ru' AND existing."Id" IS NULL;

INSERT INTO "PetColorLocalizations" ("Title", "PetColorId", "AppLocaleId")
SELECT 'Красный', pc."Id", al."Id"
FROM "PetColors" pc
CROSS JOIN "AppLocales" al
LEFT JOIN "PetColorLocalizations" existing ON existing."PetColorId" = pc."Id" AND existing."AppLocaleId" = al."Id"
WHERE pc."Key" = 'red' AND al."Code" = 'ru' AND existing."Id" IS NULL;

COMMIT;
