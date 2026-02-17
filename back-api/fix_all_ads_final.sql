-- Fix all ads: set them to Published and extend expiration far into future
UPDATE "PetAds"
SET 
    "Status" = 1,
    "ExpiresAt" = '2027-12-31',  -- Far future date
    "PublishedAt" = COALESCE("PublishedAt", "CreatedAt"),
    "UpdatedAt" = NOW()
WHERE NOT "IsDeleted";

-- Show result
SELECT 
    "Status",
    COUNT(*) as count,
    CASE 
        WHEN "Status" = 0 THEN 'Pending'
        WHEN "Status" = 1 THEN 'Published'
        WHEN "Status" = 3 THEN 'Expired'
    END as status_name
FROM "PetAds" 
WHERE NOT "IsDeleted"
GROUP BY "Status";
