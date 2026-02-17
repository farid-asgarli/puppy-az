-- Fix all encoding corruption in the database
-- Using hex escape sequences to avoid PowerShell encoding issues

BEGIN;

-- ===== 1. Fix PetAds.Description (255 rows, 8 unique patterns + 1 template) =====

-- Pattern 1 (36 rows): "U?aqlarla ?ox yax??? anla???r, ?ox mehriban v? sadiqdir."
-- Correct: "Uşaqlarla çox yaxşı anlaşır, çox mehriban və sadiqdir."
UPDATE "PetAds" SET "Description" = E'U\xc5\x9faqlarla \xc3\xa7ox yax\xc5\x9f\xc4\xb1 anla\xc5\x9f\xc4\xb1r, \xc3\xa7ox mehriban v\xc9\x99 sadiqdir.'
WHERE encode("Description"::bytea, 'hex') = '553f3f3f3f3f61716c61726c61203f3f3f3f3f6f78207961783f3f3f3f3f3f3f3f3f3f3f20616e6c613f3f3f3f3f3f3f3f3f3f3f722c203f3f3f3f3f6f78206d6568726962616e20763f3f3f3f3f2073616469716469722e';

-- Pattern 2 (35 rows): "?ox aktiv v? oyna?ma??? sevir. B?y?k h?y?t laz?md?r."
-- Correct: "Çox aktiv və oynaşmağı sevir. Böyük həyət lazımdır."
UPDATE "PetAds" SET "Description" = E'\xc3\x87ox aktiv v\xc9\x99 oyna\xc5\x9fma\xc4\x9f\xc4\xb1 sevir. B\xc3\xb6y\xc3\xbck h\xc9\x99y\xc9\x99t laz\xc4\xb1md\xc4\xb1r.'
WHERE encode("Description"::bytea, 'hex') = '3f3f3f3f3f6f7820616b74697620763f3f3f3f3f206f796e613f3f3f3f3f6d613f3f3f3f3f3f3f3f3f3f3f2073657669722e20423f3f3f3f3f3f793f3f3f3f3f3f6b20683f3f3f3f3f793f3f3f3f3f74206c617a3f3f3f3f3f3f6d643f3f3f3f3f3f722e';

-- Pattern 3 (35 rows): "Sa?lam v? enerjili bir dost axtar?rs?n?zsa, bu sizin se??iminizdir."
-- Correct: "Sağlam və enerjili bir dost axtarırsınızsa, bu sizin seçiminizdir."
UPDATE "PetAds" SET "Description" = E'Sa\xc4\x9flam v\xc9\x99 enerjili bir dost axtar\xc4\xb1rs\xc4\xb1n\xc4\xb1zsa, bu sizin se\xc3\xa7iminizdir.'
WHERE encode("Description"::bytea, 'hex') = '53613f3f3f3f3f6c616d20763f3f3f3f3f20656e65726a696c692062697220646f73742061787461723f3f3f3f3f3f72733f3f3f3f3f3f6e3f3f3f3f3f3f7a73612c2062752073697a696e2073653f3f3f3f3f696d696e697a6469722e';

-- Pattern 4 (34 rows): "Ail? il? qalma??? ?ox sevir, t?k qalma??? sevmir."
-- Correct: "Ailə ilə qalmağı çox sevir, tək qalmağı sevmir."
UPDATE "PetAds" SET "Description" = E'Ail\xc9\x99 il\xc9\x99 qalma\xc4\x9f\xc4\xb1 \xc3\xa7ox sevir, t\xc9\x99k qalma\xc4\x9f\xc4\xb1 sevmir.'
WHERE encode("Description"::bytea, 'hex') = '41696c3f3f3f3f3f20696c3f3f3f3f3f2071616c6d613f3f3f3f3f3f3f3f3f3f3f203f3f3f3f3f6f782073657669722c20743f3f3f3f3f6b2071616c6d613f3f3f3f3f3f3f3f3f3f3f207365766d69722e';

-- Pattern 5 (32 rows): "G?z?l xasiyy?ti var, t?rbiy?lidir v? ita?tkardir."
-- Correct: "Gözəl xasiyyəti var, tərbiyəlidir və itaətkardir."
UPDATE "PetAds" SET "Description" = E'G\xc3\xb6z\xc9\x99l xasiyy\xc9\x99ti var, t\xc9\x99rbiy\xc9\x99lidir v\xc9\x99 ita\xc9\x99tkardir.'
WHERE encode("Description"::bytea, 'hex') = '473f3f3f3f3f3f7a3f3f3f3f3f6c207861736979793f3f3f3f3f7469207661722c20743f3f3f3f3f726269793f3f3f3f3f6c6964697220763f3f3f3f3f206974613f3f3f3f3f746b61726469722e';

-- Pattern 6 (30 rows): "Pe??kar t?lim ke?ib, ?ox a???ll?d?r."
-- Correct: "Peşəkar təlim keçib, çox ağıllıdır."
UPDATE "PetAds" SET "Description" = E'Pe\xc5\x9f\xc9\x99kar t\xc9\x99lim ke\xc3\xa7ib, \xc3\xa7ox a\xc4\x9f\xc4\xb1ll\xc4\xb1d\xc4\xb1r.'
WHERE encode("Description"::bytea, 'hex') = '50653f3f3f3f3f3f3f3f3f3f6b617220743f3f3f3f3f6c696d206b653f3f3f3f3f69622c203f3f3f3f3f6f7820613f3f3f3f3f3f3f3f3f3f3f6c6c3f3f3f3f3f3f643f3f3f3f3f3f722e';

-- Pattern 7 (29 rows): "Sakit v? rahat xasiyy?tlidir. Apartament ???n ideald?r."
-- Correct: "Sakit və rahat xasiyyətlidir. Apartament üçün idealdır."
UPDATE "PetAds" SET "Description" = E'Sakit v\xc9\x99 rahat xasiyy\xc9\x99tlidir. Apartament \xc3\xbc\xc3\xa7\xc3\xbcn ideald\xc4\xb1r.'
WHERE encode("Description"::bytea, 'hex') = '53616b697420763f3f3f3f3f207261686174207861736979793f3f3f3f3f746c696469722e204170617274616d656e74203f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f6e20696465616c643f3f3f3f3f3f722e';

-- Pattern 8 (23 rows): "?ox mehriban v? oyna?ma??? sevir. Ail? ???n ?lad?r."
-- Correct: "Çox mehriban və oynaşmağı sevir. Ailə üçün əladır."
UPDATE "PetAds" SET "Description" = E'\xc3\x87ox mehriban v\xc9\x99 oyna\xc5\x9fma\xc4\x9f\xc4\xb1 sevir. Ail\xc9\x99 \xc3\xbc\xc3\xa7\xc3\xbcn \xc9\x99lad\xc4\xb1r.'
WHERE encode("Description"::bytea, 'hex') = '3f3f3f3f3f6f78206d6568726962616e20763f3f3f3f3f206f796e613f3f3f3f3f6d613f3f3f3f3f3f3f3f3f3f3f2073657669722e2041696c3f3f3f3f3f203f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f6e203f3f3f3f3f6c61643f3f3f3f3f3f722e';

-- Pattern 9 (1 row, ad 504): Template with corrupted bullets + English headers
-- Replace with correct Azerbaijani template matching ad 526
UPDATE "PetAds" SET "Description" = E'N\xc9\x99 daxil etm\xc9\x99li\n\xe2\x80\xa2\n\xc5\x9e\xc9\x99xsiyy\xc9\x99t x\xc3\xbcsusiyy\xc9\x99tl\xc9\x99ri v\xc9\x99 temperament\n\xe2\x80\xa2\nSa\xc4\x9flaml\xc4\xb1q v\xc9\x99ziyy\xc9\x99ti v\xc9\x99 peyv\xc9\x99nd tarixi\n\xe2\x80\xa2\nT\xc9\x99lim s\xc9\x99viyy\xc9\x99si v\xc9\x99 davran\xc4\xb1\xc5\x9f\n\xe2\x80\xa2\nX\xc3\xbcsusi ehtiyaclar v\xc9\x99 ya t\xc9\x99l\xc9\x99bl\xc9\x99r\n\xe2\x80\xa2\nNiy\xc9\x99 yerl\xc9\x99\xc5\x9fdirirsiniz (sat\xc4\xb1\xc5\x9f/\xc3\xb6vladl\xc4\xb1\xc4\x9fa g\xc3\xb6t\xc3\xbcrm\xc9\x99/tap\xc4\xb1l\xc4\xb1b/itirilmi\xc5\x9fdir)\n\xe2\x80\xa2\nBu ev heyvan\xc4\xb1n\xc4\xb1 unikal ed\xc9\x99n n\xc9\x99dir'
WHERE "Id" = 504;


-- ===== 2. Fix PetColorLocalizations.Title (15 rows, Russian locale) =====

-- black (ru) - Чёрный
UPDATE "PetColorLocalizations" SET "Title" = E'\xd0\xa7\xd1\x91\xd1\x80\xd0\xbd\xd1\x8b\xd0\xb9' WHERE "Id" = 76;

-- white (ru) - Белый
UPDATE "PetColorLocalizations" SET "Title" = E'\xd0\x91\xd0\xb5\xd0\xbb\xd1\x8b\xd0\xb9' WHERE "Id" = 77;

-- gray (ru) - Серый
UPDATE "PetColorLocalizations" SET "Title" = E'\xd0\xa1\xd0\xb5\xd1\x80\xd1\x8b\xd0\xb9' WHERE "Id" = 78;

-- brown (ru) - Коричневый
UPDATE "PetColorLocalizations" SET "Title" = E'\xd0\x9a\xd0\xbe\xd1\x80\xd0\xb8\xd1\x87\xd0\xbd\xd0\xb5\xd0\xb2\xd1\x8b\xd0\xb9' WHERE "Id" = 79;

-- golden (ru) - Золотой
UPDATE "PetColorLocalizations" SET "Title" = E'\xd0\x97\xd0\xbe\xd0\xbb\xd0\xbe\xd1\x82\xd0\xbe\xd0\xb9' WHERE "Id" = 80;

-- cream (ru) - Кремовый
UPDATE "PetColorLocalizations" SET "Title" = E'\xd0\x9a\xd1\x80\xd0\xb5\xd0\xbc\xd0\xbe\xd0\xb2\xd1\x8b\xd0\xb9' WHERE "Id" = 81;

-- beige (ru) - Бежевый
UPDATE "PetColorLocalizations" SET "Title" = E'\xd0\x91\xd0\xb5\xd0\xb6\xd0\xb5\xd0\xb2\xd1\x8b\xd0\xb9' WHERE "Id" = 82;

-- red (ru) - Красный
UPDATE "PetColorLocalizations" SET "Title" = E'\xd0\x9a\xd1\x80\xd0\xb0\xd1\x81\xd0\xbd\xd1\x8b\xd0\xb9' WHERE "Id" = 83;

-- orange (ru) - Оранжевый
UPDATE "PetColorLocalizations" SET "Title" = E'\xd0\x9e\xd1\x80\xd0\xb0\xd0\xbd\xd0\xb6\xd0\xb5\xd0\xb2\xd1\x8b\xd0\xb9' WHERE "Id" = 84;

-- yellow (ru) - Жёлтый
UPDATE "PetColorLocalizations" SET "Title" = E'\xd0\x96\xd1\x91\xd0\xbb\xd1\x82\xd1\x8b\xd0\xb9' WHERE "Id" = 85;

-- green (ru) - Зелёный
UPDATE "PetColorLocalizations" SET "Title" = E'\xd0\x97\xd0\xb5\xd0\xbb\xd1\x91\xd0\xbd\xd1\x8b\xd0\xb9' WHERE "Id" = 86;

-- blue (ru) - Синий
UPDATE "PetColorLocalizations" SET "Title" = E'\xd0\xa1\xd0\xb8\xd0\xbd\xd0\xb8\xd0\xb9' WHERE "Id" = 87;

-- spotted (ru) - Пятнистый
UPDATE "PetColorLocalizations" SET "Title" = E'\xd0\x9f\xd1\x8f\xd1\x82\xd0\xbd\xd0\xb8\xd1\x81\xd1\x82\xd1\x8b\xd0\xb9' WHERE "Id" = 88;

-- striped (ru) - Полосатый
UPDATE "PetColorLocalizations" SET "Title" = E'\xd0\x9f\xd0\xbe\xd0\xbb\xd0\xbe\xd1\x81\xd0\xb0\xd1\x82\xd1\x8b\xd0\xb9' WHERE "Id" = 89;

-- mixed (ru) - Смешанный
UPDATE "PetColorLocalizations" SET "Title" = E'\xd0\xa1\xd0\xbc\xd0\xb5\xd1\x88\xd0\xb0\xd0\xbd\xd0\xbd\xd1\x8b\xd0\xb9' WHERE "Id" = 90;

COMMIT;
