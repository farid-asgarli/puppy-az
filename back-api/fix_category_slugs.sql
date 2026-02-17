-- Fix slugs using manual mapping since SQL TRANSLATE has issues with multi-byte chars
-- Azerbaijani category slugs
UPDATE "PetCategoryLocalizations" SET "Slug" = 'itler' WHERE "PetCategoryId" = 1 AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'az');
UPDATE "PetCategoryLocalizations" SET "Slug" = 'pisikler' WHERE "PetCategoryId" = 2 AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'az');
UPDATE "PetCategoryLocalizations" SET "Slug" = 'quslar' WHERE "PetCategoryId" = 3 AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'az');
UPDATE "PetCategoryLocalizations" SET "Slug" = 'baliqlar' WHERE "PetCategoryId" = 4 AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'az');
UPDATE "PetCategoryLocalizations" SET "Slug" = 'surunenler' WHERE "PetCategoryId" = 5 AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'az');
UPDATE "PetCategoryLocalizations" SET "Slug" = 'heseratlar' WHERE "PetCategoryId" = 6 AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'az');
UPDATE "PetCategoryLocalizations" SET "Slug" = 'ferma-heyvanlari' WHERE "PetCategoryId" = 7 AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'az');
UPDATE "PetCategoryLocalizations" SET "Slug" = 'gemiriciler' WHERE "PetCategoryId" = 8 AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'az');
UPDATE "PetCategoryLocalizations" SET "Slug" = 'vehsi-heyvanlar' WHERE "PetCategoryId" = 9 AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'az');
UPDATE "PetCategoryLocalizations" SET "Slug" = 'diger' WHERE "PetCategoryId" = 10 AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'az');

-- Russian category slugs (transliterated)
UPDATE "PetCategoryLocalizations" SET "Slug" = 'sobaki' WHERE "PetCategoryId" = 1 AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');
UPDATE "PetCategoryLocalizations" SET "Slug" = 'koshki' WHERE "PetCategoryId" = 2 AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');
UPDATE "PetCategoryLocalizations" SET "Slug" = 'ptitsy' WHERE "PetCategoryId" = 3 AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');
UPDATE "PetCategoryLocalizations" SET "Slug" = 'ryby' WHERE "PetCategoryId" = 4 AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');
UPDATE "PetCategoryLocalizations" SET "Slug" = 'reptilii' WHERE "PetCategoryId" = 5 AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');
UPDATE "PetCategoryLocalizations" SET "Slug" = 'nasekomye' WHERE "PetCategoryId" = 6 AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');
UPDATE "PetCategoryLocalizations" SET "Slug" = 'selskokhozyajstvennye-zhivotnye' WHERE "PetCategoryId" = 7 AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');
UPDATE "PetCategoryLocalizations" SET "Slug" = 'gryzuny' WHERE "PetCategoryId" = 8 AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');
UPDATE "PetCategoryLocalizations" SET "Slug" = 'dikie-zhivotnye' WHERE "PetCategoryId" = 9 AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');
UPDATE "PetCategoryLocalizations" SET "Slug" = 'drugie' WHERE "PetCategoryId" = 10 AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');
