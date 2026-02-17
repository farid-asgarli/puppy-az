-- Check status distribution
SELECT "Status", COUNT(*) as count
FROM "PetAds" 
WHERE NOT "IsDeleted"
GROUP BY "Status"
ORDER BY "Status";
