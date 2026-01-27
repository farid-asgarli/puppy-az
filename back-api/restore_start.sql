-- Step 1: Disable FK constraints temporarily
ALTER TABLE "PetAds" DROP CONSTRAINT IF EXISTS "FK_PetAds_PetBreeds_PetBreedId";
ALTER TABLE "PetBreedLocalizations" DROP CONSTRAINT IF EXISTS "FK_PetBreedLocalizations_PetBreeds_PetBreedId";

-- Step 2: Reset sequences
SELECT setval('"PetBreeds_Id_seq"', 1, false);
SELECT setval('"PetAds_Id_seq"', 1, false);

-- Step 3: PetBreeds data will come from COPY
