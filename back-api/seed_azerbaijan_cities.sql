-- Replace all cities with complete Azerbaijan cities list with proper encoding

BEGIN;

-- Update existing cities and insert new ones
-- First, mark all as deleted
UPDATE "Cities" SET "IsDeleted" = true;

-- Insert/Update all Azerbaijan cities with proper localization
INSERT INTO "Cities" ("Id", "NameAz", "NameEn", "NameRu", "IsDeleted", "CreatedAt") VALUES
    -- Major cities
    (1, 'Bakı', 'Baku', 'Баку', false, NOW()),
    (2, 'Gəncə', 'Ganja', 'Гянджа', false, NOW()),
    (3, 'Sumqayıt', 'Sumgait', 'Сумгаит', false, NOW()),
    (4, 'Mingəçevir', 'Mingachevir', 'Мингечевир', false, NOW()),
    (5, 'Şirvan', 'Shirvan', 'Ширван', false, NOW()),
    (6, 'Naxçıvan', 'Nakhchivan', 'Нахичевань', false, NOW()),
    (7, 'Lənkəran', 'Lankaran', 'Ленкоран', false, NOW()),
    (8, 'Şəki', 'Sheki', 'Шеки', false, NOW()),
    (9, 'Yevlax', 'Yevlakh', 'Евлах', false, NOW()),
    (10, 'Quba', 'Quba', 'Губа', false, NOW()),
    
    -- Regional centers and districts (alphabetically)
    (11, 'Abşeron', 'Absheron', 'Абшерон', false, NOW()),
    (12, 'Ağcabədi', 'Aghjabadi', 'Агджабеди', false, NOW()),
    (13, 'Ağdam', 'Agdam', 'Агдам', false, NOW()),
    (14, 'Ağdaş', 'Agdash', 'Агдаш', false, NOW()),
    (15, 'Ağstafa', 'Agstafa', 'Агстафа', false, NOW()),
    (16, 'Ağsu', 'Agsu', 'Агсу', false, NOW()),
    (17, 'Astara', 'Astara', 'Астара', false, NOW()),
    (18, 'Balakən', 'Balakan', 'Балакен', false, NOW()),
    (19, 'Bərdə', 'Barda', 'Барда', false, NOW()),
    (20, 'Beyləqan', 'Beylagan', 'Бейлаган', false, NOW()),
    
    (21, 'Biləsuvar', 'Bilasuvar', 'Билясувар', false, NOW()),
    (22, 'Cəbrayıl', 'Jabrayil', 'Джабраил', false, NOW()),
    (23, 'Cəlilabad', 'Jalilabad', 'Джалилабад', false, NOW()),
    (24, 'Culfa', 'Julfa', 'Джульфа', false, NOW()),
    (25, 'Daşkəsən', 'Dashkasan', 'Дашкесан', false, NOW()),
    (26, 'Füzuli', 'Fuzuli', 'Физули', false, NOW()),
    (27, 'Gədəbəy', 'Gadabay', 'Гедабей', false, NOW()),
    (28, 'Goranboy', 'Goranboy', 'Горанбой', false, NOW()),
    (29, 'Göyçay', 'Goychay', 'Гейчай', false, NOW()),
    (30, 'Göygöl', 'Goygol', 'Гейгель', false, NOW()),
    
    (31, 'Hacıqabul', 'Hajigabul', 'Гаджигабул', false, NOW()),
    (32, 'Xaçmaz', 'Khachmaz', 'Хачмаз', false, NOW()),
    (33, 'Xankəndi', 'Khankendi', 'Ханкенди', false, NOW()),
    (34, 'Xızı', 'Khizi', 'Хызы', false, NOW()),
    (35, 'Xocalı', 'Khojaly', 'Ходжалы', false, NOW()),
    (36, 'Xocavənd', 'Khojavend', 'Ходжавенд', false, NOW()),
    (37, 'İmişli', 'Imishli', 'Имишли', false, NOW()),
    (38, 'İsmayıllı', 'Ismayilli', 'Исмаиллы', false, NOW()),
    (39, 'Kəlbəcər', 'Kalbajar', 'Кельбаджар', false, NOW()),
    (40, 'Kürdəmir', 'Kurdamir', 'Кюрдамир', false, NOW()),
    
    (41, 'Laçın', 'Lachin', 'Лачын', false, NOW()),
    (42, 'Lerik', 'Lerik', 'Лерик', false, NOW()),
    (43, 'Masallı', 'Masally', 'Масаллы', false, NOW()),
    (44, 'Neftçala', 'Neftchala', 'Нефтчала', false, NOW()),
    (45, 'Oğuz', 'Oghuz', 'Огуз', false, NOW()),
    (46, 'Ordubad', 'Ordubad', 'Ордубад', false, NOW()),
    (47, 'Qəbələ', 'Gabala', 'Габала', false, NOW()),
    (48, 'Qax', 'Qakh', 'Гах', false, NOW()),
    (49, 'Qazax', 'Gazakh', 'Газах', false, NOW()),
    (50, 'Qobustan', 'Qobustan', 'Гобустан', false, NOW()),
    
    (51, 'Qusar', 'Qusar', 'Гусар', false, NOW()),
    (52, 'Saatlı', 'Saatli', 'Саатлы', false, NOW()),
    (53, 'Sabirabad', 'Sabirabad', 'Сабирабад', false, NOW()),
    (54, 'Sədərək', 'Sadarak', 'Садарак', false, NOW()),
    (55, 'Salyan', 'Salyan', 'Сальяны', false, NOW()),
    (56, 'Samux', 'Samukh', 'Самух', false, NOW()),
    (57, 'Şabran', 'Shabran', 'Шабран', false, NOW()),
    (58, 'Şahbuz', 'Shahbuz', 'Шахбуз', false, NOW()),
    (59, 'Şamaxı', 'Shamakhi', 'Шамахы', false, NOW()),
    (60, 'Şəmkir', 'Shamkir', 'Шамкир', false, NOW()),
    
    (61, 'Şərur', 'Sharur', 'Шарур', false, NOW()),
    (62, 'Siyəzən', 'Siyazan', 'Сиязань', false, NOW()),
    (63, 'Şuşa', 'Shusha', 'Шуша', false, NOW()),
    (64, 'Tərtər', 'Tartar', 'Тертер', false, NOW()),
    (65, 'Tovuz', 'Tovuz', 'Товуз', false, NOW()),
    (66, 'Ucar', 'Ujar', 'Уджар', false, NOW()),
    (67, 'Yardımlı', 'Yardimli', 'Ярдымлы', false, NOW()),
    (68, 'Zaqatala', 'Zagatala', 'Закатала', false, NOW()),
    (69, 'Zəngilan', 'Zangilan', 'Зангилан', false, NOW()),
    (70, 'Zərdab', 'Zardab', 'Зардаб', false, NOW()),
    
    -- Additional settlements
    (71, 'Balaxanı', 'Balakhani', 'Балаханы', false, NOW()),
    (72, 'Binəqədi', 'Binagadi', 'Бинагади', false, NOW()),
    (73, 'Buzovna', 'Buzovna', 'Бузовна', false, NOW()),
    (74, 'Çəmənli', 'Chamanli', 'Чаманлы', false, NOW()),
    (75, 'Dəvəçi', 'Davachi', 'Девечи', false, NOW()),
    (76, 'Digah', 'Digah', 'Дигах', false, NOW()),
    (77, 'Horadiz', 'Horadiz', 'Горадиз', false, NOW()),
    (78, 'Maştağa', 'Mashtaga', 'Маштага', false, NOW()),
    (79, 'Nardaran', 'Nardaran', 'Нардаран', false, NOW()),
    (80, 'Novxanı', 'Novkhani', 'Новханы', false, NOW()),
    
    (81, 'Pirallahı', 'Pirallahi', 'Пираллахы', false, NOW()),
    (82, 'Ramana', 'Ramana', 'Рамана', false, NOW()),
    (83, 'Sabunçu', 'Sabunchu', 'Сабунчи', false, NOW()),
    (84, 'Sanqaçal', 'Sangachal', 'Сангачалы', false, NOW()),
    (85, 'Şağan', 'Shagan', 'Шаган', false, NOW()),
    (86, 'Türkan', 'Turkan', 'Тюркян', false, NOW()),
    (87, 'Xırdalan', 'Khirdalan', 'Хырдалан', false, NOW()),
    (88, 'Zirə', 'Zira', 'Зиря', false, NOW())
ON CONFLICT ("Id") DO UPDATE SET
    "NameAz" = EXCLUDED."NameAz",
    "NameEn" = EXCLUDED."NameEn",
    "NameRu" = EXCLUDED."NameRu",
    "IsDeleted" = EXCLUDED."IsDeleted",
    "UpdatedAt" = NOW();

-- Verify insertion
SELECT 
    COUNT(*) as total_cities,
    COUNT(DISTINCT "NameAz") as unique_az,
    COUNT(DISTINCT "NameEn") as unique_en,
    COUNT(DISTINCT "NameRu") as unique_ru
FROM "Cities";

-- Show first 10 cities
SELECT "Id", "NameAz", "NameEn", "NameRu" FROM "Cities" ORDER BY "Id" LIMIT 10;

COMMIT;
