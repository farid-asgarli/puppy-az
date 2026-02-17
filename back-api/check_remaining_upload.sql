SELECT 
    pa."Id", 
    pa."Title", 
    pai."FilePath"
FROM "PetAds" pa 
JOIN "PetAdImages" pai ON pa."Id" = pai."PetAdId"
WHERE pai."IsPrimary" = true 
  AND pai."FilePath" LIKE '/uploads/pet-ads/%' 
  AND pa."Status" = 1 
  AND pa."IsAvailable" = true;
