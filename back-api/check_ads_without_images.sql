-- Check ads without any images
SELECT COUNT(*) as ads_without_images 
FROM "PetAds" pa 
WHERE pa."Status" = 1 
  AND pa."IsAvailable" = true 
  AND NOT EXISTS (
    SELECT 1 
    FROM "PetAdImages" pai 
    WHERE pai."PetAdId" = pa."Id"
  );

-- List ads without images
SELECT pa."Id", pa."Title" 
FROM "PetAds" pa 
WHERE pa."Status" = 1 
  AND pa."IsAvailable" = true 
  AND NOT EXISTS (
    SELECT 1 
    FROM "PetAdImages" pai 
    WHERE pai."PetAdId" = pa."Id"
  )
LIMIT 10;
