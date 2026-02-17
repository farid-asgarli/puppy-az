-- Check which ads have images
SELECT 
    pa."Id",
    pa."Title",
    COUNT(pai."Id") as image_count,
    STRING_AGG(pai."Url", ', ') as urls
FROM "PetAds" pa
LEFT JOIN "PetAdImages" pai ON pa."Id" = pai."PetAdId"
WHERE pa."Status" = 1 AND pa."IsAvailable" = true
GROUP BY pa."Id", pa."Title"
ORDER BY pa."Id"
LIMIT 10;
