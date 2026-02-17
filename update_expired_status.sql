-- Update Status to 'Expired' (4) for ads where ExpiresAt has passed and status is Active (1)
UPDATE "PetAds"
SET "Status" = 4
WHERE "ExpiresAt" IS NOT NULL 
  AND "ExpiresAt" < NOW()
  AND "Status" = 1;

-- Show count of each status after update
SELECT 
    "Status",
    CASE "Status"
        WHEN 0 THEN 'Draft'
        WHEN 1 THEN 'Active'
        WHEN 2 THEN 'Pending'
        WHEN 3 THEN 'Rejected'
        WHEN 4 THEN 'Expired'
        ELSE 'Unknown'
    END as status_name,
    COUNT(*) as count
FROM "PetAds"
GROUP BY "Status"
ORDER BY "Status";
