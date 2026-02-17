-- Create PetColorLocalizations table if not exists and insert data

-- Create table
CREATE TABLE IF NOT EXISTS "PetColorLocalizations" (
    "Id" SERIAL PRIMARY KEY,
    "PetColorId" INTEGER NOT NULL,
    "AppLocaleId" INTEGER NOT NULL,
    "Title" VARCHAR(100) NOT NULL,
    CONSTRAINT "FK_PetColorLocalizations_PetColors" 
        FOREIGN KEY ("PetColorId") REFERENCES "PetColors"("Id") ON DELETE CASCADE,
    CONSTRAINT "UQ_PetColorLocalizations_Color_Locale" 
        UNIQUE ("PetColorId", "AppLocaleId")
);

CREATE INDEX IF NOT EXISTS "IX_PetColorLocalizations_PetColorId" 
    ON "PetColorLocalizations"("PetColorId");

CREATE INDEX IF NOT EXISTS "IX_PetColorLocalizations_AppLocaleId" 
    ON "PetColorLocalizations"("AppLocaleId");

-- Delete existing localizations
DELETE FROM "PetColorLocalizations";

-- Insert localizations for Azerbaijani (AppLocaleId = 1)
INSERT INTO "PetColorLocalizations" ("PetColorId", "AppLocaleId", "Title")
VALUES
  (1, 1, 'Qara'),
  (2, 1, 'Ağ'),
  (3, 1, 'Boz'),
  (4, 1, 'Qəhvəyi'),
  (5, 1, 'Qızılı'),
  (6, 1, 'Krem'),
  (7, 1, 'Bej'),
  (8, 1, 'Qırmızı'),
  (9, 1, 'Narıncı'),
  (10, 1, 'Sarı'),
  (11, 1, 'Yaşıl'),
  (12, 1, 'Mavi'),
  (13, 1, 'Xallı'),
  (14, 1, 'Zolaqlı'),
  (15, 1, 'Qarışıq');

-- Insert localizations for English (AppLocaleId = 2)
INSERT INTO "PetColorLocalizations" ("PetColorId", "AppLocaleId", "Title")
VALUES
  (1, 2, 'Black'),
  (2, 2, 'White'),
  (3, 2, 'Gray'),
  (4, 2, 'Brown'),
  (5, 2, 'Golden'),
  (6, 2, 'Cream'),
  (7, 2, 'Beige'),
  (8, 2, 'Red'),
  (9, 2, 'Orange'),
  (10, 2, 'Yellow'),
  (11, 2, 'Green'),
  (12, 2, 'Blue'),
  (13, 2, 'Spotted'),
  (14, 2, 'Striped'),
  (15, 2, 'Mixed');

-- Insert localizations for Russian (AppLocaleId = 3)
INSERT INTO "PetColorLocalizations" ("PetColorId", "AppLocaleId", "Title")
VALUES
  (1, 3, 'Черный'),
  (2, 3, 'Белый'),
  (3, 3, 'Серый'),
  (4, 3, 'Коричневый'),
  (5, 3, 'Золотой'),
  (6, 3, 'Кремовый'),
  (7, 3, 'Бежевый'),
  (8, 3, 'Красный'),
  (9, 3, 'Оранжевый'),
  (10, 3, 'Желтый'),
  (11, 3, 'Зеленый'),
  (12, 3, 'Синий'),
  (13, 3, 'Пятнистый'),
  (14, 3, 'Полосатый'),
  (15, 3, 'Смешанный');

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
