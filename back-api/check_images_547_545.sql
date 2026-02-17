SELECT pa."Id", pa."Title", pa."Status", pai."Id" as "ImageId", pai."FilePath", pai."IsPrimary", pai."PetAdId", pai."AttachedAt"
FROM "PetAds" pa
LEFT JOIN "PetAdImages" pai ON pai."PetAdId" = pa."Id"
WHERE pa."Id" IN (545, 546, 547)
ORDER BY pa."Id", pai."Id";
