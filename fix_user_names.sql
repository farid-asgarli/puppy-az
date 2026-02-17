-- Fix corrupted user names in RegularUsers table
-- Using hex byte escape sequences to ensure UTF-8 chars are written correctly

-- Record 1: Nigar Hüseynova
-- ln_hex: 483f3f3f3f3f733f3f3f3f3f6e6f7661 → Hüseynova
UPDATE "RegularUsers" 
SET "LastName" = E'H\xc3\xbcseynova' 
WHERE "Id" = '47621ad0-d695-4b55-8aa8-aa2ab917a2e1';

-- Record 2: Elçin Əliyev
-- fn_hex: 456c3f3f3f3f3f696e → Elçin
-- ln_hex: 3f3f3f3f3f6c69796576 → Əliyev
UPDATE "RegularUsers" 
SET "FirstName" = E'El\xc3\xa7in', "LastName" = E'\xc6\x8fliyev' 
WHERE "Id" = '5af1a379-7e65-4380-bd57-0d9e157d4f90';

-- Record 3: Ayşən Məmmədova
-- fn_hex: 41793f3f3f3f3f3f3f3f3f3f → Ayşən
-- ln_hex: 4d3f3f3f3f3f6d6d3f3f3f3f3f646f7661 → Məmmədova
UPDATE "RegularUsers" 
SET "FirstName" = E'Ay\xc5\x9f\xc9\x99n', "LastName" = E'M\xc9\x99mm\xc9\x99dova' 
WHERE "Id" = '699e74e7-042d-436b-b332-53b80a0f0937';
