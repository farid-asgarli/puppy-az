-- Fix locale assignments for static sections
-- AppLocale: az=1, en=2, ru=3

-- Delete existing localizations
DELETE FROM "StaticSectionLocalizations";

-- Insert correct localizations for home_hero (id=1)
-- AppLocaleId 1 = az, 2 = en, 3 = ru
INSERT INTO "StaticSectionLocalizations" ("StaticSectionId", "AppLocaleId", "Title", "Subtitle", "Content", "Metadata") VALUES
(1, 1, 'Mükəmməl dostu tapın, sevin', 'Azərbaycanda ev heyvanlarının alqı-satqısı üçün ən böyük platforma', 'İt, pişik və digər ev heyvanları üçün elanlar', NULL),
(1, 2, 'Find the perfect friend, love', 'The largest platform for buying and selling pets in Azerbaijan', 'Listings for dogs, cats and other pets', NULL),
(1, 3, 'Найдите идеального друга', 'Крупнейшая платформа для покупки и продажи домашних животных в Азербайджане', 'Объявления о собаках, кошках и других домашних животных', NULL);

-- Insert localizations for home_how_it_works (id=2)
INSERT INTO "StaticSectionLocalizations" ("StaticSectionId", "AppLocaleId", "Title", "Subtitle", "Content", "Metadata") VALUES
(2, 1, 'Necə işləyir', 'Sadə 3 addımda', 'Elan yerləşdirin, alıcı tapın, əlaqə saxlayın', NULL),
(2, 2, 'How it works', 'Simple 3 steps', 'Post a listing, find a buyer, get in touch', NULL),
(2, 3, 'Как это работает', 'Простые 3 шага', 'Разместите объявление, найдите покупателя, свяжитесь', NULL);

-- Insert localizations for home_why_puppy (id=3)
INSERT INTO "StaticSectionLocalizations" ("StaticSectionId", "AppLocaleId", "Title", "Subtitle", "Content", "Metadata") VALUES
(3, 1, 'Niyə puppy.az?', 'Biz fərqliyik', 'Təhlükəsiz alış-veriş, təsdiqlənmiş satıcılar, 10,000+ aktiv elan', NULL),
(3, 2, 'Why puppy.az?', 'We are different', 'Safe shopping, verified sellers, 10,000+ active listings', NULL),
(3, 3, 'Почему puppy.az?', 'Мы отличаемся', 'Безопасные покупки, проверенные продавцы, 10,000+ активных объявлений', NULL);

-- Insert localizations for about (id=4)
INSERT INTO "StaticSectionLocalizations" ("StaticSectionId", "AppLocaleId", "Title", "Subtitle", "Content", "Metadata") VALUES
(4, 1, 'Haqqımızda', 'Biz kimik', 'puppy.az Azərbaycanda ev heyvanları üçün aparıcı platformadır', NULL),
(4, 2, 'About Us', 'Who we are', 'puppy.az is the leading pet platform in Azerbaijan', NULL),
(4, 3, 'О нас', 'Кто мы', 'puppy.az - ведущая платформа для домашних животных в Азербайджане', NULL);

-- Insert localizations for contact (id=5)
INSERT INTO "StaticSectionLocalizations" ("StaticSectionId", "AppLocaleId", "Title", "Subtitle", "Content", "Metadata") VALUES
(5, 1, 'Əlaqə', 'Bizimlə əlaqə saxlayın', 'Email: info@puppy.az, Telefon: +994 XX XXX XX XX', NULL),
(5, 2, 'Contact', 'Get in touch with us', 'Email: info@puppy.az, Phone: +994 XX XXX XX XX', NULL),
(5, 3, 'Контакты', 'Свяжитесь с нами', 'Email: info@puppy.az, Телефон: +994 XX XXX XX XX', NULL);
