-- Update category colors to be more logical and natural

-- 1. İtlər (Dogs) - Qəhvəyi/Amber (natural dog colors)
UPDATE "PetCategories" 
SET "IconColor" = 'text-amber-600', "BackgroundColor" = 'bg-amber-50'
WHERE "Id" = 1;

-- 2. Pişiklər (Cats) - Bənövşəyi/Purple (royal, elegant like cats)
UPDATE "PetCategories" 
SET "IconColor" = 'text-purple-600', "BackgroundColor" = 'bg-purple-50'
WHERE "Id" = 2;

-- 3. Quşlar (Birds) - Göy/Sky blue (sky association)
UPDATE "PetCategories" 
SET "IconColor" = 'text-sky-600', "BackgroundColor" = 'bg-sky-50'
WHERE "Id" = 3;

-- 4. Balıqlar (Fish) - Mavi/Blue (water/ocean)
UPDATE "PetCategories" 
SET "IconColor" = 'text-blue-600', "BackgroundColor" = 'bg-blue-50'
WHERE "Id" = 4;

-- 5. Sürünənlər (Reptiles) - Yaşıl/Green (jungle, nature)
UPDATE "PetCategories" 
SET "IconColor" = 'text-green-600', "BackgroundColor" = 'bg-green-50'
WHERE "Id" = 5;

-- 6. Həşəratlar (Insects) - Boz/Gray (neutral for bugs)
UPDATE "PetCategories" 
SET "IconColor" = 'text-gray-600', "BackgroundColor" = 'bg-gray-50'
WHERE "Id" = 6;

-- 7. Ferma heyvanları (Farm animals) - Əmərət yaşıl/Emerald (grass, pasture)
UPDATE "PetCategories" 
SET "IconColor" = 'text-emerald-600', "BackgroundColor" = 'bg-emerald-50'
WHERE "Id" = 7;

-- 8. Gəmiricilər (Rodents) - Narıncı/Orange (hamster-like colors)
UPDATE "PetCategories" 
SET "IconColor" = 'text-orange-600', "BackgroundColor" = 'bg-orange-50'
WHERE "Id" = 8;

-- 9. Vəhşi heyvanlar (Wild animals) - Sarı/Yellow (safari, savanna)
UPDATE "PetCategories" 
SET "IconColor" = 'text-yellow-600', "BackgroundColor" = 'bg-yellow-50'
WHERE "Id" = 9;

-- 10. Digər (Other) - Bənövşəyi/Violet (misc category)
UPDATE "PetCategories" 
SET "IconColor" = 'text-violet-600', "BackgroundColor" = 'bg-violet-50'
WHERE "Id" = 10;

-- Verify the changes
SELECT 
    pc."Id",
    pcl."Title",
    pc."IconColor",
    pc."BackgroundColor"
FROM "PetCategories" pc
JOIN "PetCategoryLocalizations" pcl ON pc."Id" = pcl."PetCategoryId"
JOIN "AppLocales" al ON pcl."AppLocaleId" = al."Id"
WHERE al."Code" = 'az' AND pc."IsActive" = true
ORDER BY pc."Id";
