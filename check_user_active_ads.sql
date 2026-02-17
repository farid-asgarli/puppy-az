-- Check user's active ads

-- First, get user ID from recent ad
SELECT DISTINCT "UserId" 
FROM "PetAds" 
WHERE "UserId" IS NOT NULL 
  AND "IsDeleted" = false
LIMIT 5;

-- Check ads for a specific user (replace with actual UserId from above)
SELECT "Id", "Title", "Status", "UserId", "IsDeleted", "IsAvailable", "PublishedAt", "ExpiresAt"
FROM "PetAds"
WHERE "UserId" = '697f0936-1165-424c-b1d1-bf680ecb005e'  -- Replace with your user ID
  AND "IsDeleted" = false
ORDER BY "CreatedAt" DESC
LIMIT 10;

-- Check if there are active ads (Status=1)
SELECT "Id", "Title", "Status", "UserId", "PublishedAt"
FROM "PetAds"
WHERE "UserId" = '697f0936-1165-424c-b1d1-bf680ecb005e'  -- Replace with your user ID
  AND "IsDeleted" = false
  AND "Status" = 1  -- Published status
ORDER BY "PublishedAt" DESC NULLS LAST;
