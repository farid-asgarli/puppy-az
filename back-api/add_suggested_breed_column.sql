-- Add SuggestedBreedName column to PetAds table
-- This allows users to submit ads with a suggested breed name when no existing breed matches

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'PetAds' AND column_name = 'SuggestedBreedName'
    ) THEN
        ALTER TABLE "PetAds" ADD COLUMN "SuggestedBreedName" VARCHAR(100) NULL;
        RAISE NOTICE 'Column SuggestedBreedName added to PetAds table';
    ELSE
        RAISE NOTICE 'Column SuggestedBreedName already exists in PetAds table';
    END IF;
END $$;
