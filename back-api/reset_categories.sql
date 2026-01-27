-- Reset pet categories to clean state for re-seeding
BEGIN;

-- Delete all pet ads first (foreign key constraint)
DELETE FROM "PetAds";

-- Delete all pet breeds
DELETE FROM "PetBreeds";

-- Delete all breed localizations
DELETE FROM "PetBreedLocalizations";

-- Delete all pet categories
DELETE FROM "PetCategories";

-- Delete all category localizations
DELETE FROM "PetCategoryLocalizations";

COMMIT;
