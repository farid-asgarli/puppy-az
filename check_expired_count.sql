-- Check how many ads have expired (ExpiresAt < now())
SELECT 
    COUNT(*) FILTER (WHERE "ExpiresAt" < NOW()) as expired_count,
    COUNT(*) FILTER (WHERE "ExpiresAt" >= NOW()) as active_count,
    COUNT(*) as total_count
FROM "PetAds" 
WHERE "ExpiresAt" IS NOT NULL;
