-- Cinslərin RU lokallaşdırmasını əlavə et
-- Əvvəlcə mövcud cinslərin EN lokallaşdırmasından RU əlavə edəcəyik

BEGIN;

-- Bütün cinslərin RU lokallaşdırmasını əlavə et (EN-dən götürülmüş title ilə, sonra manual düzəldilə bilər)
-- Əgər RU lokallaşdırma yoxdursa, EN-dəki title-dan istifadə edərək əlavə et

INSERT INTO "PetBreedLocalizations" ("Title", "PetBreedId", "AppLocaleId")
SELECT 
    COALESCE(en_loc."Title", pb."Name"),
    pb."Id",
    ru_locale."Id"
FROM "PetBreeds" pb
CROSS JOIN "AppLocales" ru_locale
LEFT JOIN "PetBreedLocalizations" en_loc ON en_loc."PetBreedId" = pb."Id" 
    AND en_loc."AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'en')
LEFT JOIN "PetBreedLocalizations" existing_ru ON existing_ru."PetBreedId" = pb."Id" 
    AND existing_ru."AppLocaleId" = ru_locale."Id"
WHERE ru_locale."Code" = 'ru'
AND existing_ru."Id" IS NULL
AND pb."DeletedAt" IS NULL;

-- İndi ən populyar cinslərin rus dilində düzgün adlarını yeniləyək

-- İtlər
UPDATE "PetBreedLocalizations" SET "Title" = 'Лабрадор ретривер' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Labrador Retriever' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Немецкая овчарка' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'German Shepherd' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Золотистый ретривер' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Golden Retriever' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Французский бульдог' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'French Bulldog' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Бигль' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Beagle' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Чихуахуа' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Chihuahua' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Померанский шпиц' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Pomeranian' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Йоркширский терьер' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Yorkshire Terrier' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Ши-тцу' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Shih Tzu' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Мальтийская болонка' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Maltese' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Той-пудель' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Toy Poodle' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Такса' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Dachshund' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Бордер-колли' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Border Collie' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Кокер-спаниель' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Cocker Spaniel' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Австралийская овчарка' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Australian Shepherd' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Корги' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Corgi' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Бульдог' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Bulldog' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Сибирский хаски' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Siberian Husky' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Немецкий дог' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Great Dane' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Сенбернар' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Saint Bernard' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Ньюфаундленд' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Newfoundland' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Бернский зенненхунд' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Bernese Mountain Dog' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Ротвейлер' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Rottweiler' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Доберман' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Doberman' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

-- Pişiklər
UPDATE "PetBreedLocalizations" SET "Title" = 'Мейн-кун' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Maine Coon' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Рэгдолл' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Ragdoll' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Персидская' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Persian' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Сиамская' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Siamese' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Бенгальская' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Bengal' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Британская короткошёрстная' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'British Shorthair' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Американская короткошёрстная' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'American Shorthair' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Девон-рекс' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Devon Rex' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Сфинкс' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Sphynx' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Русская голубая' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Russian Blue' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Норвежская лесная' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Norwegian Forest Cat' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Гималайская' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Himalayan' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Сибирская' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Siberian' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Турецкая ангора' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Turkish Angora' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

-- Quşlar
UPDATE "PetBreedLocalizations" SET "Title" = 'Волнистый попугай' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Budgerigar (Budgie)' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Канарейка' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Canary' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Зяблик' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Finch' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Неразлучник' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Lovebird' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Корелла' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Cockatiel' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Конур' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Conure' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Квакер' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Quaker Parrot' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Ожереловый попугай' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Ringneck Parakeet' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Африканский серый' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'African Grey' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Какаду' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Cockatoo' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Ара' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Macaw' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Амазон' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Amazon Parrot' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

-- Balıqlar
UPDATE "PetBreedLocalizations" SET "Title" = 'Золотая рыбка' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Goldfish' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Бойцовая рыбка' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Betta' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Гуппи' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Guppy' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Неоновая тетра' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Neon Tetra' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Скалярия' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Angelfish' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Дискус' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Discus' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Карп кои' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Koi' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Рыба-клоун' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Clownfish' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Рыба-хирург' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Tang' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Рыба-ласточка' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Damselfish' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Крылатка' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Lionfish' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Рыба-бабочка' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Butterflyfish' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Антиас' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Anthias' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Дельфин' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Dolphin' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

-- Gəmiricilər
UPDATE "PetBreedLocalizations" SET "Title" = 'Морская свинка' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Guinea Pig' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Хомяк' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Hamster' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Песчанка' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Gerbil' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Крыса' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Rat' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Мышь' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Mouse' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Шиншилла' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Chinchilla' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Дегу' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Degu' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Сирийский хомяк' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Syrian Hamster' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Карликовый хомяк' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Dwarf Hamster' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Хомяк Роборовского' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Roborovski Hamster' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

-- Dovşanlar
UPDATE "PetBreedLocalizations" SET "Title" = 'Голландский вислоухий' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Holland Lop' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Нидерландский карликовый' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Netherland Dwarf' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Мини-рекс' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Mini Rex' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Голландский кролик' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Dutch' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Фландр' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Flemish Giant' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Польский кролик' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Polish' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Джерси Вули' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Jersey Wooly' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

UPDATE "PetBreedLocalizations" SET "Title" = 'Львиная головка' 
WHERE "PetBreedId" = (SELECT "Id" FROM "PetBreeds" WHERE "Name" = 'Lionhead' LIMIT 1) 
AND "AppLocaleId" = (SELECT "Id" FROM "AppLocales" WHERE "Code" = 'ru');

COMMIT;
