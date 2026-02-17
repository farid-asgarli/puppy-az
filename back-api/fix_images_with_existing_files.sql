-- Fix images for ads 501, 502, 503, 505 with EXISTING seed photos

-- Ad 501 (HelloWorld)
UPDATE "PetAdImages"
SET "FilePath" = '/uploads/seed_photo/pexels-pixabay-45851.jpg'
WHERE "PetAdId" = 501;

-- Ad 502 (adorabalee)
UPDATE "PetAdImages"
SET "FilePath" = '/uploads/seed_photo/pexels-pixabay-220938.jpg'
WHERE "PetAdId" = 502;

-- Ad 503 (123124124asakfsalsflaks - THIS IS THE ONE FROM SCREENSHOT)
UPDATE "PetAdImages"
SET "FilePath" = '/uploads/seed_photo/pexels-pixabay-326012.jpg'
WHERE "PetAdId" = 503;

-- Ad 505 (asdadaaaaaaa)
UPDATE "PetAdImages"
SET "FilePath" = '/uploads/seed_photo/pexels-pixabay-326900.jpg'
WHERE "PetAdId" = 505;

-- Verify the fix
SELECT 
    pa."Id",
    pa."Title",
    pai."FilePath"
FROM "PetAds" pa
JOIN "PetAdImages" pai ON pa."Id" = pai."PetAdId"
WHERE pa."Id" IN (501, 502, 503, 505)
  AND pai."IsPrimary" = true
ORDER BY pa."Id";
