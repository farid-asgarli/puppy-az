-- Update all pending ads to Published status
-- Status: 0 = Pending, 1 = Published, 2 = Rejected, 3 = Expired

BEGIN;

-- Update all ads to Published status
UPDATE "PetAds"
SET 
    "Status" = 1,  -- Published
    "PublishedAt" = COALESCE("PublishedAt", "CreatedAt"),  -- Set PublishedAt if not set
    "UpdatedAt" = NOW()
WHERE 
    "Status" = 0  -- Only update Pending ads
    AND NOT "IsDeleted";

-- Show results
SELECT 
    COUNT(*) as total_published_ads,
    COUNT(CASE WHEN "Status" = 1 THEN 1 END) as published_count
FROM "PetAds" 
WHERE NOT "IsDeleted";

COMMIT;
