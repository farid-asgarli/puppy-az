-- Find all published ads and their primary images
SELECT 
    pa."Id",
    pa."Title",
    pai."FilePath",
    CASE 
        WHEN pai."FilePath" IS NULL THEN 'NO_IMAGE'
        WHEN pai."FilePath" = '' THEN 'EMPTY_PATH'
        WHEN pai."FilePath" LIKE '/uploads/pet-ads/%' THEN 'USER_UPLOAD'
        WHEN pai."FilePath" LIKE '/uploads/seed_photo/%' THEN 'SEED_PHOTO'
        ELSE 'OTHER'
    END as image_type
FROM "PetAds" pa
LEFT JOIN "PetAdImages" pai ON pa."Id" = pai."PetAdId" AND pai."IsPrimary" = true
WHERE pa."Status" = 1 AND pa."IsAvailable" = true
ORDER BY pa."Id"
LIMIT 30;

-- Count by image type
SELECT 
    CASE 
        WHEN pai."FilePath" IS NULL THEN 'NO_IMAGE'
        WHEN pai."FilePath" = '' THEN 'EMPTY_PATH'
        WHEN pai."FilePath" LIKE '/uploads/pet-ads/%' THEN 'USER_UPLOAD'
        WHEN pai."FilePath" LIKE '/uploads/seed_photo/%' THEN 'SEED_PHOTO'
        ELSE 'OTHER'
    END as image_type,
    COUNT(*) as count
FROM "PetAds" pa
LEFT JOIN "PetAdImages" pai ON pa."Id" = pai."PetAdId" AND pai."IsPrimary" = true
WHERE pa."Status" = 1 AND pa."IsAvailable" = true
GROUP BY image_type
ORDER BY count DESC;
