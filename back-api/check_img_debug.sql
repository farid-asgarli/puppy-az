SELECT pa."Id" as ad_id, pa."Title", pa."Status",
       pai."Id" as img_id, pai."FilePath", pai."IsPrimary", pai."FileName", pai."ContentType"
FROM "PetAds" pa
LEFT JOIN "PetAdImages" pai ON pa."Id" = pai."PetAdId"
WHERE pa."Id" IN (547, 545, 546)
ORDER BY pa."Id" DESC, pai."IsPrimary" DESC, pai."Id";
