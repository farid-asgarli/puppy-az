-- Check database state
SELECT 
    (SELECT COUNT(*) FROM "PetAds" WHERE NOT "IsDeleted") as active_ads,
    (SELECT COUNT(*) FROM "PetAds") as total_ads,
    (SELECT COUNT(*) FROM "PetBreeds") as breeds,
    (SELECT COUNT(*) FROM "PetCategories") as categories,
    (SELECT COUNT(*) FROM "Cities") as cities,
    (SELECT COUNT(*) FROM "RegularUsers") as users;
