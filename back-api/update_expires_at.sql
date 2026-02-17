-- Fix missing ExpiresAt for all existing pet ads
-- ExpiresAt should be 30 days after CreatedAt

-- First, check how many ads are affected
SELECT COUNT(*) AS 'Ads without ExpiresAt' 
FROM PetAds 
WHERE ExpiresAt IS NULL AND IsDeleted = 0;

-- Update all ads that don't have ExpiresAt set
-- Set ExpiresAt to 30 days after CreatedAt
UPDATE PetAds
SET ExpiresAt = DATEADD(DAY, 30, CreatedAt)
WHERE ExpiresAt IS NULL;

-- Verify the update
SELECT 
    COUNT(*) AS 'Total Ads',
    SUM(CASE WHEN ExpiresAt IS NULL THEN 1 ELSE 0 END) AS 'Still NULL',
    SUM(CASE WHEN ExpiresAt IS NOT NULL THEN 1 ELSE 0 END) AS 'Has ExpiresAt'
FROM PetAds
WHERE IsDeleted = 0;
