SELECT "Id", "NameAz", length("NameAz") as len, encode("NameAz"::bytea, 'hex') as hex_data FROM "Districts" WHERE "Id" = 1;
