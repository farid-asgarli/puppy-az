-- Check existing StaticSections data
SELECT 
    ss."Id",
    ss."Key",
    ss."IsActive",
    COUNT(ssl."Id") as localization_count
FROM "StaticSections" ss
LEFT JOIN "StaticSectionLocalizations" ssl ON ss."Id" = ssl."StaticSectionId"
WHERE ss."Id" = 1
GROUP BY ss."Id", ss."Key", ss."IsActive";

-- Check existing localizations for home_hero
SELECT 
    ssl."Id",
    ssl."StaticSectionId",
    ssl."AppLocaleId",
    al."Code" as locale_code,
    ssl."Title",
    ssl."Subtitle",
    LENGTH(ssl."Content") as content_length,
    ssl."Metadata"
FROM "StaticSectionLocalizations" ssl
JOIN "AppLocales" al ON ssl."AppLocaleId" = al."Id"
WHERE ssl."StaticSectionId" = 1
ORDER BY al."Code";
