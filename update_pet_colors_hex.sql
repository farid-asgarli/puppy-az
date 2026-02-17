-- Update PetColors with HEX color codes

-- First, delete existing colors and their localizations
DELETE FROM "PetColorLocalizations";
DELETE FROM "PetColors";

-- Insert colors with HEX codes
INSERT INTO "PetColors" ("Id", "Key", "BackgroundColor", "TextColor", "BorderColor", "SortOrder", "IsActive", "CreatedAt", "IsDeleted")
VALUES
  (1, 'black', '#4B5563', '#FFFFFF', '#4B5563', 1, true, NOW(), false),
  (2, 'white', '#FEFEFE', '#6B7280', '#E5E7EB', 2, true, NOW(), false),
  (3, 'gray', '#F3F4F6', '#4B5563', '#E5E7EB', 3, true, NOW(), false),
  (4, 'brown', '#F5E6DC', '#78350F', '#E8D4C4', 4, true, NOW(), false),
  (5, 'golden', '#FEF9C3', '#92400E', '#FDE68A', 5, true, NOW(), false),
  (6, 'cream', '#FFFBEB', '#92400E', '#FEF3C7', 6, true, NOW(), false),
  (7, 'beige', '#FAF5F0', '#78716C', '#E7E5E4', 7, true, NOW(), false),
  (8, 'red', '#FEF2F2', '#B91C1C', '#FECACA', 8, true, NOW(), false),
  (9, 'orange', '#FFF7ED', '#C2410C', '#FED7AA', 9, true, NOW(), false),
  (10, 'yellow', '#FEFCE8', '#A16207', '#FEF08A', 10, true, NOW(), false),
  (11, 'green', '#F0FDF4', '#166534', '#BBF7D0', 11, true, NOW(), false),
  (12, 'blue', '#EFF6FF', '#1D4ED8', '#BFDBFE', 12, true, NOW(), false),
  (13, 'spotted', '#FAFAFA', '#525252', '#E5E5E5', 13, true, NOW(), false),
  (14, 'striped', '#FEF9C3', '#92400E', '#FDE68A', 14, true, NOW(), false),
  (15, 'mixed', '#F9FAFB', '#4B5563', '#E5E7EB', 15, true, NOW(), false);

-- Insert localizations for Azerbaijani (AppLocaleId = 1)
INSERT INTO "PetColorLocalizations" ("Id", "PetColorId", "AppLocaleId", "Title", "CreatedAt", "IsDeleted")
VALUES
  (1, 1, 1, 'Qara', NOW(), false),
  (2, 2, 1, 'Ağ', NOW(), false),
  (3, 3, 1, 'Boz', NOW(), false),
  (4, 4, 1, 'Qəhvəyi', NOW(), false),
  (5, 5, 1, 'Qızılı', NOW(), false),
  (6, 6, 1, 'Krem', NOW(), false),
  (7, 7, 1, 'Bej', NOW(), false),
  (8, 8, 1, 'Qırmızı', NOW(), false),
  (9, 9, 1, 'Narıncı', NOW(), false),
  (10, 10, 1, 'Sarı', NOW(), false),
  (11, 11, 1, 'Yaşıl', NOW(), false),
  (12, 12, 1, 'Mavi', NOW(), false),
  (13, 13, 1, 'Xallı', NOW(), false),
  (14, 14, 1, 'Zolaqlı', NOW(), false),
  (15, 15, 1, 'Qarışıq', NOW(), false);

-- Insert localizations for English (AppLocaleId = 2)
INSERT INTO "PetColorLocalizations" ("Id", "PetColorId", "AppLocaleId", "Title", "CreatedAt", "IsDeleted")
VALUES
  (16, 1, 2, 'Black', NOW(), false),
  (17, 2, 2, 'White', NOW(), false),
  (18, 3, 2, 'Gray', NOW(), false),
  (19, 4, 2, 'Brown', NOW(), false),
  (20, 5, 2, 'Golden', NOW(), false),
  (21, 6, 2, 'Cream', NOW(), false),
  (22, 7, 2, 'Beige', NOW(), false),
  (23, 8, 2, 'Red', NOW(), false),
  (24, 9, 2, 'Orange', NOW(), false),
  (25, 10, 2, 'Yellow', NOW(), false),
  (26, 11, 2, 'Green', NOW(), false),
  (27, 12, 2, 'Blue', NOW(), false),
  (28, 13, 2, 'Spotted', NOW(), false),
  (29, 14, 2, 'Striped', NOW(), false),
  (30, 15, 2, 'Mixed', NOW(), false);

-- Insert localizations for Russian (AppLocaleId = 3)
INSERT INTO "PetColorLocalizations" ("Id", "PetColorId", "AppLocaleId", "Title", "CreatedAt", "IsDeleted")
VALUES
  (31, 1, 3, 'Черный', NOW(), false),
  (32, 2, 3, 'Белый', NOW(), false),
  (33, 3, 3, 'Серый', NOW(), false),
  (34, 4, 3, 'Коричневый', NOW(), false),
  (35, 5, 3, 'Золотой', NOW(), false),
  (36, 6, 3, 'Кремовый', NOW(), false),
  (37, 7, 3, 'Бежевый', NOW(), false),
  (38, 8, 3, 'Красный', NOW(), false),
  (39, 9, 3, 'Оранжевый', NOW(), false),
  (40, 10, 3, 'Желтый', NOW(), false),
  (41, 11, 3, 'Зеленый', NOW(), false),
  (42, 12, 3, 'Синий', NOW(), false),
  (43, 13, 3, 'Пятнистый', NOW(), false),
  (44, 14, 3, 'Полосатый', NOW(), false),
  (45, 15, 3, 'Смешанный', NOW(), false);

-- Verify results
SELECT 
    pc."Id",
    pc."Key",
    pcl."Title" as "AzerbaijaniTitle",
    pc."BackgroundColor",
    pc."TextColor",
    pc."BorderColor"
FROM "PetColors" pc
LEFT JOIN "PetColorLocalizations" pcl ON pc."Id" = pcl."PetColorId" AND pcl."AppLocaleId" = 1
ORDER BY pc."SortOrder";

SELECT 
    COUNT(*) as total_colors,
    (SELECT COUNT(*) FROM "PetColorLocalizations") as total_localizations
FROM "PetColors";
