-- Check status of user's ads
SELECT "Id", "Title", "Status", "PublishedAt", "IsAvailable"
FROM "PetAds"
WHERE "IsDeleted" = false
ORDER BY "Id" DESC
LIMIT 20;

-- Count ads by status
SELECT "Status", COUNT(*) 
FROM "PetAds" 
WHERE "IsDeleted" = false 
GROUP BY "Status";

-- Update ads to Published status if they should be active
-- Status = 1 means Published
UPDATE "PetAds"
SET "Status" = 1,
    "PublishedAt" = COALESCE("PublishedAt", NOW()),
    "UpdatedAt" = NOW()
WHERE "IsDeleted" = false
  AND "IsAvailable" = true
  AND ("Status" != 1 OR "PublishedAt" IS NULL);

-- Verify the update
SELECT "Status", COUNT(*) 
FROM "PetAds" 
WHERE "IsDeleted" = false 
GROUP BY "Status";
