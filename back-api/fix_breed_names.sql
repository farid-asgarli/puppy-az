-- First, let's update the first breed of each category to have the category name

-- Category 1: İtlər - Update breed 1 (Labrador Retriever) to "İt"
UPDATE "PetBreedLocalizations" SET "Title" = 'İt' WHERE "PetBreedId" = 1 AND "AppLocaleId" = 1;
UPDATE "PetBreedLocalizations" SET "Title" = 'Dog' WHERE "PetBreedId" = 1 AND "AppLocaleId" = 2;
UPDATE "PetBreedLocalizations" SET "Title" = 'Собака' WHERE "PetBreedId" = 1 AND "AppLocaleId" = 3;

-- Category 2: Pişiklər - Update breed 25 (Maine Coon) to "Pişik"
UPDATE "PetBreedLocalizations" SET "Title" = 'Pişik' WHERE "PetBreedId" = 25 AND "AppLocaleId" = 1;
UPDATE "PetBreedLocalizations" SET "Title" = 'Cat' WHERE "PetBreedId" = 25 AND "AppLocaleId" = 2;
UPDATE "PetBreedLocalizations" SET "Title" = 'Кошка' WHERE "PetBreedId" = 25 AND "AppLocaleId" = 3;

-- Category 3: Quşlar - Update breed 53 (Budgerigar) to "Quş"
UPDATE "PetBreedLocalizations" SET "Title" = 'Quş' WHERE "PetBreedId" = 53 AND "AppLocaleId" = 1;
UPDATE "PetBreedLocalizations" SET "Title" = 'Bird' WHERE "PetBreedId" = 53 AND "AppLocaleId" = 2;
UPDATE "PetBreedLocalizations" SET "Title" = 'Птица' WHERE "PetBreedId" = 53 AND "AppLocaleId" = 3;

-- Category 4: Balıqlar - Update breed 65 (Goldfish) to "Balıq"
UPDATE "PetBreedLocalizations" SET "Title" = 'Balıq' WHERE "PetBreedId" = 65 AND "AppLocaleId" = 1;
UPDATE "PetBreedLocalizations" SET "Title" = 'Fish' WHERE "PetBreedId" = 65 AND "AppLocaleId" = 2;
UPDATE "PetBreedLocalizations" SET "Title" = 'Рыба' WHERE "PetBreedId" = 65 AND "AppLocaleId" = 3;

-- Category 5: Sürünənlər - Update breed 93 (Bearded Dragon) to "Sürünən"
UPDATE "PetBreedLocalizations" SET "Title" = 'Sürünən' WHERE "PetBreedId" = 93 AND "AppLocaleId" = 1;
UPDATE "PetBreedLocalizations" SET "Title" = 'Reptile' WHERE "PetBreedId" = 93 AND "AppLocaleId" = 2;
UPDATE "PetBreedLocalizations" SET "Title" = 'Рептилия' WHERE "PetBreedId" = 93 AND "AppLocaleId" = 3;

-- Category 6: Həşəratlar - Update breed 140 (Stick Insect) to "Həşərat"
UPDATE "PetBreedLocalizations" SET "Title" = 'Həşərat' WHERE "PetBreedId" = 140 AND "AppLocaleId" = 1;
UPDATE "PetBreedLocalizations" SET "Title" = 'Insect' WHERE "PetBreedId" = 140 AND "AppLocaleId" = 2;
UPDATE "PetBreedLocalizations" SET "Title" = 'Насекомое' WHERE "PetBreedId" = 140 AND "AppLocaleId" = 3;

-- Category 7: Ferma heyvanları - Update breed 109 (Arabian) to "Ferma heyvanı"
UPDATE "PetBreedLocalizations" SET "Title" = 'Ferma heyvanı' WHERE "PetBreedId" = 109 AND "AppLocaleId" = 1;
UPDATE "PetBreedLocalizations" SET "Title" = 'Farm Animal' WHERE "PetBreedId" = 109 AND "AppLocaleId" = 2;
UPDATE "PetBreedLocalizations" SET "Title" = 'Фермерское животное' WHERE "PetBreedId" = 109 AND "AppLocaleId" = 3;

-- Category 8: Gəmiricilər - Update breed 40 (Holland Lop) to "Gəmirici"
UPDATE "PetBreedLocalizations" SET "Title" = 'Gəmirici' WHERE "PetBreedId" = 40 AND "AppLocaleId" = 1;
UPDATE "PetBreedLocalizations" SET "Title" = 'Rodent' WHERE "PetBreedId" = 40 AND "AppLocaleId" = 2;
UPDATE "PetBreedLocalizations" SET "Title" = 'Грызун' WHERE "PetBreedId" = 40 AND "AppLocaleId" = 3;

-- Category 9: Vəhşi heyvanlar - Update breed 134 (Sugar Glider) to "Vəhşi heyvan"
UPDATE "PetBreedLocalizations" SET "Title" = 'Vəhşi heyvan' WHERE "PetBreedId" = 134 AND "AppLocaleId" = 1;
UPDATE "PetBreedLocalizations" SET "Title" = 'Wild Animal' WHERE "PetBreedId" = 134 AND "AppLocaleId" = 2;
UPDATE "PetBreedLocalizations" SET "Title" = 'Дикое животное' WHERE "PetBreedId" = 134 AND "AppLocaleId" = 3;

-- Category 10: Digər - Update breed 145 (Ferret) to "Digər"
UPDATE "PetBreedLocalizations" SET "Title" = 'Digər' WHERE "PetBreedId" = 145 AND "AppLocaleId" = 1;
UPDATE "PetBreedLocalizations" SET "Title" = 'Other' WHERE "PetBreedId" = 145 AND "AppLocaleId" = 2;
UPDATE "PetBreedLocalizations" SET "Title" = 'Другое' WHERE "PetBreedId" = 145 AND "AppLocaleId" = 3;

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
