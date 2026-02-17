SELECT pa."Id" as ad_id, pai."Id" as img_id, pai."FilePath", pai."IsPrimary"
FROM "PetAds" pa
LEFT JOIN "PetAdImages" pai ON pai."PetAdId" = pa."Id"
WHERE pa."Id" IN (545, 546, 547)
ORDER BY pa."Id", pai."IsPrimary" DESC;
