-- Convert Closed (4) to Expired (3)
UPDATE "PetAds" SET "Status" = 3 WHERE "Status" = 4;

-- Check result
SELECT "Status", COUNT(*) as count FROM "PetAds" GROUP BY "Status" ORDER BY "Status";
