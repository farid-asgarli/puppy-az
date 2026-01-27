-- Reset database and recreate with new 10 categories
BEGIN;

-- Step 1: Delete all pet ads
DELETE FROM "PetAds" WHERE "Id" > 0;

-- Step 2: Delete all pet breed localizations
DELETE FROM "PetBreedLocalizations";

-- Step 3: Delete all pet breeds
DELETE FROM "PetBreeds";

-- Step 4: Delete all pet category localizations
DELETE FROM "PetCategoryLocalizations";

-- Step 5: Delete all pet categories
DELETE FROM "PetCategories";

-- Step 6: Reset sequences
ALTER SEQUENCE "PetCategories_Id_seq" RESTART WITH 1;
ALTER SEQUENCE "PetBreeds_Id_seq" RESTART WITH 1;

-- Step 7: Insert new 10 categories with AZ/EN/RU localizations
-- Get locale IDs
WITH locales AS (
    SELECT id, code FROM "AppLocales" WHERE code IN ('az', 'en', 'ru')
)
INSERT INTO "PetCategories" (
    "SvgIcon", "IconColor", "BackgroundColor", "IsActive", "CreatedAt"
) VALUES
-- 1. Dogs
('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tabler-icon tabler-icon-dog "><path d="M11 5h2"></path><path d="M19 12c-.667 5.333 -2.333 8 -5 8h-4c-2.667 0 -4.333 -2.667 -5 -8"></path><path d="M11 16c0 .667 .333 1 1 1s1 -.333 1 -1h-2z"></path><path d="M12 18v2"></path><path d="M10 11v.01"></path><path d="M14 11v.01"></path><path d="M5 4l6 .97l-6.238 6.688a1.021 1.021 0 0 1 -1.41 .111a.953 .953 0 0 1 -.327 -.954l1.975 -6.815z"></path><path d="M19 4l-6 .97l6.238 6.688c.358 .408 .989 .458 1.41 .111a.953 .953 0 0 0 .327 -.954l-1.975 -6.815z"></path></svg>', 'text-amber-600', 'bg-amber-50', true, NOW()),
-- 2. Cats
('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tabler-icon tabler-icon-cat "><path d="M20 3v10a8 8 0 1 1 -16 0v-10l3.432 3.432a7.963 7.963 0 0 1 4.568 -1.432c1.769 0 3.403 .574 4.728 1.546l3.272 -3.546z"></path><path d="M2 16h5l-4 4"></path><path d="M22 16h-5l4 4"></path><path d="M12 16m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0\"></path><path d="M9 11v.01"></path><path d="M15 11v.01"></path></svg>', 'text-purple-600', 'bg-purple-50', true, NOW()),
-- 3. Birds
('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tabler-icon tabler-icon-feather "><path d="M4 20l10 -10m0 -5v5h5m-9 -1v5h5m-9 -1v5h5m-5 -5l4 -4l4 -4"></path><path d="M19 10c.638 -.636 1 -1.515 1 -2.486a3.515 3.515 0 0 0 -3.517 -3.514c-.97 0 -1.847 .367 -2.483 1m-3 13l4 -4l4 -4"></path></svg>', 'text-sky-600', 'bg-sky-50', true, NOW()),
-- 4. Fish
('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tabler-icon tabler-icon-fish "><path d="M16.69 7.44a6.973 6.973 0 0 0 -1.69 4.56c0 1.747 .64 3.345 1.699 4.571"></path><path d="M2 9.504c7.715 8.647 14.75 10.265 20 2.498c-5.25 -7.761 -12.285 -6.142 -20 2.504"></path><path d="M18 11v.01"></path><path d="M11.5 10.5c-.667 1 -.667 2 0 3"></path></svg>', 'text-blue-600', 'bg-blue-50', true, NOW()),
-- 5. Reptiles
('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tabler-icon tabler-icon-backpack "><path d="M5 18v-6a6 6 0 0 1 6 -6h2a6 6 0 0 1 6 6v6a3 3 0 0 1 -3 3h-8a3 3 0 0 1 -3 -3z"></path><path d="M10 6v-1a2 2 0 1 1 4 0v1"></path><path d="M9 21v-4a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v4"></path><path d="M11 10h2"></path></svg>', 'text-green-600', 'bg-green-50', true, NOW()),
-- 6. Insects
('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tabler-icon tabler-icon-spider "><path d="M5 4v2l5 5"></path><path d="M2.5 9.5l1.5 1.5h6"></path><path d="M4 19v-2l6 -6"></path><path d="M19 4v2l-5 5"></path><path d="M21.5 9.5l-1.5 1.5h-6"></path><path d="M20 19v-2l-6 -6"></path><path d="M12 15m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0\"></path><path d="M12 9m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path></svg>', 'text-lime-600', 'bg-lime-50', true, NOW()),
-- 7. Farm Animals
('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tabler-icon tabler-icon-egg "><path d="M19 14.083c0 4.154 -2.966 6.74 -7 6.917c-4.2 0 -7 -2.763 -7 -6.917c0 -5.538 3.5 -11.09 7 -11.083c3.5 .007 7 5.545 7 11.083z"></path></svg>', 'text-yellow-600', 'bg-yellow-50', true, NOW()),
-- 8. Rodents
('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tabler-icon tabler-icon-asterisk "><path d="M12 12l8 -4.5"></path><path d="M12 12v9"></path><path d="M12 12l-8 -4.5"></path><path d="M12 12l8 4.5"></path><path d="M12 3v9"></path><path d="M12 12l-8 4.5"></path></svg>', 'text-gray-600', 'bg-gray-50', true, NOW()),
-- 9. Wild Animals
('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tabler-icon tabler-icon-parachute "><path d="M22 12a10 10 0 1 0 -20 0"></path><path d="M22 12c0 -1.66 -1.46 -3 -3.25 -3c-1.8 0 -3.25 1.34 -3.25 3c0 -1.66 -1.57 -3 -3.5 -3s-3.5 1.34 -3.5 3c0 -1.66 -1.46 -3 -3.25 -3c-1.8 0 -3.25 1.34 -3.25 3"></path><path d="M2 12l10 10l-3.5 -10"></path><path d="M15.5 12l-3.5 10l10 -10"></path></svg>', 'text-violet-600', 'bg-violet-50', true, NOW()),
-- 10. Other
('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tabler-icon tabler-icon-paw "><path d="M14.7 13.5c-1.1 -2 -1.441 -2.5 -2.7 -2.5c-1.259 0 -1.736 .755 -2.836 2.747c-.942 1.703 -2.846 1.845 -3.321 3.291c-.097 .265 -.145 .677 -.143 .962c0 1.176 .787 2 1.8 2c1.259 0 3 -1 4.5 -1s3.241 1 4.5 1c1.013 0 1.8 -.823 1.8 -2c0 -.285 -.049 -.697 -.146 -.962c-.475 -1.451 -2.512 -1.835 -3.454 -3.538z"></path><path d="M20.188 8.082a1.039 1.039 0 0 0 -.406 -.082h-.015c-.735 .012 -1.56 .75 -1.993 1.866c-.519 1.335 -.28 2.7 .538 3.052c.129 .055 .267 .082 .406 .082c.739 0 1.575 -.742 2.011 -1.866c.516 -1.335 .273 -2.7 -.54 -3.052z"></path><path d="M9.474 9c.055 0 .109 0 .163 -.011c.944 -.128 1.533 -1.346 1.32 -2.722c-.203 -1.297 -1.047 -2.267 -1.932 -2.267c-.055 0 -.109 0 -.163 .011c-.944 .128 -1.533 1.346 -1.32 2.722c.204 1.293 1.048 2.267 1.933 2.267z"></path><path d="M16.456 6.733c.214 -1.376 -.375 -2.594 -1.32 -2.722a1.164 1.164 0 0 0 -.162 -.011c-.885 0 -1.728 .97 -1.93 2.267c-.214 1.376 .375 2.594 1.32 2.722c.054 .007 .108 .011 .162 .011c.885 0 1.73 -.974 1.93 -2.267z"></path><path d="M5.69 12.918c.816 -.352 1.054 -1.719 .536 -3.052c-.436 -1.124 -1.271 -1.866 -2.009 -1.866c-.14 0 -.277 .027 -.407 .082c-.816 .352 -1.054 1.719 -.536 3.052c.436 1.124 1.271 1.866 2.009 1.866c.14 0 .277 -.027 .407 -.082z"></path></svg>', 'text-gray-700', 'bg-gray-100', true, NOW());

-- Now insert localizations for all 10 categories (3 locales each = 30 rows)
INSERT INTO "PetCategoryLocalizations" ("Title", "Subtitle", "PetCategoryId", "AppLocaleId")
VALUES
-- Category 1: Dogs
('İtlər', 'Sadiq dostlar', 1, (SELECT id FROM "AppLocales" WHERE code='az')),
('Dogs', 'Loyal friends', 1, (SELECT id FROM "AppLocales" WHERE code='en')),
('Собаки', 'Верные друзья', 1, (SELECT id FROM "AppLocales" WHERE code='ru')),
-- Category 2: Cats
('Pişiklər', 'Müstəqil yoldaşlar', 2, (SELECT id FROM "AppLocales" WHERE code='az')),
('Cats', 'Independent companions', 2, (SELECT id FROM "AppLocales" WHERE code='en')),
('Кошки', 'Независимые компаньоны', 2, (SELECT id FROM "AppLocales" WHERE code='ru')),
-- Category 3: Birds
('Quşlar', 'Tüklü dostlar', 3, (SELECT id FROM "AppLocales" WHERE code='az')),
('Birds', 'Feathered friends', 3, (SELECT id FROM "AppLocales" WHERE code='en')),
('Птицы', 'Пернатые друзья', 3, (SELECT id FROM "AppLocales" WHERE code='ru')),
-- Category 4: Fish
('Balıqlar', 'Su sakinləri', 4, (SELECT id FROM "AppLocales" WHERE code='az')),
('Fish', 'Aquatic pets', 4, (SELECT id FROM "AppLocales" WHERE code='en')),
('Рыбы', 'Водные питомцы', 4, (SELECT id FROM "AppLocales" WHERE code='ru')),
-- Category 5: Reptiles
('Sürünənlər', 'Ekzotik yoldaşlar', 5, (SELECT id FROM "AppLocales" WHERE code='az')),
('Reptiles', 'Exotic companions', 5, (SELECT id FROM "AppLocales" WHERE code='en')),
('Рептилии', 'Экзотические компаньоны', 5, (SELECT id FROM "AppLocales" WHERE code='ru')),
-- Category 6: Insects
('Həşəratlar', 'Unikal heyvanlar', 6, (SELECT id FROM "AppLocales" WHERE code='az')),
('Insects', 'Unique pets', 6, (SELECT id FROM "AppLocales" WHERE code='en')),
('Насекомые', 'Уникальные питомцы', 6, (SELECT id FROM "AppLocales" WHERE code='ru')),
-- Category 7: Farm Animals
('Ferma heyvanları', 'Kənd heyvanları', 7, (SELECT id FROM "AppLocales" WHERE code='az')),
('Farm Animals', 'Rural companions', 7, (SELECT id FROM "AppLocales" WHERE code='en')),
('Сельскохозяйственные животные', 'Сельские животные', 7, (SELECT id FROM "AppLocales" WHERE code='ru')),
-- Category 8: Rodents
('Gəmiricilər', 'Kiçik tüklü dostlar', 8, (SELECT id FROM "AppLocales" WHERE code='az')),
('Rodents', 'Small furry friends', 8, (SELECT id FROM "AppLocales" WHERE code='en')),
('Грызуны', 'Маленькие пушистые друзья', 8, (SELECT id FROM "AppLocales" WHERE code='ru')),
-- Category 9: Wild Animals
('Vəhşi heyvanlar', 'Təbii sakinlər', 9, (SELECT id FROM "AppLocales" WHERE code='az')),
('Wild Animals', 'Natural wildlife', 9, (SELECT id FROM "AppLocales" WHERE code='en')),
('Дикие животные', 'Дикая природа', 9, (SELECT id FROM "AppLocales" WHERE code='ru')),
-- Category 10: Other
('Digər', 'Başqa növ heyvanlar', 10, (SELECT id FROM "AppLocales" WHERE code='az')),
('Other', 'Other animals', 10, (SELECT id FROM "AppLocales" WHERE code='en')),
('Другие', 'Другие животные', 10, (SELECT id FROM "AppLocales" WHERE code='ru'));

COMMIT;
