-- Check what ads actually exist and their details
SELECT 
    "Id",
    "Title",
    "Status",
    "IsAvailable",
    "IsDeleted",
    "UserId",
    "PublishedAt",
    "ExpiresAt" > NOW() as "NotExpired"
FROM "PetAds"
WHERE "Status" = 1 
  AND "IsDeleted" = false
  AND "IsAvailable" = true
ORDER BY "PublishedAt" DESC
LIMIT 10;

-- Check how many we have in each state
SELECT 
    "Status",
    "IsAvailable",
    "IsDeleted",
    COUNT(*) as count
FROM "PetAds"
GROUP BY "Status", "IsAvailable", "IsDeleted"
ORDER BY "Status", "IsAvailable", "IsDeleted";
