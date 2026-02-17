CREATE TABLE "BreedSuggestions" (
    "Id" SERIAL PRIMARY KEY,
    "Name" VARCHAR(100) NOT NULL,
    "PetCategoryId" INTEGER NOT NULL,
    "UserId" UUID NULL,
    "Status" INTEGER NOT NULL DEFAULT 0,
    "ApprovedBreedId" INTEGER NULL,
    "AdminNote" VARCHAR(500) NULL,
    "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "CreatedBy" UUID NULL,
    "UpdatedAt" TIMESTAMP WITH TIME ZONE NULL,
    "UpdatedBy" UUID NULL,
    CONSTRAINT "FK_BreedSuggestions_PetCategories" FOREIGN KEY ("PetCategoryId") REFERENCES "PetCategories"("Id") ON DELETE RESTRICT,
    CONSTRAINT "FK_BreedSuggestions_RegularUsers" FOREIGN KEY ("UserId") REFERENCES "RegularUsers"("Id") ON DELETE SET NULL,
    CONSTRAINT "FK_BreedSuggestions_PetBreeds" FOREIGN KEY ("ApprovedBreedId") REFERENCES "PetBreeds"("Id") ON DELETE SET NULL
);

CREATE INDEX "IX_BreedSuggestions_Status" ON "BreedSuggestions"("Status");
CREATE INDEX "IX_BreedSuggestions_PetCategoryId" ON "BreedSuggestions"("PetCategoryId");
