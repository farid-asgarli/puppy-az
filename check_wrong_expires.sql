-- Check if any records still have incorrect ExpiresAt values
SELECT COUNT(*) as wrong_count FROM "PetAds" 
WHERE "ExpiresAt" IS NOT NULL 
  AND "ExpiresAt" < '3000-01-01'
  AND "ExpiresAt" > "CreatedAt" + INTERVAL '31 days';
