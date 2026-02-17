SELECT column_name FROM information_schema.columns WHERE table_name='PetAds' ORDER BY ordinal_position;
SELECT table_name FROM information_schema.tables WHERE table_name IN ('Districts','BreedSuggestions') AND table_schema='public';
