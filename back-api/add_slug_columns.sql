-- Add Slug columns to localization tables
ALTER TABLE "PetCategoryLocalizations" ADD COLUMN IF NOT EXISTS "Slug" VARCHAR(150) NOT NULL DEFAULT '';
ALTER TABLE "PetBreedLocalizations" ADD COLUMN IF NOT EXISTS "Slug" VARCHAR(200) NOT NULL DEFAULT '';

-- Generate slugs for PetCategoryLocalizations from Title
-- This handles Azerbaijani, English and Russian characters
UPDATE "PetCategoryLocalizations" SET "Slug" = 
    TRIM(BOTH '-' FROM 
        REGEXP_REPLACE(
            REGEXP_REPLACE(
                LOWER(
                    TRANSLATE("Title", 
                        'əüöğıçşƏÜÖĞİÇŞ' ||
                        'абвгдеёжзийклмнопрстуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ',
                        'euogicseuogics' ||
                        'abvgdeezhzijklmnoprstufkhtschchshshchyyeyuyaabvgdeezhzijklmnoprstufkhtschchshshchyyeyuya'
                    )
                ),
                '[^a-z0-9]+', '-', 'g'
            ),
            '-{2,}', '-', 'g'
        )
    )
WHERE "Slug" = '' OR "Slug" IS NULL;

-- Generate slugs for PetBreedLocalizations from Title
UPDATE "PetBreedLocalizations" SET "Slug" = 
    TRIM(BOTH '-' FROM 
        REGEXP_REPLACE(
            REGEXP_REPLACE(
                LOWER(
                    TRANSLATE("Title", 
                        'əüöğıçşƏÜÖĞİÇŞ' ||
                        'абвгдеёжзийклмнопрстуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ',
                        'euogicseuogics' ||
                        'abvgdeezhzijklmnoprstufkhtschchshshchyyeyuyaabvgdeezhzijklmnoprstufkhtschchshshchyyeyuya'
                    )
                ),
                '[^a-z0-9]+', '-', 'g'
            ),
            '-{2,}', '-', 'g'
        )
    )
WHERE "Slug" = '' OR "Slug" IS NULL;

-- Handle duplicate slugs within same locale by appending the entity ID
-- First fix category slugs
UPDATE "PetCategoryLocalizations" pcl1
SET "Slug" = pcl1."Slug" || '-' || pcl1."PetCategoryId"
WHERE EXISTS (
    SELECT 1 FROM "PetCategoryLocalizations" pcl2
    WHERE pcl2."Slug" = pcl1."Slug"
    AND pcl2."AppLocaleId" = pcl1."AppLocaleId"
    AND pcl2."Id" < pcl1."Id"
);

-- Fix breed slugs
UPDATE "PetBreedLocalizations" pbl1
SET "Slug" = pbl1."Slug" || '-' || pbl1."PetBreedId"
WHERE EXISTS (
    SELECT 1 FROM "PetBreedLocalizations" pbl2
    WHERE pbl2."Slug" = pbl1."Slug"
    AND pbl2."AppLocaleId" = pbl1."AppLocaleId"
    AND pbl2."Id" < pbl1."Id"
);

-- Create unique indexes
CREATE UNIQUE INDEX IF NOT EXISTS "IX_PetCategoryLocalizations_Slug_AppLocaleId" 
    ON "PetCategoryLocalizations" ("Slug", "AppLocaleId");

CREATE UNIQUE INDEX IF NOT EXISTS "IX_PetBreedLocalizations_Slug_AppLocaleId" 
    ON "PetBreedLocalizations" ("Slug", "AppLocaleId");
