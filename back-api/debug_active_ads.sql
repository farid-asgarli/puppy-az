-- Check all ads with their status
SELECT 
    "Id",
    "Title",
    "Status",
    "IsAvailable",
    "IsDeleted",
    "ExpiresAt",
    "PublishedAt"
FROM "PetAds"
WHERE "IsDeleted" = false
ORDER BY "Id" DESC
LIMIT 10;

-- Check specifically status = 1 (Published)
SELECT 
    "Id",
    "Title",
    "Status",
    "IsAvailable",
    "ExpiresAt" > NOW() as "NotExpired",
    "PublishedAt"
FROM "PetAds"
WHERE "Status" = 1 
  AND "IsDeleted" = false
ORDER BY "Id" DESC
LIMIT 10;

-- Check what might be filtering them out
SELECT 
    "Id",
    "Title",
    "Status",
    "IsAvailable",
    "IsDeleted",
    "ExpiresAt",
    "ExpiresAt" < NOW() as "IsExpired",
    "PublishedAt"
FROM "PetAds"
WHERE "Status" = 1 
ORDER BY "Id" DESC
LIMIT 5;
