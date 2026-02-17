-- Find ads with missing image files (pet-ads folder)
SELECT 
    pa."Id",
    pa."Title",
    pai."FilePath",
    pai."FileName"
FROM "PetAds" pa
JOIN "PetAdImages" pai ON pa."Id" = pai."PetAdId"
WHERE pai."FilePath" LIKE '/uploads/pet-ads/%'
  AND pa."Status" = 1
  AND pa."IsAvailable" = true
  AND pai."IsPrimary" = true
ORDER BY pa."Id"
LIMIT 20;
