-- Drop and recreate tables
DROP TABLE IF EXISTS "PetColorLocalizations" CASCADE;
DROP TABLE IF EXISTS "PetColors" CASCADE;

-- Create PetColors table with longer varchar for complex gradients
CREATE TABLE "PetColors" (
    "Id" SERIAL PRIMARY KEY,
    "Key" VARCHAR(50) NOT NULL,
    "BackgroundColor" VARCHAR(100) NOT NULL,
    "TextColor" VARCHAR(50) NOT NULL,
    "BorderColor" VARCHAR(50) NOT NULL,
    "SortOrder" INTEGER NOT NULL DEFAULT 0,
    "IsActive" BOOLEAN NOT NULL DEFAULT TRUE,
    "CreatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "UpdatedAt" TIMESTAMP,
    "CreatedBy" UUID,
    "UpdatedBy" UUID,
    "IsDeleted" BOOLEAN NOT NULL DEFAULT FALSE,
    "DeletedAt" TIMESTAMP,
    "DeletedBy" UUID
);

-- Create PetColorLocalizations table
CREATE TABLE "PetColorLocalizations" (
    "Id" SERIAL PRIMARY KEY,
    "PetColorId" INTEGER NOT NULL,
    "AppLocaleId" INTEGER NOT NULL,
    "Title" VARCHAR(100) NOT NULL,
    CONSTRAINT "FK_PetColorLocalizations_PetColors" FOREIGN KEY ("PetColorId") REFERENCES "PetColors"("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_PetColorLocalizations_AppLocales" FOREIGN KEY ("AppLocaleId") REFERENCES "AppLocales"("Id") ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX "IX_PetColors_Key" ON "PetColors" ("Key");
CREATE INDEX "IX_PetColors_IsActive" ON "PetColors" ("IsActive");
CREATE INDEX "IX_PetColors_SortOrder" ON "PetColors" ("SortOrder");
CREATE INDEX "IX_PetColorLocalizations_PetColorId" ON "PetColorLocalizations" ("PetColorId");
CREATE INDEX "IX_PetColorLocalizations_AppLocaleId" ON "PetColorLocalizations" ("AppLocaleId");

-- Insert common pet colors with Tailwind classes
INSERT INTO "PetColors" ("Key", "BackgroundColor", "TextColor", "BorderColor", "SortOrder", "IsActive")
VALUES
('black', 'bg-gray-900', 'text-white', 'border-gray-700', 1, TRUE),
('white', 'bg-white', 'text-gray-900', 'border-gray-300', 2, TRUE),
('brown', 'bg-amber-700', 'text-white', 'border-amber-600', 3, TRUE),
('gray', 'bg-gray-500', 'text-white', 'border-gray-400', 4, TRUE),
('golden', 'bg-yellow-400', 'text-gray-900', 'border-yellow-300', 5, TRUE),
('cream', 'bg-orange-100', 'text-orange-900', 'border-orange-200', 6, TRUE),
('orange', 'bg-orange-500', 'text-white', 'border-orange-400', 7, TRUE),
('red', 'bg-red-600', 'text-white', 'border-red-500', 8, TRUE),
('yellow', 'bg-yellow-300', 'text-yellow-900', 'border-yellow-200', 9, TRUE),
('green', 'bg-green-600', 'text-white', 'border-green-500', 10, TRUE),
('blue', 'bg-blue-600', 'text-white', 'border-blue-500', 11, TRUE),
('pink', 'bg-pink-400', 'text-white', 'border-pink-300', 12, TRUE),
('purple', 'bg-purple-600', 'text-white', 'border-purple-500', 13, TRUE),
('multicolor', 'bg-gradient-to-r from-red-500 to-blue-500', 'text-white', 'border-gray-300', 14, TRUE),
('striped', 'bg-gray-200', 'text-gray-900', 'border-gray-300', 15, TRUE);

-- Insert Azerbaijani localizations
INSERT INTO "PetColorLocalizations" ("PetColorId", "AppLocaleId", "Title")
VALUES
(1, 1, 'Qara'),
(2, 1, 'Ağ'),
(3, 1, 'Qəhvəyi'),
(4, 1, 'Boz'),
(5, 1, 'Qızılı'),
(6, 1, 'Krem'),
(7, 1, 'Narıncı'),
(8, 1, 'Qırmızı'),
(9, 1, 'Sarı'),
(10, 1, 'Yaşıl'),
(11, 1, 'Mavi'),
(12, 1, 'Çəhrayı'),
(13, 1, 'Bənövşəyi'),
(14, 1, 'Çoxrəngli'),
(15, 1, 'Zolaqlı');

-- Insert English localizations
INSERT INTO "PetColorLocalizations" ("PetColorId", "AppLocaleId", "Title")
VALUES
(1, 2, 'Black'),
(2, 2, 'White'),
(3, 2, 'Brown'),
(4, 2, 'Gray'),
(5, 2, 'Golden'),
(6, 2, 'Cream'),
(7, 2, 'Orange'),
(8, 2, 'Red'),
(9, 2, 'Yellow'),
(10, 2, 'Green'),
(11, 2, 'Blue'),
(12, 2, 'Pink'),
(13, 2, 'Purple'),
(14, 2, 'Multicolor'),
(15, 2, 'Striped');

-- Insert Russian localizations
INSERT INTO "PetColorLocalizations" ("PetColorId", "AppLocaleId", "Title")
VALUES
(1, 3, 'Чёрный'),
(2, 3, 'Белый'),
(3, 3, 'Коричневый'),
(4, 3, 'Серый'),
(5, 3, 'Золотой'),
(6, 3, 'Кремовый'),
(7, 3, 'Оранжевый'),
(8, 3, 'Красный'),
(9, 3, 'Жёлтый'),
(10, 3, 'Зелёный'),
(11, 3, 'Синий'),
(12, 3, 'Розовый'),
(13, 3, 'Фиолетовый'),
(14, 3, 'Разноцветный'),
(15, 3, 'Полосатый');

-- Verify
SELECT 
    pc."Id",
    pc."Key",
    pcl."Title" as "AzTitle",
    pc."BackgroundColor",
    pc."TextColor"
FROM "PetColors" pc
JOIN "PetColorLocalizations" pcl ON pc."Id" = pcl."PetColorId"
JOIN "AppLocales" al ON pcl."AppLocaleId" = al."Id"
WHERE al."Code" = 'az'
ORDER BY pc."SortOrder";

-- Count
SELECT COUNT(*) as total_colors FROM "PetColors";
SELECT COUNT(*) as total_localizations FROM "PetColorLocalizations";
