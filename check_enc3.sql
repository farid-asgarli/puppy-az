SELECT "Id", "NameAz", encode(substring("NameAz"::bytea from 1 for 10), 'hex') as first_bytes FROM "Districts" WHERE "CityId" = 1 ORDER BY "DisplayOrder" LIMIT 5;
