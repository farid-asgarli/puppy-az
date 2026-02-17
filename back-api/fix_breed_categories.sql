-- Fix breed category assignments

-- Rabbits (Holland Lop, etc.) are in category 3 (Quşlar) but should be in category 8 (Gəmiricilər)
-- Actually, rabbits should have their own category or go to "Digər" (10)
-- Let's move them to Gəmiricilər (8) since rodent-like

-- Birds (Budgerigar, etc.) are in category 4 (Balıqlar) but should be in category 3 (Quşlar)
UPDATE "PetBreeds" SET "PetCategoryId" = 3 WHERE "Id" BETWEEN 53 AND 64;

-- Fish (Goldfish, etc.) are in category 5 (Sürünənlər) but should be in category 4 (Balıqlar)
UPDATE "PetBreeds" SET "PetCategoryId" = 4 WHERE "Id" BETWEEN 65 AND 81;

-- Rodents (Guinea Pig, Hamster, etc.) are in category 6 (Həşəratlar) but should be in category 8 (Gəmiricilər)
UPDATE "PetBreeds" SET "PetCategoryId" = 8 WHERE "Id" BETWEEN 82 AND 92;

-- Reptiles (Bearded Dragon, etc.) are in category 7 (Ferma heyvanları) but should be in category 5 (Sürünənlər)
UPDATE "PetBreeds" SET "PetCategoryId" = 5 WHERE "Id" BETWEEN 93 AND 108;

-- Horses (Arabian, etc.) are in category 8 (Gəmiricilər) but should be in category 7 (Ferma heyvanları)
UPDATE "PetBreeds" SET "PetCategoryId" = 7 WHERE "Id" BETWEEN 109 AND 121;

-- Farm animals (Chicken, Cow, Sheep, Goat, etc.) are in category 9 (Vəhşi heyvanlar) but should be in category 7 (Ferma heyvanları)
UPDATE "PetBreeds" SET "PetCategoryId" = 7 WHERE "Id" BETWEEN 122 AND 133;

-- Rabbits from category 3 should go to Gəmiricilər (8)
UPDATE "PetBreeds" SET "PetCategoryId" = 8 WHERE "Id" BETWEEN 40 AND 52;

-- Exotic/wild animals in category 10 are correct for "Digər"
-- But some like Sugar Glider, Fennec Fox should be in 9 (Vəhşi heyvanlar)
UPDATE "PetBreeds" SET "PetCategoryId" = 9 WHERE "Id" IN (134, 135, 136, 137, 138, 139);

-- Insects should be in category 6 (Həşəratlar)
UPDATE "PetBreeds" SET "PetCategoryId" = 6 WHERE "Id" BETWEEN 140 AND 144;

-- Ferrets, Hedgehogs, etc. can stay in 10 (Digər) or move to appropriate
-- Frogs, Salamanders should be in 5 (Sürünənlər) - amphibians
UPDATE "PetBreeds" SET "PetCategoryId" = 5 WHERE "Id" IN (150, 151, 153, 157, 158, 159, 160, 161, 162, 163, 164, 165);

-- Sea turtles, sea snakes, marine iguana - 5 (Sürünənlər)
UPDATE "PetBreeds" SET "PetCategoryId" = 5 WHERE "Id" IN (152, 154, 155, 156);

-- Monkeys - 9 (Vəhşi heyvanlar)
UPDATE "PetBreeds" SET "PetCategoryId" = 9 WHERE "Id" BETWEEN 166 AND 171;

-- Marsupials (Kangaroo, Koala, etc.) - 9 (Vəhşi heyvanlar)
UPDATE "PetBreeds" SET "PetCategoryId" = 9 WHERE "Id" BETWEEN 172 AND 178;

-- Spiders/Scorpions - 6 (Həşəratlar)
UPDATE "PetBreeds" SET "PetCategoryId" = 6 WHERE "Id" BETWEEN 179 AND 185;

-- Pigs - 7 (Ferma heyvanları)
UPDATE "PetBreeds" SET "PetCategoryId" = 7 WHERE "Id" BETWEEN 186 AND 195;

-- Deer - 9 (Vəhşi heyvanlar)
UPDATE "PetBreeds" SET "PetCategoryId" = 9 WHERE "Id" BETWEEN 196 AND 201;

-- Bears - 9 (Vəhşi heyvanlar)
UPDATE "PetBreeds" SET "PetCategoryId" = 9 WHERE "Id" BETWEEN 202 AND 207;

-- Foxes - 9 (Vəhşi heyvanlar)
UPDATE "PetBreeds" SET "PetCategoryId" = 9 WHERE "Id" BETWEEN 208 AND 212;

-- Hedgehogs - 10 (Digər) - keep as is
-- Marine mammals - 9 (Vəhşi heyvanlar)
UPDATE "PetBreeds" SET "PetCategoryId" = 9 WHERE "Id" BETWEEN 216 AND 222;

-- Mixed breeds - keep in 10 (Digər)

-- Verify the results
SELECT pb."PetCategoryId", 
       (SELECT pcl."Title" FROM "PetCategoryLocalizations" pcl WHERE pcl."PetCategoryId" = pb."PetCategoryId" AND pcl."AppLocaleId" = 1 LIMIT 1) as category,
       COUNT(*) as breed_count
FROM "PetBreeds" pb
WHERE pb."IsDeleted" = false
GROUP BY pb."PetCategoryId"
ORDER BY pb."PetCategoryId";
