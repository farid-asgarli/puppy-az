ALTER TABLE "PetAds" ADD COLUMN IF NOT EXISTS "IsVip" boolean NOT NULL DEFAULT false;
ALTER TABLE "PetAds" ADD COLUMN IF NOT EXISTS "VipActivatedAt" timestamp without time zone;
ALTER TABLE "PetAds" ADD COLUMN IF NOT EXISTS "VipExpiresAt" timestamp without time zone;

-- Create missing tables that migration expects
CREATE TABLE IF NOT EXISTS "PetAdTypes" (
    "Id" integer NOT NULL,
    "Name" character varying(50) NOT NULL,
    "CreatedAt" timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PK_PetAdTypes" PRIMARY KEY ("Id")
);

CREATE TABLE IF NOT EXISTS "PetAdTypeLocalizations" (
    "Id" serial NOT NULL,
    "PetAdTypeId" integer NOT NULL,
    "AppLocaleId" integer NOT NULL,
    "Name" character varying(100) NOT NULL,
    CONSTRAINT "PK_PetAdTypeLocalizations" PRIMARY KEY ("Id")
);

CREATE TABLE IF NOT EXISTS "StaticSections" (
    "Id" serial NOT NULL,
    "Key" character varying(100) NOT NULL UNIQUE,
    "IsActive" boolean NOT NULL DEFAULT true,
    "CreatedAt" timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" timestamp without time zone,
    CONSTRAINT "PK_StaticSections" PRIMARY KEY ("Id")
);

CREATE TABLE IF NOT EXISTS "StaticSectionLocalizations" (
    "Id" serial NOT NULL,
    "StaticSectionId" integer NOT NULL,
    "AppLocaleId" integer NOT NULL,
    "Title" character varying(200),
    "Subtitle" character varying(500),
    "Content" text,
    "Metadata" jsonb,
    CONSTRAINT "PK_StaticSectionLocalizations" PRIMARY KEY ("Id")
);

SELECT 'Columns added successfully!' as result;
