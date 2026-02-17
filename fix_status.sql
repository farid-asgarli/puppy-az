-- Fix Status from 4 to 3 (correct Expired enum value)
UPDATE "PetAds" SET "Status" = 3 WHERE "Status" = 4;

-- Show count of each status after update
SELECT 
    "Status",
    CASE "Status"
        WHEN 0 THEN 'Pending'
        WHEN 1 THEN 'Published'
        WHEN 2 THEN 'Rejected'
        WHEN 3 THEN 'Expired'
        WHEN 4 THEN 'Closed'
        ELSE 'Unknown'
    END as status_name,
    COUNT(*) as count
FROM "PetAds"
GROUP BY "Status"
ORDER BY "Status";
