-- Reactivate all expired ads
BEGIN;

-- Update expired ads to Published and extend expiration
UPDATE "PetAds"
SET 
    "Status" = 1,  -- Published
    "ExpiresAt" = NOW() + INTERVAL '90 days',  -- Extend for 90 days
    "UpdatedAt" = NOW()
WHERE 
    "Status" = 3  -- Expired
    AND NOT "IsDeleted";

-- Show final results
SELECT 
    'Published' as status_name,
    COUNT(*) as count
FROM "PetAds" 
WHERE "Status" = 1 AND NOT "IsDeleted"
UNION ALL
SELECT 
    'Total Active' as status_name,
    COUNT(*) as count
FROM "PetAds" 
WHERE NOT "IsDeleted";

COMMIT;
