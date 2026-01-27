-- Fix category localizations with proper UTF-8 encoding
DELETE FROM "PetCategoryLocalizations";

-- Insert AZ localizations
INSERT INTO "PetCategoryLocalizations" ("PetCategoryId", "AppLocaleId", "Title", "Subtitle") VALUES
(1, (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'az'), 'İtlər', 'Sadiq dostlar'),
(2, (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'az'), 'Pişiklər', 'Müstəqil yoldaşlar'),
(3, (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'az'), 'Quşlar', 'Tüklü dostlar'),
(4, (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'az'), 'Balıqlar', 'Akvariumlar üçün'),
(5, (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'az'), 'Sürünənlər', 'Ekzotik yoldaşlar'),
(6, (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'az'), 'Həşəratlar', 'Unikal heyvanlar'),
(7, (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'az'), 'Ferma heyvanları', 'Kənd yoldaşları'),
(8, (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'az'), 'Gəmiricilər', 'Kiçik tüklü dostlar'),
(9, (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'az'), 'Vəhşi heyvanlar', 'Təbiətdən'),
(10, (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'az'), 'Digər', 'Digər heyvanlar');

-- Insert EN localizations
INSERT INTO "PetCategoryLocalizations" ("PetCategoryId", "AppLocaleId", "Title", "Subtitle") VALUES
(1, (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'en'), 'Dogs', 'Loyal friends'),
(2, (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'en'), 'Cats', 'Independent companions'),
(3, (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'en'), 'Birds', 'Feathered friends'),
(4, (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'en'), 'Fish', 'Aquatic pets'),
(5, (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'en'), 'Reptiles', 'Exotic companions'),
(6, (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'en'), 'Insects', 'Unique pets'),
(7, (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'en'), 'Farm Animals', 'Rural companions'),
(8, (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'en'), 'Rodents', 'Small furry friends'),
(9, (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'en'), 'Wild Animals', 'Natural wildlife'),
(10, (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'en'), 'Other', 'Other animals');

-- Insert RU localizations
INSERT INTO "PetCategoryLocalizations" ("PetCategoryId", "AppLocaleId", "Title", "Subtitle") VALUES
(1, (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru'), 'Собаки', 'Верные друзья'),
(2, (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru'), 'Кошки', 'Независимые компаньоны'),
(3, (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru'), 'Птицы', 'Пернатые друзья'),
(4, (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru'), 'Рыбки', 'Аквариумные питомцы'),
(5, (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru'), 'Рептилии', 'Экзотические компаньоны'),
(6, (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru'), 'Насекомые', 'Уникальные питомцы'),
(7, (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru'), 'Фермерские животные', 'Сельские компаньоны'),
(8, (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru'), 'Грызуны', 'Маленькие пушистые друзья'),
(9, (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru'), 'Дикие животные', 'Природная дикая природа'),
(10, (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru'), 'Другие', 'Другие животные');
