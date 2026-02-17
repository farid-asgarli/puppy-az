-- Update PetAdTypes with Tailwind classes instead of HEX colors
UPDATE "PetAdTypes" 
SET 
  "BackgroundColor" = 'bg-amber-50',
  "TextColor" = 'text-amber-700',
  "BorderColor" = 'border-amber-400'
WHERE "Key" = 'sale';

UPDATE "PetAdTypes" 
SET 
  "BackgroundColor" = 'bg-pink-50',
  "TextColor" = 'text-pink-700',
  "BorderColor" = 'border-pink-400'
WHERE "Key" = 'match';

UPDATE "PetAdTypes" 
SET 
  "BackgroundColor" = 'bg-blue-50',
  "TextColor" = 'text-blue-700',
  "BorderColor" = 'border-blue-400'
WHERE "Key" = 'found';

UPDATE "PetAdTypes" 
SET 
  "BackgroundColor" = 'bg-red-50',
  "TextColor" = 'text-red-700',
  "BorderColor" = 'border-red-400'
WHERE "Key" = 'lost';

UPDATE "PetAdTypes" 
SET 
  "BackgroundColor" = 'bg-green-50',
  "TextColor" = 'text-green-700',
  "BorderColor" = 'border-green-400'
WHERE "Key" = 'owning';

-- Verify
SELECT "Id", "Key", "BackgroundColor", "TextColor", "BorderColor" 
FROM "PetAdTypes" 
ORDER BY "SortOrder";
