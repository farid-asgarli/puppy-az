-- Fix description encoding issues
-- Replace corrupted characters with correct Azerbaijani characters

UPDATE "PetAds" SET "Description" = REPLACE("Description", '??ox', 'Çox') WHERE "Description" LIKE '%??ox%';
UPDATE "PetAds" SET "Description" = REPLACE("Description", '??ox', 'çox') WHERE "Description" LIKE '%??ox%';
UPDATE "PetAds" SET "Description" = REPLACE("Description", 'U??aq', 'Uşaq') WHERE "Description" LIKE '%U??aq%';
UPDATE "PetAds" SET "Description" = REPLACE("Description", 'u??aq', 'uşaq') WHERE "Description" LIKE '%u??aq%';
UPDATE "PetAds" SET "Description" = REPLACE("Description", '??lad??r', 'əladır') WHERE "Description" LIKE '%??lad??r%';
UPDATE "PetAds" SET "Description" = REPLACE("Description", 'Ail??', 'Ailə') WHERE "Description" LIKE '%Ail??%';
UPDATE "PetAds" SET "Description" = REPLACE("Description", 'ail??', 'ailə') WHERE "Description" LIKE '%ail??%';
UPDATE "PetAds" SET "Description" = REPLACE("Description", '??????n', 'üçün') WHERE "Description" LIKE '%??????n%';
UPDATE "PetAds" SET "Description" = REPLACE("Description", 'il??', 'ilə') WHERE "Description" LIKE '%il??%';
UPDATE "PetAds" SET "Description" = REPLACE("Description", 'qalma????', 'qalmağı') WHERE "Description" LIKE '%qalma????%';
UPDATE "PetAds" SET "Description" = REPLACE("Description", 't??k', 'tək') WHERE "Description" LIKE '%t??k%';
UPDATE "PetAds" SET "Description" = REPLACE("Description", 'sevmir', 'sevmir') WHERE "Description" LIKE '%sevmir%';
UPDATE "PetAds" SET "Description" = REPLACE("Description", 'Sa??lam', 'Sağlam') WHERE "Description" LIKE '%Sa??lam%';
UPDATE "PetAds" SET "Description" = REPLACE("Description", 'sa??lam', 'sağlam') WHERE "Description" LIKE '%sa??lam%';
UPDATE "PetAds" SET "Description" = REPLACE("Description", 'axtar??rs??n??zsa', 'axtarırsınızsa') WHERE "Description" LIKE '%axtar??rs??n??zsa%';
UPDATE "PetAds" SET "Description" = REPLACE("Description", 'se??iminizdir', 'seçiminizdir') WHERE "Description" LIKE '%se??iminizdir%';
UPDATE "PetAds" SET "Description" = REPLACE("Description", 'G??z??l', 'Gözəl') WHERE "Description" LIKE '%G??z??l%';
UPDATE "PetAds" SET "Description" = REPLACE("Description", 'g??z??l', 'gözəl') WHERE "Description" LIKE '%g??z??l%';
UPDATE "PetAds" SET "Description" = REPLACE("Description", 'xasiyy??ti', 'xasiyyəti') WHERE "Description" LIKE '%xasiyy??ti%';
UPDATE "PetAds" SET "Description" = REPLACE("Description", 't??rbiy??lidir', 'tərbiyəlidir') WHERE "Description" LIKE '%t??rbiy??lidir%';
UPDATE "PetAds" SET "Description" = REPLACE("Description", 'ita??tkard??r', 'itaətkardır') WHERE "Description" LIKE '%ita??tkard??r%';
UPDATE "PetAds" SET "Description" = REPLACE("Description", 'anla????r', 'anlaşır') WHERE "Description" LIKE '%anla????r%';
UPDATE "PetAds" SET "Description" = REPLACE("Description", 'mehriban', 'mehriban') WHERE "Description" LIKE '%mehriban%';
UPDATE "PetAds" SET "Description" = REPLACE("Description", 'sadiqdir', 'sadiqdir') WHERE "Description" LIKE '%sadiqdir%';
UPDATE "PetAds" SET "Description" = REPLACE("Description", 'oyna??ma????', 'oynamağı') WHERE "Description" LIKE '%oyna??ma????%';
UPDATE "PetAds" SET "Description" = REPLACE("Description", 'sevir', 'sevir') WHERE "Description" LIKE '%sevir%';
UPDATE "PetAds" SET "Description" = REPLACE("Description", 'yax????', 'yaxşı') WHERE "Description" LIKE '%yax????%';
UPDATE "PetAds" SET "Description" = REPLACE("Description", 'enerjili', 'enerjili') WHERE "Description" LIKE '%enerjili%';
UPDATE "PetAds" SET "Description" = REPLACE("Description", 'dost', 'dost') WHERE "Description" LIKE '%dost%';

-- More general replacements for remaining ?? patterns
UPDATE "PetAds" SET "Description" = REPLACE("Description", '??', 'ə') WHERE "Description" LIKE '%??%';

-- Verify
SELECT "Id", "Description" FROM "PetAds" WHERE "Id" = 309;
