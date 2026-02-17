-- Create PetColors table
CREATE TABLE "PetColors" (
    "Id" SERIAL PRIMARY KEY,
    "Key" VARCHAR(50) NOT NULL,
    "BackgroundColor" VARCHAR(50) NOT NULL,
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
('multicolor', 'bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500', 'text-white', 'border-gray-300', 14, TRUE),
('striped', 'bg-gray-200', 'text-gray-900', 'border-gray-300', 15, TRUE);

-- Insert Azerbaijani localizations
INSERT INTO "PetColorLocalizations" ("PetColorId", "AppLocaleId", "Title")
SELECT 1, 1, 'Qara'
UNION ALL SELECT 2, 1, 'Ağ'
UNION ALL SELECT 3, 1, 'Qəhvəyi'
UNION ALL SELECT 4, 1, 'Boz'
UNION ALL SELECT 5, 1, 'Qızılı'
UNION ALL SELECT 6, 1, 'Krem'
UNION ALL SELECT 7, 1, 'Narıncı'
UNION ALL SELECT 8, 1, 'Qırmızı'
UNION ALL SELECT 9, 1, 'Sarı'
UNION ALL SELECT 10, 1, 'Yaşıl'
UNION ALL SELECT 11, 1, 'Mavi'
UNION ALL SELECT 12, 1, 'Çəhrayı'
UNION ALL SELECT 13, 1, 'Bənövşəyi'
UNION ALL SELECT 14, 1, 'Çoxrəngli'
UNION ALL SELECT 15, 1, 'Zolaqlı';

-- Insert English localizations
INSERT INTO "PetColorLocalizations" ("PetColorId", "AppLocaleId", "Title")
SELECT 1, 2, 'Black'
UNION ALL SELECT 2, 2, 'White'
UNION ALL SELECT 3, 2, 'Brown'
UNION ALL SELECT 4, 2, 'Gray'
UNION ALL SELECT 5, 2, 'Golden'
UNION ALL SELECT 6, 2, 'Cream'
UNION ALL SELECT 7, 2, 'Orange'
UNION ALL SELECT 8, 2, 'Red'
UNION ALL SELECT 9, 2, 'Yellow'
UNION ALL SELECT 10, 2, 'Green'
UNION ALL SELECT 11, 2, 'Blue'
UNION ALL SELECT 12, 2, 'Pink'
UNION ALL SELECT 13, 2, 'Purple'
UNION ALL SELECT 14, 2, 'Multicolor'
UNION ALL SELECT 15, 2, 'Striped';

-- Insert Russian localizations
INSERT INTO "PetColorLocalizations" ("PetColorId", "AppLocaleId", "Title")
SELECT 1, 3, 'Чёрный'
UNION ALL SELECT 2, 3, 'Белый'
UNION ALL SELECT 3, 3, 'Коричневый'
UNION ALL SELECT 4, 3, 'Серый'
UNION ALL SELECT 5, 3, 'Золотой'
UNION ALL SELECT 6, 3, 'Кремовый'
UNION ALL SELECT 7, 3, 'Оранжевый'
UNION ALL SELECT 8, 3, 'Красный'
UNION ALL SELECT 9, 3, 'Жёлтый'
UNION ALL SELECT 10, 3, 'Зелёный'
UNION ALL SELECT 11, 3, 'Синий'
UNION ALL SELECT 12, 3, 'Розовый'
UNION ALL SELECT 13, 3, 'Фиолетовый'
UNION ALL SELECT 14, 3, 'Разноцветный'
UNION ALL SELECT 15, 3, 'Полосатый';

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
