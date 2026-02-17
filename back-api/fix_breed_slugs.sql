-- Fix Russian breed slugs
UPDATE "PetBreedLocalizations" SET "Slug" = 'amerikanskaya-akita' WHERE "PetBreedId" = 231 AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');
UPDATE "PetBreedLocalizations" SET "Slug" = 'malamut' WHERE "PetBreedId" = 232 AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');
UPDATE "PetBreedLocalizations" SET "Slug" = 'buldog' WHERE "PetBreedId" = 233 AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

-- Drop existing unique index first (to avoid conflicts), recreate after fixing all slugs
DROP INDEX IF EXISTS "IX_PetBreedLocalizations_Slug_AppLocaleId";

-- Fix any remaining empty or broken slugs (starts with dash)
-- For now re-create the index
CREATE UNIQUE INDEX "IX_PetBreedLocalizations_Slug_AppLocaleId" 
    ON "PetBreedLocalizations" ("Slug", "AppLocaleId");
