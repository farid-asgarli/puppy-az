-- Verify database data integrity

-- Check total PetAds
SELECT COUNT(*) as total_ads FROM "PetAds";

-- Check active PetAds
SELECT COUNT(*) as active_ads 
FROM "PetAds" 
WHERE "Status" = 1 AND NOT "IsDeleted";

-- Check breed linkage
SELECT 
    COUNT(*) as ads_with_breeds,
    COUNT(DISTINCT "PetBreedId") as unique_breeds
FROM "PetAds" 
WHERE NOT "IsDeleted";

-- Check if PetBreeds exist
SELECT COUNT(*) as total_breeds FROM "PetBreeds";

-- Check if PetBreeds have category references
SELECT 
    COUNT(*) as breeds_with_categories,
    COUNT(DISTINCT "PetCategoryId") as unique_categories
FROM "PetBreeds" 
WHERE NOT "IsDeleted";

-- Sample ads with breed info
SELECT 
    pa."Id",
    pa."Title",
    pa."Status",
    pa."PetBreedId",
    pb."Id" as breed_exists,
    pb."PetCategoryId" as category_id
FROM "PetAds" pa
LEFT JOIN "PetBreeds" pb ON pa."PetBreedId" = pb."Id"
WHERE NOT pa."IsDeleted"
LIMIT 5;
