-- Fix missing images for ads 501, 502, 503, 505 by pointing to seed photos
UPDATE "PetAdImages"
SET "FilePath" = '/uploads/seed_photo/pexels-pixabay-45170.jpg'
WHERE "PetAdId" = 501;

UPDATE "PetAdImages"
SET "FilePath" = '/uploads/seed_photo/pexels-pixabay-416160.jpg'
WHERE "PetAdId" = 502;

UPDATE "PetAdImages"
SET "FilePath" = '/uploads/seed_photo/pexels-pixabay-158471.jpg'
WHERE "PetAdId" = 503;

UPDATE "PetAdImages"
SET "FilePath" = '/uploads/seed_photo/pexels-pixabay-86596.jpg'
WHERE "PetAdId" = 505;

-- Verify the fixes
SELECT pa."Id", pa."Title", pai."FilePath"
FROM "PetAds" pa
JOIN "PetAdImages" pai ON pa."Id" = pai."PetAdId"
WHERE pa."Id" IN (501, 502, 503, 505)
  AND pai."IsPrimary" = true;
