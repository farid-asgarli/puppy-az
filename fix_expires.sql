-- Fix incorrect ExpiresAt values (should be CreatedAt + 30 days)
UPDATE "PetAds"
SET "ExpiresAt" = "CreatedAt" + INTERVAL '30 days'
WHERE "ExpiresAt" IS NOT NULL 
  AND "ExpiresAt" < '3000-01-01'
  AND "ExpiresAt" > "CreatedAt" + INTERVAL '31 days';

-- Show results after update
SELECT COUNT(*) as fixed_count FROM "PetAds" 
WHERE "ExpiresAt" IS NOT NULL 
  AND "ExpiresAt" < '3000-01-01'
  AND "ExpiresAt" > "CreatedAt" + INTERVAL '31 days';
