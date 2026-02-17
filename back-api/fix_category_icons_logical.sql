-- Update category icons to be logical and matching

-- 1. İtlər (Dogs) - dog icon ✓ (already correct)
UPDATE "PetCategories" 
SET "SvgIcon" = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tabler-icon tabler-icon-dog"><path d="M11 5h2"></path><path d="M19 12c-.667 5.333 -2.333 8 -5 8h-4c-2.667 0 -4.333 -2.667 -5 -8"></path><path d="M11 16c0 .667 .333 1 1 1s1 -.333 1 -1h-2z"></path><path d="M12 18v2"></path><path d="M10 11v.01"></path><path d="M14 11v.01"></path><path d="M5 4l6 .97l-6.238 6.688a1.021 1.021 0 0 1 -1.41 .111a.953 .953 0 0 1 -.327 -.954l1.975 -6.815z"></path><path d="M19 4l-6 .97l6.238 6.688c.358 .408 .989 .458 1.41 .111a.953 .953 0 0 0 .327 -.954l-1.975 -6.815z"></path></svg>'
WHERE "Id" = 1;

-- 2. Pişiklər (Cats) - cat icon ✓ (already correct)
UPDATE "PetCategories" 
SET "SvgIcon" = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tabler-icon tabler-icon-cat"><path d="M20 3v10a8 8 0 1 1 -16 0v-10l3.432 3.432a7.963 7.963 0 0 1 4.568 -1.432c1.769 0 3.403 .574 4.728 1.546l3.272 -3.546z"></path><path d="M2 16h5l-4 4"></path><path d="M22 16h-5l4 4"></path><path d="M12 16m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path><path d="M9 11v.01"></path><path d="M15 11v.01"></path></svg>'
WHERE "Id" = 2;

-- 3. Quşlar (Birds) - feather/bird icon (currently egg - WRONG!)
UPDATE "PetCategories" 
SET "SvgIcon" = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tabler-icon tabler-icon-feather"><path d="M4 20l10 -10m0 -5v5h5m-9 -1v5h5m-9 -1v5h5m-5 -5l4 -4l4 -4"></path><path d="M19 10c.638 -.636 1 -1.515 1 -2.486a3.515 3.515 0 0 0 -3.517 -3.514c-.97 0 -1.847 .367 -2.483 1m-3 13l4 -4l4 -4"></path></svg>'
WHERE "Id" = 3;

-- 4. Balıqlar (Fish) - fish icon ✓ (already correct)
UPDATE "PetCategories" 
SET "SvgIcon" = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tabler-icon tabler-icon-fish"><path d="M16.69 7.44a6.973 6.973 0 0 0 -1.69 4.56c0 1.747 .64 3.345 1.699 4.571"></path><path d="M2 9.504c7.715 8.647 14.75 10.265 20 2.498c-5.25 -7.761 -12.285 -6.142 -20 2.504"></path><path d="M18 11v.01"></path><path d="M11.5 10.5c-.667 1 -.667 2 0 3"></path></svg>'
WHERE "Id" = 4;

-- 5. Sürünənlər (Reptiles) - lizard icon (currently fish - WRONG!)
UPDATE "PetCategories" 
SET "SvgIcon" = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tabler-icon tabler-icon-lizard"><path d="M6 3l-3 9h4l-2 9l13 -9h-4l2 -9z"></path></svg>'
WHERE "Id" = 5;

-- 6. Həşəratlar (Insects) - bug icon (currently asterisk - WRONG!)
UPDATE "PetCategories" 
SET "SvgIcon" = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tabler-icon tabler-icon-bug"><path d="M9 9v-1a3 3 0 0 1 6 0v1"></path><path d="M8 9h8a6 6 0 0 1 1 3v3a5 5 0 0 1 -10 0v-3a6 6 0 0 1 1 -3"></path><path d="M3 13l4 0"></path><path d="M17 13l4 0"></path><path d="M12 20l0 -6"></path><path d="M4 19l3.35 -2"></path><path d="M20 19l-3.35 -2"></path><path d="M4 7l3.75 2.4"></path><path d="M20 7l-3.75 2.4"></path></svg>'
WHERE "Id" = 6;

-- 7. Ferma heyvanları (Farm animals) - cow icon (currently backpack/house - WRONG!)
UPDATE "PetCategories" 
SET "SvgIcon" = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tabler-icon tabler-icon-cow"><path d="M8 2l1.5 1.5"></path><path d="M16 2l-1.5 1.5"></path><path d="M9 18h6"></path><path d="M9 12m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"></path><path d="M8 10m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path><path d="M16 10m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path></svg>'
WHERE "Id" = 7;

-- 8. Gəmiricilər (Rodents) - mouse icon (currently horse - WRONG!)
UPDATE "PetCategories" 
SET "SvgIcon" = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tabler-icon tabler-icon-mouse"><path d="M7 7l5 -5l5 5"></path><path d="M9 13a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path><path d="M12 7v6"></path><path d="M6 10h12"></path></svg>'
WHERE "Id" = 8;

-- 9. Vəhşi heyvanlar (Wild animals) - paw icon (currently egg - WRONG!)
UPDATE "PetCategories" 
SET "SvgIcon" = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tabler-icon tabler-icon-paw"><path d="M14.7 13.5c-1.1 -2 -1.441 -2.5 -2.7 -2.5c-1.259 0 -1.736 .755 -2.836 2.747c-.942 1.703 -2.846 1.845 -3.321 3.291c-.097 .265 -.145 .677 -.143 .962c0 1.176 .787 2 1.8 2c1.259 0 3 -1 4.5 -1s3.241 1 4.5 1c1.013 0 1.8 -.823 1.8 -2c0 -.285 -.049 -.697 -.146 -.962c-.475 -1.451 -2.512 -1.835 -3.454 -3.538z"></path><path d="M20.188 8.082a1.039 1.039 0 0 0 -.406 -.082h-.015c-.735 .012 -1.56 .75 -1.993 1.866c-.519 1.335 -.28 2.7 .538 3.052c.129 .055 .267 .082 .406 .082c.739 0 1.575 -.742 2.011 -1.866c.516 -1.335 .273 -2.7 -.54 -3.052z"></path><path d="M9.474 9c.055 0 .109 0 .163 -.011c.944 -.128 1.533 -1.346 1.32 -2.722c-.203 -1.297 -1.047 -2.267 -1.932 -2.267c-.055 0 -.109 0 -.163 .011c-.944 .128 -1.533 1.346 -1.32 2.722c.204 1.293 1.048 2.267 1.933 2.267z"></path><path d="M16.456 6.733c.214 -1.376 -.375 -2.594 -1.32 -2.722a1.164 1.164 0 0 0 -.162 -.011c-.885 0 -1.728 .97 -1.93 2.267c-.214 1.376 .375 2.594 1.32 2.722c.054 .007 .108 .011 .162 .011c.885 0 1.73 -.974 1.93 -2.267z"></path><path d="M5.69 12.918c.816 -.352 1.054 -1.719 .536 -3.052c-.436 -1.124 -1.271 -1.866 -2.009 -1.866c-.14 0 -.277 .027 -.407 .082c-.816 .352 -1.054 1.719 -.536 3.052c.436 1.124 1.271 1.866 2.009 1.866c.14 0 .277 -.027 .407 -.082z"></path></svg>'
WHERE "Id" = 9;

-- 10. Digər (Other) - diamond/sparkles icon ✓ (acceptable for "other")
UPDATE "PetCategories" 
SET "SvgIcon" = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tabler-icon tabler-icon-diamond"><path d="M6 5h12l3 5l-8.5 9.5a.7 .7 0 0 1 -1 0l-8.5 -9.5l3 -5"></path><path d="M10 12l-2 -2.2l.6 -1"></path></svg>'
WHERE "Id" = 10;

-- Verify
SELECT 
    pc."Id",
    pcl."Title",
    CASE 
        WHEN pc."SvgIcon" LIKE '%dog%' THEN 'dog'
        WHEN pc."SvgIcon" LIKE '%cat%' THEN 'cat'
        WHEN pc."SvgIcon" LIKE '%feather%' THEN 'feather'
        WHEN pc."SvgIcon" LIKE '%fish%' THEN 'fish'
        WHEN pc."SvgIcon" LIKE '%lizard%' THEN 'lizard'
        WHEN pc."SvgIcon" LIKE '%bug%' THEN 'bug'
        WHEN pc."SvgIcon" LIKE '%cow%' THEN 'cow'
        WHEN pc."SvgIcon" LIKE '%mouse%' THEN 'mouse'
        WHEN pc."SvgIcon" LIKE '%paw%' THEN 'paw'
        WHEN pc."SvgIcon" LIKE '%diamond%' THEN 'diamond'
        ELSE 'other'
    END as "Icon"
FROM "PetCategories" pc
JOIN "PetCategoryLocalizations" pcl ON pc."Id" = pcl."PetCategoryId"
JOIN "AppLocales" al ON pcl."AppLocaleId" = al."Id"
WHERE al."Code" = 'az' AND pc."IsActive" = true
ORDER BY pc."Id";
