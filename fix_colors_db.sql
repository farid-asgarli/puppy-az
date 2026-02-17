-- Fix corrupted color values in PetAds table
-- Match by hex encoding since PowerShell corrupts UTF-8 chars

-- A? (413f) → Ağ
UPDATE "PetAds" SET "Color" = E'\x41\xc4\x9f' WHERE encode("Color"::bytea, 'hex') = '413f';

-- Q?hv?yi (513f68763f7969) → Qəhvəyi  
UPDATE "PetAds" SET "Color" = E'\x51\xc9\x99\x68\x76\xc9\x99\x79\x69' WHERE encode("Color"::bytea, 'hex') = '513f68763f7969';

-- Q?z?l? (513f7a3f6c3f) → Qızılı
UPDATE "PetAds" SET "Color" = E'\x51\xc4\xb1\x7a\xc4\xb1\x6c\xc4\xb1' WHERE encode("Color"::bytea, 'hex') = '513f7a3f6c3f';

-- Sar? (5361723f) → Sarı
UPDATE "PetAds" SET "Color" = E'\x53\x61\x72\xc4\xb1' WHERE encode("Color"::bytea, 'hex') = '5361723f';

-- Xall? (58616c6c3f) → Xallı
UPDATE "PetAds" SET "Color" = E'\x58\x61\x6c\x6c\xc4\xb1' WHERE encode("Color"::bytea, 'hex') = '58616c6c3f';

-- Zolaql? (5a6f6c61716c3f) → Zolaqlı
UPDATE "PetAds" SET "Color" = E'\x5a\x6f\x6c\x61\x71\x6c\xc4\xb1' WHERE encode("Color"::bytea, 'hex') = '5a6f6c61716c3f';

-- ?oxr?ngli (3f6f78723f6e676c69) → Çoxrəngli
UPDATE "PetAds" SET "Color" = E'\xc3\x87\x6f\x78\x72\xc9\x99\x6e\x67\x6c\x69' WHERE encode("Color"::bytea, 'hex') = '3f6f78723f6e676c69';
