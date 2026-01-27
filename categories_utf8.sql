-- Reset
DELETE FROM "PetAds";
DELETE FROM "PetBreedLocalizations";
DELETE FROM "PetBreeds";
DELETE FROM "PetCategoryLocalizations";
DELETE FROM "PetCategories";
ALTER SEQUENCE "PetCategories_Id_seq" RESTART WITH 1;

-- Insert categories
INSERT INTO "PetCategories" ("SvgIcon", "IconColor", "BackgroundColor", "IsActive", "CreatedAt") VALUES
('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5h2"/><path d="M19 12c-.667 5.333 -2.333 8 -5 8h-4c-2.667 0 -4.333 -2.667 -5 -8"/></svg>', 'text-amber-600', 'bg-amber-50', true, NOW()),
('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 3v10a8 8 0 1 1 -16 0v-10l3.432 3.432"/></svg>', 'text-purple-600', 'bg-purple-50', true, NOW()),
('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20l10 -10m0 -5v5h5"/></svg>', 'text-sky-600', 'bg-sky-50', true, NOW()),
('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16.69 7.44a6.973 6.973 0 0 0 -1.69 4.56"/></svg>', 'text-blue-600', 'bg-blue-50', true, NOW()),
('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 18v-6a6 6 0 0 1 6 -6h2a6 6 0 0 1 6 6v6"/></svg>', 'text-green-600', 'bg-green-50', true, NOW()),
('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 4v2l5 5"/></svg>', 'text-lime-600', 'bg-lime-50', true, NOW()),
('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14.083c0 4.154 -2.966 6.74 -7 6.917"/></svg>', 'text-yellow-600', 'bg-yellow-50', true, NOW()),
('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 12l8 -4.5"/></svg>', 'text-gray-600', 'bg-gray-50', true, NOW()),
('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12a10 10 0 1 0 -20 0"/></svg>', 'text-violet-600', 'bg-violet-50', true, NOW()),
('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 3h6a3 3 0 0 1 3 3v6a3 3 0 0 1 -3 3h-6a3 3 0 0 1 -3 -3v-6a3 3 0 0 1 3 -3"/></svg>', 'text-red-600', 'bg-red-50', true, NOW());

-- Insert localizations
INSERT INTO "PetCategoryLocalizations" ("Title", "Subtitle", "PetCategoryId", "AppLocaleId") VALUES
('İtlər', 'Sadiq dostlar', 1, (SELECT "Id" FROM "AppLocales" WHERE "Code"='az')),
('Dogs', 'Loyal friends', 1, (SELECT "Id" FROM "AppLocales" WHERE "Code"='en')),
('Собаки', 'Верные друзья', 1, (SELECT "Id" FROM "AppLocales" WHERE "Code"='ru')),
('Pişiklər', 'Müstəqil yoldaşlar', 2, (SELECT "Id" FROM "AppLocales" WHERE "Code"='az')),
('Cats', 'Independent companions', 2, (SELECT "Id" FROM "AppLocales" WHERE "Code"='en')),
('Кошки', 'Независимые компаньоны', 2, (SELECT "Id" FROM "AppLocales" WHERE "Code"='ru')),
('Quşlar', 'Tüklü dostlar', 3, (SELECT "Id" FROM "AppLocales" WHERE "Code"='az')),
('Birds', 'Feathered friends', 3, (SELECT "Id" FROM "AppLocales" WHERE "Code"='en')),
('Птицы', 'Пернатые друзья', 3, (SELECT "Id" FROM "AppLocales" WHERE "Code"='ru')),
('Balıqlar', 'Su sakinləri', 4, (SELECT "Id" FROM "AppLocales" WHERE "Code"='az')),
('Fish', 'Aquatic pets', 4, (SELECT "Id" FROM "AppLocales" WHERE "Code"='en')),
('Рыбы', 'Водные питомцы', 4, (SELECT "Id" FROM "AppLocales" WHERE "Code"='ru')),
('Sürünənlər', 'Ekzotik yoldaşlar', 5, (SELECT "Id" FROM "AppLocales" WHERE "Code"='az')),
('Reptiles', 'Exotic companions', 5, (SELECT "Id" FROM "AppLocales" WHERE "Code"='en')),
('Рептилии', 'Экзотические компаньоны', 5, (SELECT "Id" FROM "AppLocales" WHERE "Code"='ru')),
('Həşəratlar', 'Unikal heyvanlar', 6, (SELECT "Id" FROM "AppLocales" WHERE "Code"='az')),
('Insects', 'Unique pets', 6, (SELECT "Id" FROM "AppLocales" WHERE "Code"='en')),
('Насекомые', 'Уникальные питомцы', 6, (SELECT "Id" FROM "AppLocales" WHERE "Code"='ru')),
('Ferma heyvanları', 'Kənd heyvanları', 7, (SELECT "Id" FROM "AppLocales" WHERE "Code"='az')),
('Farm Animals', 'Rural companions', 7, (SELECT "Id" FROM "AppLocales" WHERE "Code"='en')),
('Сельскохозяйственные животные', 'Сельские животные', 7, (SELECT "Id" FROM "AppLocales" WHERE "Code"='ru')),
('Gəmiricilər', 'Kiçik tüklü dostlar', 8, (SELECT "Id" FROM "AppLocales" WHERE "Code"='az')),
('Rodents', 'Small furry friends', 8, (SELECT "Id" FROM "AppLocales" WHERE "Code"='en')),
('Грызуны', 'Маленькие пушистые друзья', 8, (SELECT "Id" FROM "AppLocales" WHERE "Code"='ru')),
('Vəhşi heyvanlar', 'Təbii sakinlər', 9, (SELECT "Id" FROM "AppLocales" WHERE "Code"='az')),
('Wild Animals', 'Natural wildlife', 9, (SELECT "Id" FROM "AppLocales" WHERE "Code"='en')),
('Дикие животные', 'Дикая природа', 9, (SELECT "Id" FROM "AppLocales" WHERE "Code"='ru')),
('Digər', 'Başqa növ heyvanlar', 10, (SELECT "Id" FROM "AppLocales" WHERE "Code"='az')),
('Other', 'Other animals', 10, (SELECT "Id" FROM "AppLocales" WHERE "Code"='en')),
('Другие', 'Другие животные', 10, (SELECT "Id" FROM "AppLocales" WHERE "Code"='ru'));