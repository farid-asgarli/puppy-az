-- Fix sequences after data restore
SELECT setval('"PetBreeds_Id_seq"', (SELECT MAX("Id") FROM "PetBreeds"));
SELECT setval('"PetAds_Id_seq"', (SELECT MAX("Id") FROM "PetAds"));
SELECT setval('"PetBreedLocalizations_Id_seq"', (SELECT MAX("Id") FROM "PetBreedLocalizations"));

-- Verify counts
SELECT 'PetAds' as table_name, COUNT(*) as count FROM "PetAds"
UNION ALL
SELECT 'PetBreeds', COUNT(*) FROM "PetBreeds"
UNION ALL
SELECT 'PetBreedLocalizations', COUNT(*) FROM "PetBreedLocalizations"
UNION ALL
SELECT 'PetCategories', COUNT(*) FROM "PetCategories";
