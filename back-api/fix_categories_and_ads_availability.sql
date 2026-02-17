-- Fix categories and ads

BEGIN;

-- Step 1: Deactivate all existing categories
UPDATE "PetCategories" SET "IsActive" = false;

-- Step 2: Delete existing category localizations to avoid conflicts
DELETE FROM "PetCategoryLocalizations";

-- Step 3: Create/Update the 10 required categories
INSERT INTO "PetCategories" ("Id", "SvgIcon", "IconColor", "BackgroundColor", "IsActive", "IsDeleted", "CreatedAt")
VALUES
    (1, '<svg>...</svg>', 'text-amber-600', 'bg-amber-50', true, false, NOW()),
    (2, '<svg>...</svg>', 'text-purple-600', 'bg-purple-50', true, false, NOW()),
    (3, '<svg>...</svg>', 'text-blue-600', 'bg-blue-50', true, false, NOW()),
    (4, '<svg>...</svg>', 'text-cyan-600', 'bg-cyan-50', true, false, NOW()),
    (5, '<svg>...</svg>', 'text-green-600', 'bg-green-50', true, false, NOW()),
    (6, '<svg>...</svg>', 'text-red-600', 'bg-red-50', true, false, NOW()),
    (7, '<svg>...</svg>', 'text-yellow-600', 'bg-yellow-50', true, false, NOW()),
    (8, '<svg>...</svg>', 'text-pink-600', 'bg-pink-50', true, false, NOW()),
    (9, '<svg>...</svg>', 'text-indigo-600', 'bg-indigo-50', true, false, NOW()),
    (10, '<svg>...</svg>', 'text-gray-600', 'bg-gray-50', true, false, NOW())
ON CONFLICT ("Id") DO UPDATE SET
    "IsActive" = true,
    "IsDeleted" = false,
    "UpdatedAt" = NOW();

-- Step 4: Add localizations
DO $$
DECLARE
    locale_az_id INT;
    locale_en_id INT;
    locale_ru_id INT;
BEGIN
    SELECT "Id" INTO locale_az_id FROM "AppLocales" WHERE "Code" = 'az' LIMIT 1;
    SELECT "Id" INTO locale_en_id FROM "AppLocales" WHERE "Code" = 'en' LIMIT 1;
    SELECT "Id" INTO locale_ru_id FROM "AppLocales" WHERE "Code" = 'ru' LIMIT 1;

    -- Azerbaijani
    INSERT INTO "PetCategoryLocalizations" ("PetCategoryId", "AppLocaleId", "Title", "Subtitle") VALUES
        (1, locale_az_id, 'İtlər', 'Sadiq dostlar'),
        (2, locale_az_id, 'Pişiklər', 'Sevimli yoldaşlar'),
        (3, locale_az_id, 'Quşlar', 'Rəngarəng qanadlılar'),
        (4, locale_az_id, 'Balıqlar', 'Su aləminin sakinləri'),
        (5, locale_az_id, 'Sürünənlər', 'Ekzotik heyvanlar'),
        (6, locale_az_id, 'Həşəratlar', 'Kiçik canlılar'),
        (7, locale_az_id, 'Ferma heyvanları', 'Kənd təsərrüfatı heyvanları'),
        (8, locale_az_id, 'Gəmiricilər', 'Kiçik məməlilər'),
        (9, locale_az_id, 'Vəhşi heyvanlar', 'Ekzotik növlər'),
        (10, locale_az_id, 'Digər', 'Başqa növlər');

    -- English
    INSERT INTO "PetCategoryLocalizations" ("PetCategoryId", "AppLocaleId", "Title", "Subtitle") VALUES
        (1, locale_en_id, 'Dogs', 'Loyal friends'),
        (2, locale_en_id, 'Cats', 'Lovely companions'),
        (3, locale_en_id, 'Birds', 'Colorful wings'),
        (4, locale_en_id, 'Fish', 'Aquatic creatures'),
        (5, locale_en_id, 'Reptiles', 'Exotic animals'),
        (6, locale_en_id, 'Insects', 'Small creatures'),
        (7, locale_en_id, 'Farm Animals', 'Agricultural animals'),
        (8, locale_en_id, 'Rodents', 'Small mammals'),
        (9, locale_en_id, 'Wild Animals', 'Exotic species'),
        (10, locale_en_id, 'Other', 'Other species');

    -- Russian
    INSERT INTO "PetCategoryLocalizations" ("PetCategoryId", "AppLocaleId", "Title", "Subtitle") VALUES
        (1, locale_ru_id, 'Собаки', 'Верные друзья'),
        (2, locale_ru_id, 'Кошки', 'Милые компаньоны'),
        (3, locale_ru_id, 'Птицы', 'Цветные крылья'),
        (4, locale_ru_id, 'Рыбы', 'Водные существа'),
        (5, locale_ru_id, 'Рептилии', 'Экзотические животные'),
        (6, locale_ru_id, 'Насекомые', 'Маленькие существа'),
        (7, locale_ru_id, 'Сельскохозяйственные животные', 'Фермерские животные'),
        (8, locale_ru_id, 'Грызуны', 'Маленькие млекопитающие'),
        (9, locale_ru_id, 'Дикие животные', 'Экзотические виды'),
        (10, locale_ru_id, 'Другие', 'Другие виды');
END $$;

-- Step 5: FIX CRITICAL ISSUE - Set all ads to IsAvailable = true
UPDATE "PetAds" 
SET "IsAvailable" = true,
    "UpdatedAt" = NOW()
WHERE NOT "IsDeleted" AND "Status" = 1;

-- Step 6: Verify
SELECT 
    'Categories' as type,
    COUNT(*) as active_count
FROM "PetCategories" 
WHERE "IsActive" = true AND NOT "IsDeleted"
UNION ALL
SELECT 
    'Ads Available' as type,
    COUNT(*) as count
FROM "PetAds" 
WHERE "Status" = 1 AND "IsAvailable" = true AND NOT "IsDeleted";

COMMIT;
