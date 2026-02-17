-- Seed PetAdTypes and their localizations

BEGIN;

-- Insert PetAdTypes
INSERT INTO "PetAdTypes" ("Id", "Key", "Emoji", "IconName", "BackgroundColor", "TextColor", "BorderColor", "SortOrder", "IsActive", "IsDeleted", "CreatedAt")
VALUES 
    (1, 'sale', '💰', 'currency-dollar', '#FEF3C7', '#92400E', '#F59E0B', 1, true, false, NOW()),
    (2, 'match', '❤️', 'heart', '#FCE7F3', '#831843', '#EC4899', 2, true, false, NOW()),
    (3, 'found', '🔍', 'search', '#DBEAFE', '#1E3A8A', '#3B82F6', 3, true, false, NOW()),
    (4, 'lost', '😢', 'alert-circle', '#FEE2E2', '#7F1D1D', '#EF4444', 4, true, false, NOW()),
    (5, 'owning', '🏠', 'home', '#D1FAE5', '#065F46', '#10B981', 5, true, false, NOW())
ON CONFLICT ("Id") DO UPDATE SET
    "Key" = EXCLUDED."Key",
    "Emoji" = EXCLUDED."Emoji",
    "IconName" = EXCLUDED."IconName",
    "BackgroundColor" = EXCLUDED."BackgroundColor",
    "TextColor" = EXCLUDED."TextColor",
    "BorderColor" = EXCLUDED."BorderColor",
    "SortOrder" = EXCLUDED."SortOrder",
    "IsActive" = EXCLUDED."IsActive",
    "UpdatedAt" = NOW();

-- Get AppLocale IDs
DO $$
DECLARE
    locale_az_id INT;
    locale_en_id INT;
    locale_ru_id INT;
BEGIN
    SELECT "Id" INTO locale_az_id FROM "AppLocales" WHERE "Code" = 'az' LIMIT 1;
    SELECT "Id" INTO locale_en_id FROM "AppLocales" WHERE "Code" = 'en' LIMIT 1;
    SELECT "Id" INTO locale_ru_id FROM "AppLocales" WHERE "Code" = 'ru' LIMIT 1;

    -- Delete existing localizations first
    DELETE FROM "PetAdTypeLocalizations";
    
    -- Azerbaijani localizations
    INSERT INTO "PetAdTypeLocalizations" ("PetAdTypeId", "AppLocaleId", "Name", "Title", "Description")
    VALUES 
        (1, locale_az_id, 'Satış', 'Satış', 'Ev heyvanını sat'),
        (2, locale_az_id, 'Cütləşdirmə', 'Cütləşdirmə', 'Cütləşdirmə üçün yoldaş tap'),
        (3, locale_az_id, 'Tapıldı', 'Tapıldı', 'Tapılmış ev heyvanı'),
        (4, locale_az_id, 'İtirildi', 'İtirildi', 'İtirilmiş ev heyvanı'),
        (5, locale_az_id, 'Sahiblənmə', 'Sahiblənmə', 'Ev heyvanına sahib ol');

    -- English localizations
    INSERT INTO "PetAdTypeLocalizations" ("PetAdTypeId", "AppLocaleId", "Name", "Title", "Description")
    VALUES 
        (1, locale_en_id, 'Sale', 'For Sale', 'Sell a pet'),
        (2, locale_en_id, 'Match', 'Matching', 'Find a mate for breeding'),
        (3, locale_en_id, 'Found', 'Found', 'Found pet'),
        (4, locale_en_id, 'Lost', 'Lost', 'Lost pet'),
        (5, locale_en_id, 'Owning', 'Adoption', 'Adopt a pet');

    -- Russian localizations
    INSERT INTO "PetAdTypeLocalizations" ("PetAdTypeId", "AppLocaleId", "Name", "Title", "Description")
    VALUES 
        (1, locale_ru_id, 'Продажа', 'Продажа', 'Продать питомца'),
        (2, locale_ru_id, 'Вязка', 'Вязка', 'Найти пару для разведения'),
        (3, locale_ru_id, 'Найдено', 'Найдено', 'Найденный питомец'),
        (4, locale_ru_id, 'Потеряно', 'Потеряно', 'Потерянный питомец'),
        (5, locale_ru_id, 'Усыновление', 'Усыновление', 'Усыновить питомца');
END $$;

-- Verify
SELECT 
    pat."Id",
    pat."Key",
    pat."Emoji",
    pat."SortOrder",
    pat."IsActive",
    COUNT(patl."Id") as localization_count
FROM "PetAdTypes" pat
LEFT JOIN "PetAdTypeLocalizations" patl ON pat."Id" = patl."PetAdTypeId"
GROUP BY pat."Id", pat."Key", pat."Emoji", pat."SortOrder", pat."IsActive"
ORDER BY pat."SortOrder";

COMMIT;
