-- Check sample image data
SELECT 
    pai."Id",
    pai."PetAdId",
    pai."FilePath",
    pai."FileName",
    pai."IsPrimary",
    pa."Title"
FROM "PetAdImages" pai
JOIN "PetAds" pa ON pai."PetAdId" = pa."Id"
WHERE pa."Id" IN (1, 2, 3, 4, 5)
ORDER BY pai."PetAdId", pai."IsPrimary" DESC
LIMIT 10;
