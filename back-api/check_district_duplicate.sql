-- Check if "Alaşa" district exists
SELECT d."Id", d."NameAz", d."NameEn", d."NameRu", d."CityId", c."NameAz" as "CityName", d."IsDeleted"
FROM "Districts" d
JOIN "Cities" c ON d."CityId" = c."Id"
WHERE d."NameAz" ILIKE '%Alaş%' OR d."NameEn" ILIKE '%Alaş%' OR d."NameRu" ILIKE '%Alaş%';
