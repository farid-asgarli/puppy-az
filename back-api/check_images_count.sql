-- Check total images
SELECT COUNT(*) as total_images FROM "PetAdImages";

-- Find ads with images
SELECT 
    pa."Id",
    pa."Title",
    COUNT(pai."Id") as image_count
FROM "PetAds" pa
LEFT JOIN "PetAdImages" pai ON pa."Id" = pai."PetAdId"
WHERE pa."Status" = 1
GROUP BY pa."Id", pa."Title"
HAVING COUNT(pai."Id") > 0
LIMIT 10;
