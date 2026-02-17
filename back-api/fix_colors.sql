-- Fix color encoding issues
UPDATE "PetAds" SET "Color" = 'Qəhvəyi' WHERE "Color" = 'Q??hv??yi';
UPDATE "PetAds" SET "Color" = 'Qızılı' WHERE "Color" = 'Q??z??l??';
UPDATE "PetAds" SET "Color" = 'Ağ' WHERE "Color" = 'A??';
UPDATE "PetAds" SET "Color" = 'Sarı' WHERE "Color" = 'Sar??';
UPDATE "PetAds" SET "Color" = 'Çoxrəngli' WHERE "Color" = '??oxr??ngli';
UPDATE "PetAds" SET "Color" = 'Zolaqlı' WHERE "Color" = 'Zolaql??';

-- Verify
SELECT DISTINCT "Color" FROM "PetAds" WHERE "IsDeleted" = false AND "Color" IS NOT NULL;
