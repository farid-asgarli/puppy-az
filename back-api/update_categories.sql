-- Kateqoriyaları yeniləmək üçün SQL skript
-- Yeni kateqoriyalar: İtlər, Pişiklər, Quşlar, Balıqlar, Sürünənlər, Həşəratlar, Ferma heyvanları, Gəmiricilər, Vəhşi heyvanlar, Digər

BEGIN;

-- 1. Köhnə kateqoriyaların breed-lərini yeni kateqoriyalara map et
-- Mapping:
-- 1. İt → 1 (İtlər)
-- 2. Pişik → 2 (Pişiklər)
-- 3. Dovşan → 8 (Gəmiricilər)
-- 4. Quş → 3 (Quşlar)
-- 5. Balıq → 4 (Balıqlar)
-- 6. Gəmirici → 8 (Gəmiricilər)
-- 7. Sürünən → 5 (Sürünənlər)
-- 8. At → 7 (Ferma heyvanları)
-- 9. Təsərrüfat heyvanı → 7 (Ferma heyvanları)
-- 10. Ekzotik → 10 (Digər)
-- 11. Həşərat → 6 (Həşəratlar)
-- 12. Kiçik məməli → 8 (Gəmiricilər)
-- 13. Su heyvanı → 4 (Balıqlar)
-- 14. Suda-quruda yaşayan → 5 (Sürünənlər)
-- 15. Meymun → 9 (Vəhşi heyvanlar)
-- 16. Kisəli → 9 (Vəhşi heyvanlar)
-- 17. Hörümçəkkimilər → 6 (Həşəratlar)
-- 18. Donuz → 7 (Ferma heyvanları)
-- 19. Maral → 9 (Vəhşi heyvanlar)
-- 20. Ayı → 9 (Vəhşi heyvanlar)
-- 21. Tülkü → 9 (Vəhşi heyvanlar)
-- 22. Kirpi → 9 (Vəhşi heyvanlar)
-- 23. Dəniz məməliləri → 4 (Balıqlar)
-- 24. Qarışıq cins → 10 (Digər)
-- 25. Digər → 10 (Digər)

-- Breed-ləri yeni kateqoriyalara köçür
UPDATE "PetBreeds" SET "PetCategoryId" = 1 WHERE "PetCategoryId" = 1; -- İt → İtlər
UPDATE "PetBreeds" SET "PetCategoryId" = 2 WHERE "PetCategoryId" = 2; -- Pişik → Pişiklər
UPDATE "PetBreeds" SET "PetCategoryId" = 8 WHERE "PetCategoryId" = 3; -- Dovşan → Gəmiricilər
UPDATE "PetBreeds" SET "PetCategoryId" = 3 WHERE "PetCategoryId" = 4; -- Quş → Quşlar
UPDATE "PetBreeds" SET "PetCategoryId" = 4 WHERE "PetCategoryId" = 5; -- Balıq → Balıqlar
UPDATE "PetBreeds" SET "PetCategoryId" = 8 WHERE "PetCategoryId" = 6; -- Gəmirici → Gəmiricilər
UPDATE "PetBreeds" SET "PetCategoryId" = 5 WHERE "PetCategoryId" = 7; -- Sürünən → Sürünənlər
UPDATE "PetBreeds" SET "PetCategoryId" = 7 WHERE "PetCategoryId" = 8; -- At → Ferma heyvanları
UPDATE "PetBreeds" SET "PetCategoryId" = 7 WHERE "PetCategoryId" = 9; -- Təsərrüfat heyvanı → Ferma heyvanları
UPDATE "PetBreeds" SET "PetCategoryId" = 10 WHERE "PetCategoryId" = 10; -- Ekzotik → Digər
UPDATE "PetBreeds" SET "PetCategoryId" = 6 WHERE "PetCategoryId" = 11; -- Həşərat → Həşəratlar
UPDATE "PetBreeds" SET "PetCategoryId" = 8 WHERE "PetCategoryId" = 12; -- Kiçik məməli → Gəmiricilər
UPDATE "PetBreeds" SET "PetCategoryId" = 4 WHERE "PetCategoryId" = 13; -- Su heyvanı → Balıqlar
UPDATE "PetBreeds" SET "PetCategoryId" = 5 WHERE "PetCategoryId" = 14; -- Suda-quruda yaşayan → Sürünənlər
UPDATE "PetBreeds" SET "PetCategoryId" = 9 WHERE "PetCategoryId" = 15; -- Meymun → Vəhşi heyvanlar
UPDATE "PetBreeds" SET "PetCategoryId" = 9 WHERE "PetCategoryId" = 16; -- Kisəli → Vəhşi heyvanlar
UPDATE "PetBreeds" SET "PetCategoryId" = 6 WHERE "PetCategoryId" = 17; -- Hörümçəkkimilər → Həşəratlar
UPDATE "PetBreeds" SET "PetCategoryId" = 7 WHERE "PetCategoryId" = 18; -- Donuz → Ferma heyvanları
UPDATE "PetBreeds" SET "PetCategoryId" = 9 WHERE "PetCategoryId" = 19; -- Maral → Vəhşi heyvanlar
UPDATE "PetBreeds" SET "PetCategoryId" = 9 WHERE "PetCategoryId" = 20; -- Ayı → Vəhşi heyvanlar
UPDATE "PetBreeds" SET "PetCategoryId" = 9 WHERE "PetCategoryId" = 21; -- Tülkü → Vəhşi heyvanlar
UPDATE "PetBreeds" SET "PetCategoryId" = 9 WHERE "PetCategoryId" = 22; -- Kirpi → Vəhşi heyvanlar
UPDATE "PetBreeds" SET "PetCategoryId" = 4 WHERE "PetCategoryId" = 23; -- Dəniz məməliləri → Balıqlar
UPDATE "PetBreeds" SET "PetCategoryId" = 10 WHERE "PetCategoryId" = 24; -- Qarışıq cins → Digər
UPDATE "PetBreeds" SET "PetCategoryId" = 10 WHERE "PetCategoryId" = 25; -- Digər → Digər

-- 2. Köhnə kateqoriya lokalizasiyalarını sil (11-25 arası)
DELETE FROM "PetCategoryLocalizations" WHERE "PetCategoryId" > 10;

-- 3. Köhnə kateqoriyaları sil (11-25 arası)
DELETE FROM "PetCategories" WHERE "Id" > 10;

-- 4. Mövcud kateqoriyaların adlarını yenilə (lokalizasiya cədvəlində)
-- AZ lokalizasiyaları
UPDATE "PetCategoryLocalizations" SET "Title" = 'İtlər' WHERE "PetCategoryId" = 1 AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'az');
UPDATE "PetCategoryLocalizations" SET "Title" = 'Pişiklər' WHERE "PetCategoryId" = 2 AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'az');
UPDATE "PetCategoryLocalizations" SET "Title" = 'Quşlar' WHERE "PetCategoryId" = 3 AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'az');
UPDATE "PetCategoryLocalizations" SET "Title" = 'Balıqlar' WHERE "PetCategoryId" = 4 AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'az');
UPDATE "PetCategoryLocalizations" SET "Title" = 'Sürünənlər' WHERE "PetCategoryId" = 5 AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'az');
UPDATE "PetCategoryLocalizations" SET "Title" = 'Həşəratlar' WHERE "PetCategoryId" = 6 AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'az');
UPDATE "PetCategoryLocalizations" SET "Title" = 'Ferma heyvanları' WHERE "PetCategoryId" = 7 AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'az');
UPDATE "PetCategoryLocalizations" SET "Title" = 'Gəmiricilər' WHERE "PetCategoryId" = 8 AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'az');
UPDATE "PetCategoryLocalizations" SET "Title" = 'Vəhşi heyvanlar' WHERE "PetCategoryId" = 9 AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'az');
UPDATE "PetCategoryLocalizations" SET "Title" = 'Digər' WHERE "PetCategoryId" = 10 AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'az');

-- EN lokalizasiyaları
UPDATE "PetCategoryLocalizations" SET "Title" = 'Dogs' WHERE "PetCategoryId" = 1 AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'en');
UPDATE "PetCategoryLocalizations" SET "Title" = 'Cats' WHERE "PetCategoryId" = 2 AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'en');
UPDATE "PetCategoryLocalizations" SET "Title" = 'Birds' WHERE "PetCategoryId" = 3 AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'en');
UPDATE "PetCategoryLocalizations" SET "Title" = 'Fish' WHERE "PetCategoryId" = 4 AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'en');
UPDATE "PetCategoryLocalizations" SET "Title" = 'Reptiles' WHERE "PetCategoryId" = 5 AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'en');
UPDATE "PetCategoryLocalizations" SET "Title" = 'Insects' WHERE "PetCategoryId" = 6 AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'en');
UPDATE "PetCategoryLocalizations" SET "Title" = 'Farm Animals' WHERE "PetCategoryId" = 7 AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'en');
UPDATE "PetCategoryLocalizations" SET "Title" = 'Rodents' WHERE "PetCategoryId" = 8 AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'en');
UPDATE "PetCategoryLocalizations" SET "Title" = 'Wild Animals' WHERE "PetCategoryId" = 9 AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'en');
UPDATE "PetCategoryLocalizations" SET "Title" = 'Other' WHERE "PetCategoryId" = 10 AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'en');

-- RU lokalizasiyaları
UPDATE "PetCategoryLocalizations" SET "Title" = 'Собаки' WHERE "PetCategoryId" = 1 AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');
UPDATE "PetCategoryLocalizations" SET "Title" = 'Кошки' WHERE "PetCategoryId" = 2 AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');
UPDATE "PetCategoryLocalizations" SET "Title" = 'Птицы' WHERE "PetCategoryId" = 3 AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');
UPDATE "PetCategoryLocalizations" SET "Title" = 'Рыбы' WHERE "PetCategoryId" = 4 AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');
UPDATE "PetCategoryLocalizations" SET "Title" = 'Рептилии' WHERE "PetCategoryId" = 5 AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');
UPDATE "PetCategoryLocalizations" SET "Title" = 'Насекомые' WHERE "PetCategoryId" = 6 AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');
UPDATE "PetCategoryLocalizations" SET "Title" = 'Сельскохозяйственные животные' WHERE "PetCategoryId" = 7 AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');
UPDATE "PetCategoryLocalizations" SET "Title" = 'Грызуны' WHERE "PetCategoryId" = 8 AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');
UPDATE "PetCategoryLocalizations" SET "Title" = 'Дикие животные' WHERE "PetCategoryId" = 9 AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');
UPDATE "PetCategoryLocalizations" SET "Title" = 'Другие' WHERE "PetCategoryId" = 10 AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

COMMIT;
