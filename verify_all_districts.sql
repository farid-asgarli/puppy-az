SELECT c."NameAz" AS "Şəhər", COUNT(d."Id") AS "Rayonlar"
FROM "Cities" c
LEFT JOIN "Districts" d ON d."CityId" = c."Id" AND d."IsDeleted" = false
WHERE c."Id" <= 70
GROUP BY c."Id", c."NameAz"
ORDER BY c."Id";
