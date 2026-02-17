-- Restore ads back to their original Pending status
BEGIN;

-- Restore recently published ads back to Pending
UPDATE "PetAds"
SET 
    "Status" = 0,  -- Pending
    "PublishedAt" = NULL,
    "UpdatedAt" = NOW()
WHERE 
    "Status" = 1  -- Published
    AND NOT "IsDeleted";

-- Show results
SELECT 
    "Status", 
    COUNT(*) as count,
    CASE 
        WHEN "Status" = 0 THEN 'Pending'
        WHEN "Status" = 1 THEN 'Published'
        WHEN "Status" = 2 THEN 'Rejected'
        WHEN "Status" = 3 THEN 'Expired'
    END as status_name
FROM "PetAds" 
WHERE NOT "IsDeleted"
GROUP BY "Status"
ORDER BY "Status";

COMMIT;
