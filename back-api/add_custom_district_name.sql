-- Add CustomDistrictName column to PetAds table
ALTER TABLE "PetAds" ADD COLUMN IF NOT EXISTS "CustomDistrictName" character varying(100) NULL;

-- Record migration in EF history
INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
SELECT '20250101000003_AddCustomDistrictName', '8.0.11'
WHERE NOT EXISTS (
    SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20250101000003_AddCustomDistrictName'
);
