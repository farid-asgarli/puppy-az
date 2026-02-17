-- Publish all ads and seed static sections

BEGIN;

-- 1. Update all pending ads to Published status
UPDATE "PetAds"
SET 
    "Status" = 1,  -- Published
    "PublishedAt" = COALESCE("PublishedAt", "CreatedAt"),
    "UpdatedAt" = NOW()
WHERE 
    "Status" = 0  -- Pending
    AND NOT "IsDeleted";

-- Show published ads count
SELECT 
    COUNT(*) as total_published_ads
FROM "PetAds" 
WHERE "Status" = 1 AND NOT "IsDeleted";

COMMIT;
