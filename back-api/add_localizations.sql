-- EN və RU lokalizasiyalarını əlavə et
BEGIN;

-- EN lokalizasiyaları əlavə et
INSERT INTO "PetCategoryLocalizations" ("Title", "Subtitle", "PetCategoryId", "AppLocaleId")
SELECT 'Dogs', 'Loyal friends', 1, al."Id" FROM "AppLocales" al WHERE al."Code" = 'en'
ON CONFLICT DO NOTHING;
INSERT INTO "PetCategoryLocalizations" ("Title", "Subtitle", "PetCategoryId", "AppLocaleId")
SELECT 'Cats', 'Independent companions', 2, al."Id" FROM "AppLocales" al WHERE al."Code" = 'en'
ON CONFLICT DO NOTHING;
INSERT INTO "PetCategoryLocalizations" ("Title", "Subtitle", "PetCategoryId", "AppLocaleId")
SELECT 'Birds', 'Feathered friends', 3, al."Id" FROM "AppLocales" al WHERE al."Code" = 'en'
ON CONFLICT DO NOTHING;
INSERT INTO "PetCategoryLocalizations" ("Title", "Subtitle", "PetCategoryId", "AppLocaleId")
SELECT 'Fish', 'Aquatic pets', 4, al."Id" FROM "AppLocales" al WHERE al."Code" = 'en'
ON CONFLICT DO NOTHING;
INSERT INTO "PetCategoryLocalizations" ("Title", "Subtitle", "PetCategoryId", "AppLocaleId")
SELECT 'Reptiles', 'Exotic companions', 5, al."Id" FROM "AppLocales" al WHERE al."Code" = 'en'
ON CONFLICT DO NOTHING;
INSERT INTO "PetCategoryLocalizations" ("Title", "Subtitle", "PetCategoryId", "AppLocaleId")
SELECT 'Insects', 'Unique pets', 6, al."Id" FROM "AppLocales" al WHERE al."Code" = 'en'
ON CONFLICT DO NOTHING;
INSERT INTO "PetCategoryLocalizations" ("Title", "Subtitle", "PetCategoryId", "AppLocaleId")
SELECT 'Farm Animals', 'Rural companions', 7, al."Id" FROM "AppLocales" al WHERE al."Code" = 'en'
ON CONFLICT DO NOTHING;
INSERT INTO "PetCategoryLocalizations" ("Title", "Subtitle", "PetCategoryId", "AppLocaleId")
SELECT 'Rodents', 'Small furry friends', 8, al."Id" FROM "AppLocales" al WHERE al."Code" = 'en'
ON CONFLICT DO NOTHING;
INSERT INTO "PetCategoryLocalizations" ("Title", "Subtitle", "PetCategoryId", "AppLocaleId")
SELECT 'Wild Animals', 'Exotic wildlife', 9, al."Id" FROM "AppLocales" al WHERE al."Code" = 'en'
ON CONFLICT DO NOTHING;
INSERT INTO "PetCategoryLocalizations" ("Title", "Subtitle", "PetCategoryId", "AppLocaleId")
SELECT 'Other', 'Other pets', 10, al."Id" FROM "AppLocales" al WHERE al."Code" = 'en'
ON CONFLICT DO NOTHING;

-- RU lokalizasiyaları əlavə et
INSERT INTO "PetCategoryLocalizations" ("Title", "Subtitle", "PetCategoryId", "AppLocaleId")
SELECT 'Собаки', 'Верные друзья', 1, al."Id" FROM "AppLocales" al WHERE al."Code" = 'ru'
ON CONFLICT DO NOTHING;
INSERT INTO "PetCategoryLocalizations" ("Title", "Subtitle", "PetCategoryId", "AppLocaleId")
SELECT 'Кошки', 'Независимые компаньоны', 2, al."Id" FROM "AppLocales" al WHERE al."Code" = 'ru'
ON CONFLICT DO NOTHING;
INSERT INTO "PetCategoryLocalizations" ("Title", "Subtitle", "PetCategoryId", "AppLocaleId")
SELECT 'Птицы', 'Пернатые друзья', 3, al."Id" FROM "AppLocales" al WHERE al."Code" = 'ru'
ON CONFLICT DO NOTHING;
INSERT INTO "PetCategoryLocalizations" ("Title", "Subtitle", "PetCategoryId", "AppLocaleId")
SELECT 'Рыбы', 'Водные питомцы', 4, al."Id" FROM "AppLocales" al WHERE al."Code" = 'ru'
ON CONFLICT DO NOTHING;
INSERT INTO "PetCategoryLocalizations" ("Title", "Subtitle", "PetCategoryId", "AppLocaleId")
SELECT 'Рептилии', 'Экзотические компаньоны', 5, al."Id" FROM "AppLocales" al WHERE al."Code" = 'ru'
ON CONFLICT DO NOTHING;
INSERT INTO "PetCategoryLocalizations" ("Title", "Subtitle", "PetCategoryId", "AppLocaleId")
SELECT 'Насекомые', 'Уникальные питомцы', 6, al."Id" FROM "AppLocales" al WHERE al."Code" = 'ru'
ON CONFLICT DO NOTHING;
INSERT INTO "PetCategoryLocalizations" ("Title", "Subtitle", "PetCategoryId", "AppLocaleId")
SELECT 'Сельскохозяйственные животные', 'Деревенские компаньоны', 7, al."Id" FROM "AppLocales" al WHERE al."Code" = 'ru'
ON CONFLICT DO NOTHING;
INSERT INTO "PetCategoryLocalizations" ("Title", "Subtitle", "PetCategoryId", "AppLocaleId")
SELECT 'Грызуны', 'Маленькие пушистые друзья', 8, al."Id" FROM "AppLocales" al WHERE al."Code" = 'ru'
ON CONFLICT DO NOTHING;
INSERT INTO "PetCategoryLocalizations" ("Title", "Subtitle", "PetCategoryId", "AppLocaleId")
SELECT 'Дикие животные', 'Экзотическая дикая природа', 9, al."Id" FROM "AppLocales" al WHERE al."Code" = 'ru'
ON CONFLICT DO NOTHING;
INSERT INTO "PetCategoryLocalizations" ("Title", "Subtitle", "PetCategoryId", "AppLocaleId")
SELECT 'Другие', 'Другие питомцы', 10, al."Id" FROM "AppLocales" al WHERE al."Code" = 'ru'
ON CONFLICT DO NOTHING;

COMMIT;
