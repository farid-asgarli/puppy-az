SELECT "Id", 
       "ExpiresAt"::date as expires, 
       "CreatedAt"::date as created, 
       ("ExpiresAt"::date - "CreatedAt"::date) as days_diff 
FROM "PetAds" 
WHERE "ExpiresAt" IS NOT NULL 
ORDER BY "Id" DESC 
LIMIT 10;
