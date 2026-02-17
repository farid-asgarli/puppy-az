-- Create default breeds for each category (with same name as category)
-- First, check if they exist, if not create them

-- For each category, create a breed with same name
-- Category 1: İtlər
INSERT INTO "PetBreeds" ("PetCategoryId", "IsDeleted", "CreatedAt")
SELECT 1, false, NOW() WHERE NOT EXISTS (SELECT 1 FROM "PetBreeds" WHERE "Id" = 1001);
INSERT INTO "PetBreedLocalizations" ("PetBreedId", "AppLocaleId", "Title")
SELECT 1001, 1, 'İt' WHERE NOT EXISTS (SELECT 1 FROM "PetBreedLocalizations" WHERE "PetBreedId" = 1001 AND "AppLocaleId" = 1);
INSERT INTO "PetBreedLocalizations" ("PetBreedId", "AppLocaleId", "Title")
SELECT 1001, 2, 'Dog' WHERE NOT EXISTS (SELECT 1 FROM "PetBreedLocalizations" WHERE "PetBreedId" = 1001 AND "AppLocaleId" = 2);
INSERT INTO "PetBreedLocalizations" ("PetBreedId", "AppLocaleId", "Title")
SELECT 1001, 3, 'Собака' WHERE NOT EXISTS (SELECT 1 FROM "PetBreedLocalizations" WHERE "PetBreedId" = 1001 AND "AppLocaleId" = 3);

-- Category 2: Pişiklər
INSERT INTO "PetBreeds" ("PetCategoryId", "IsDeleted", "CreatedAt")
SELECT 2, false, NOW() WHERE NOT EXISTS (SELECT 1 FROM "PetBreeds" WHERE "Id" = 1002);
INSERT INTO "PetBreedLocalizations" ("PetBreedId", "AppLocaleId", "Title")
SELECT 1002, 1, 'Pişik' WHERE NOT EXISTS (SELECT 1 FROM "PetBreedLocalizations" WHERE "PetBreedId" = 1002 AND "AppLocaleId" = 1);
INSERT INTO "PetBreedLocalizations" ("PetBreedId", "AppLocaleId", "Title")
SELECT 1002, 2, 'Cat' WHERE NOT EXISTS (SELECT 1 FROM "PetBreedLocalizations" WHERE "PetBreedId" = 1002 AND "AppLocaleId" = 2);
INSERT INTO "PetBreedLocalizations" ("PetBreedId", "AppLocaleId", "Title")
SELECT 1002, 3, 'Кошка' WHERE NOT EXISTS (SELECT 1 FROM "PetBreedLocalizations" WHERE "PetBreedId" = 1002 AND "AppLocaleId" = 3);

-- Category 3: Quşlar
INSERT INTO "PetBreeds" ("PetCategoryId", "IsDeleted", "CreatedAt")
SELECT 3, false, NOW() WHERE NOT EXISTS (SELECT 1 FROM "PetBreeds" WHERE "Id" = 1003);
INSERT INTO "PetBreedLocalizations" ("PetBreedId", "AppLocaleId", "Title")
SELECT 1003, 1, 'Quş' WHERE NOT EXISTS (SELECT 1 FROM "PetBreedLocalizations" WHERE "PetBreedId" = 1003 AND "AppLocaleId" = 1);
INSERT INTO "PetBreedLocalizations" ("PetBreedId", "AppLocaleId", "Title")
SELECT 1003, 2, 'Bird' WHERE NOT EXISTS (SELECT 1 FROM "PetBreedLocalizations" WHERE "PetBreedId" = 1003 AND "AppLocaleId" = 2);
INSERT INTO "PetBreedLocalizations" ("PetBreedId", "AppLocaleId", "Title")
SELECT 1003, 3, 'Птица' WHERE NOT EXISTS (SELECT 1 FROM "PetBreedLocalizations" WHERE "PetBreedId" = 1003 AND "AppLocaleId" = 3);

-- Category 4: Balıqlar
INSERT INTO "PetBreeds" ("PetCategoryId", "IsDeleted", "CreatedAt")
SELECT 4, false, NOW() WHERE NOT EXISTS (SELECT 1 FROM "PetBreeds" WHERE "Id" = 1004);
INSERT INTO "PetBreedLocalizations" ("PetBreedId", "AppLocaleId", "Title")
SELECT 1004, 1, 'Balıq' WHERE NOT EXISTS (SELECT 1 FROM "PetBreedLocalizations" WHERE "PetBreedId" = 1004 AND "AppLocaleId" = 1);
INSERT INTO "PetBreedLocalizations" ("PetBreedId", "AppLocaleId", "Title")
SELECT 1004, 2, 'Fish' WHERE NOT EXISTS (SELECT 1 FROM "PetBreedLocalizations" WHERE "PetBreedId" = 1004 AND "AppLocaleId" = 2);
INSERT INTO "PetBreedLocalizations" ("PetBreedId", "AppLocaleId", "Title")
SELECT 1004, 3, 'Рыба' WHERE NOT EXISTS (SELECT 1 FROM "PetBreedLocalizations" WHERE "PetBreedId" = 1004 AND "AppLocaleId" = 3);

-- Category 5: Sürünənlər
INSERT INTO "PetBreeds" ("PetCategoryId", "IsDeleted", "CreatedAt")
SELECT 5, false, NOW() WHERE NOT EXISTS (SELECT 1 FROM "PetBreeds" WHERE "Id" = 1005);
INSERT INTO "PetBreedLocalizations" ("PetBreedId", "AppLocaleId", "Title")
SELECT 1005, 1, 'Sürünən' WHERE NOT EXISTS (SELECT 1 FROM "PetBreedLocalizations" WHERE "PetBreedId" = 1005 AND "AppLocaleId" = 1);
INSERT INTO "PetBreedLocalizations" ("PetBreedId", "AppLocaleId", "Title")
SELECT 1005, 2, 'Reptile' WHERE NOT EXISTS (SELECT 1 FROM "PetBreedLocalizations" WHERE "PetBreedId" = 1005 AND "AppLocaleId" = 2);
INSERT INTO "PetBreedLocalizations" ("PetBreedId", "AppLocaleId", "Title")
SELECT 1005, 3, 'Рептилия' WHERE NOT EXISTS (SELECT 1 FROM "PetBreedLocalizations" WHERE "PetBreedId" = 1005 AND "AppLocaleId" = 3);

-- Category 6: Həşəratlar
INSERT INTO "PetBreeds" ("PetCategoryId", "IsDeleted", "CreatedAt")
SELECT 6, false, NOW() WHERE NOT EXISTS (SELECT 1 FROM "PetBreeds" WHERE "Id" = 1006);
INSERT INTO "PetBreedLocalizations" ("PetBreedId", "AppLocaleId", "Title")
SELECT 1006, 1, 'Həşərat' WHERE NOT EXISTS (SELECT 1 FROM "PetBreedLocalizations" WHERE "PetBreedId" = 1006 AND "AppLocaleId" = 1);
INSERT INTO "PetBreedLocalizations" ("PetBreedId", "AppLocaleId", "Title")
SELECT 1006, 2, 'Insect' WHERE NOT EXISTS (SELECT 1 FROM "PetBreedLocalizations" WHERE "PetBreedId" = 1006 AND "AppLocaleId" = 2);
INSERT INTO "PetBreedLocalizations" ("PetBreedId", "AppLocaleId", "Title")
SELECT 1006, 3, 'Насекомое' WHERE NOT EXISTS (SELECT 1 FROM "PetBreedLocalizations" WHERE "PetBreedId" = 1006 AND "AppLocaleId" = 3);

-- Category 7: Ferma heyvanları
INSERT INTO "PetBreeds" ("PetCategoryId", "IsDeleted", "CreatedAt")
SELECT 7, false, NOW() WHERE NOT EXISTS (SELECT 1 FROM "PetBreeds" WHERE "Id" = 1007);
INSERT INTO "PetBreedLocalizations" ("PetBreedId", "AppLocaleId", "Title")
SELECT 1007, 1, 'Ferma heyvanı' WHERE NOT EXISTS (SELECT 1 FROM "PetBreedLocalizations" WHERE "PetBreedId" = 1007 AND "AppLocaleId" = 1);
INSERT INTO "PetBreedLocalizations" ("PetBreedId", "AppLocaleId", "Title")
SELECT 1007, 2, 'Farm Animal' WHERE NOT EXISTS (SELECT 1 FROM "PetBreedLocalizations" WHERE "PetBreedId" = 1007 AND "AppLocaleId" = 2);
INSERT INTO "PetBreedLocalizations" ("PetBreedId", "AppLocaleId", "Title")
SELECT 1007, 3, 'Фермерское животное' WHERE NOT EXISTS (SELECT 1 FROM "PetBreedLocalizations" WHERE "PetBreedId" = 1007 AND "AppLocaleId" = 3);

-- Category 8: Gəmiricilər
INSERT INTO "PetBreeds" ("PetCategoryId", "IsDeleted", "CreatedAt")
SELECT 8, false, NOW() WHERE NOT EXISTS (SELECT 1 FROM "PetBreeds" WHERE "Id" = 1008);
INSERT INTO "PetBreedLocalizations" ("PetBreedId", "AppLocaleId", "Title")
SELECT 1008, 1, 'Gəmirici' WHERE NOT EXISTS (SELECT 1 FROM "PetBreedLocalizations" WHERE "PetBreedId" = 1008 AND "AppLocaleId" = 1);
INSERT INTO "PetBreedLocalizations" ("PetBreedId", "AppLocaleId", "Title")
SELECT 1008, 2, 'Rodent' WHERE NOT EXISTS (SELECT 1 FROM "PetBreedLocalizations" WHERE "PetBreedId" = 1008 AND "AppLocaleId" = 2);
INSERT INTO "PetBreedLocalizations" ("PetBreedId", "AppLocaleId", "Title")
SELECT 1008, 3, 'Грызун' WHERE NOT EXISTS (SELECT 1 FROM "PetBreedLocalizations" WHERE "PetBreedId" = 1008 AND "AppLocaleId" = 3);

-- Category 9: Vəhşi heyvanlar
INSERT INTO "PetBreeds" ("PetCategoryId", "IsDeleted", "CreatedAt")
SELECT 9, false, NOW() WHERE NOT EXISTS (SELECT 1 FROM "PetBreeds" WHERE "Id" = 1009);
INSERT INTO "PetBreedLocalizations" ("PetBreedId", "AppLocaleId", "Title")
SELECT 1009, 1, 'Vəhşi heyvan' WHERE NOT EXISTS (SELECT 1 FROM "PetBreedLocalizations" WHERE "PetBreedId" = 1009 AND "AppLocaleId" = 1);
INSERT INTO "PetBreedLocalizations" ("PetBreedId", "AppLocaleId", "Title")
SELECT 1009, 2, 'Wild Animal' WHERE NOT EXISTS (SELECT 1 FROM "PetBreedLocalizations" WHERE "PetBreedId" = 1009 AND "AppLocaleId" = 2);
INSERT INTO "PetBreedLocalizations" ("PetBreedId", "AppLocaleId", "Title")
SELECT 1009, 3, 'Дикое животное' WHERE NOT EXISTS (SELECT 1 FROM "PetBreedLocalizations" WHERE "PetBreedId" = 1009 AND "AppLocaleId" = 3);

-- Category 10: Digər
INSERT INTO "PetBreeds" ("PetCategoryId", "IsDeleted", "CreatedAt")
SELECT 10, false, NOW() WHERE NOT EXISTS (SELECT 1 FROM "PetBreeds" WHERE "Id" = 1010);
INSERT INTO "PetBreedLocalizations" ("PetBreedId", "AppLocaleId", "Title")
SELECT 1010, 1, 'Digər' WHERE NOT EXISTS (SELECT 1 FROM "PetBreedLocalizations" WHERE "PetBreedId" = 1010 AND "AppLocaleId" = 1);
INSERT INTO "PetBreedLocalizations" ("PetBreedId", "AppLocaleId", "Title")
SELECT 1010, 2, 'Other' WHERE NOT EXISTS (SELECT 1 FROM "PetBreedLocalizations" WHERE "PetBreedId" = 1010 AND "AppLocaleId" = 2);
INSERT INTO "PetBreedLocalizations" ("PetBreedId", "AppLocaleId", "Title")
SELECT 1010, 3, 'Другое' WHERE NOT EXISTS (SELECT 1 FROM "PetBreedLocalizations" WHERE "PetBreedId" = 1010 AND "AppLocaleId" = 3);

-- Now update all ads to use the default breed for their category
-- Get the breed's category first, then assign the default breed for that category

-- Update ads in category 1 (İtlər) - use first breed from category 1
UPDATE "PetAds" pa SET "PetBreedId" = (SELECT pb."Id" FROM "PetBreeds" pb WHERE pb."PetCategoryId" = 1 AND pb."IsDeleted" = false ORDER BY pb."Id" LIMIT 1)
WHERE pa."PetBreedId" IN (SELECT pb."Id" FROM "PetBreeds" pb WHERE pb."PetCategoryId" = 1);

-- Update ads in category 2 (Pişiklər)
UPDATE "PetAds" pa SET "PetBreedId" = (SELECT pb."Id" FROM "PetBreeds" pb WHERE pb."PetCategoryId" = 2 AND pb."IsDeleted" = false ORDER BY pb."Id" LIMIT 1)
WHERE pa."PetBreedId" IN (SELECT pb."Id" FROM "PetBreeds" pb WHERE pb."PetCategoryId" = 2);

-- Update ads in category 3 (Quşlar)
UPDATE "PetAds" pa SET "PetBreedId" = (SELECT pb."Id" FROM "PetBreeds" pb WHERE pb."PetCategoryId" = 3 AND pb."IsDeleted" = false ORDER BY pb."Id" LIMIT 1)
WHERE pa."PetBreedId" IN (SELECT pb."Id" FROM "PetBreeds" pb WHERE pb."PetCategoryId" = 3);

-- Update ads in category 4 (Balıqlar)
UPDATE "PetAds" pa SET "PetBreedId" = (SELECT pb."Id" FROM "PetBreeds" pb WHERE pb."PetCategoryId" = 4 AND pb."IsDeleted" = false ORDER BY pb."Id" LIMIT 1)
WHERE pa."PetBreedId" IN (SELECT pb."Id" FROM "PetBreeds" pb WHERE pb."PetCategoryId" = 4);

-- Update ads in category 5 (Sürünənlər)
UPDATE "PetAds" pa SET "PetBreedId" = (SELECT pb."Id" FROM "PetBreeds" pb WHERE pb."PetCategoryId" = 5 AND pb."IsDeleted" = false ORDER BY pb."Id" LIMIT 1)
WHERE pa."PetBreedId" IN (SELECT pb."Id" FROM "PetBreeds" pb WHERE pb."PetCategoryId" = 5);

-- Update ads in category 6 (Həşəratlar)
UPDATE "PetAds" pa SET "PetBreedId" = (SELECT pb."Id" FROM "PetBreeds" pb WHERE pb."PetCategoryId" = 6 AND pb."IsDeleted" = false ORDER BY pb."Id" LIMIT 1)
WHERE pa."PetBreedId" IN (SELECT pb."Id" FROM "PetBreeds" pb WHERE pb."PetCategoryId" = 6);

-- Update ads in category 7 (Ferma heyvanları)
UPDATE "PetAds" pa SET "PetBreedId" = (SELECT pb."Id" FROM "PetBreeds" pb WHERE pb."PetCategoryId" = 7 AND pb."IsDeleted" = false ORDER BY pb."Id" LIMIT 1)
WHERE pa."PetBreedId" IN (SELECT pb."Id" FROM "PetBreeds" pb WHERE pb."PetCategoryId" = 7);

-- Update ads in category 8 (Gəmiricilər)
UPDATE "PetAds" pa SET "PetBreedId" = (SELECT pb."Id" FROM "PetBreeds" pb WHERE pb."PetCategoryId" = 8 AND pb."IsDeleted" = false ORDER BY pb."Id" LIMIT 1)
WHERE pa."PetBreedId" IN (SELECT pb."Id" FROM "PetBreeds" pb WHERE pb."PetCategoryId" = 8);

-- Update ads in category 9 (Vəhşi heyvanlar)
UPDATE "PetAds" pa SET "PetBreedId" = (SELECT pb."Id" FROM "PetBreeds" pb WHERE pb."PetCategoryId" = 9 AND pb."IsDeleted" = false ORDER BY pb."Id" LIMIT 1)
WHERE pa."PetBreedId" IN (SELECT pb."Id" FROM "PetBreeds" pb WHERE pb."PetCategoryId" = 9);

-- Update ads in category 10 (Digər)
UPDATE "PetAds" pa SET "PetBreedId" = (SELECT pb."Id" FROM "PetBreeds" pb WHERE pb."PetCategoryId" = 10 AND pb."IsDeleted" = false ORDER BY pb."Id" LIMIT 1)
WHERE pa."PetBreedId" IN (SELECT pb."Id" FROM "PetBreeds" pb WHERE pb."PetCategoryId" = 10);

-- Verify results
SELECT pb."PetCategoryId",
       (SELECT pcl."Title" FROM "PetCategoryLocalizations" pcl WHERE pcl."PetCategoryId" = pb."PetCategoryId" AND pcl."AppLocaleId" = 1 LIMIT 1) as category,
       (SELECT pbl."Title" FROM "PetBreedLocalizations" pbl WHERE pbl."PetBreedId" = pb."Id" AND pbl."AppLocaleId" = 1 LIMIT 1) as breed,
       COUNT(pa."Id") as ad_count
FROM "PetAds" pa
JOIN "PetBreeds" pb ON pa."PetBreedId" = pb."Id"
WHERE pa."IsDeleted" = false
GROUP BY pb."PetCategoryId", pb."Id"
ORDER BY pb."PetCategoryId";
