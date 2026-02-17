$env:PGPASSWORD='petwebsite_pass_2024'
$sql = @"
CREATE TABLE IF NOT EXISTS "PetAdQuestionReplies" (
    "Id" SERIAL PRIMARY KEY,
    "QuestionId" INTEGER NOT NULL,
    "UserId" UUID NOT NULL,
    "Text" VARCHAR(1000) NOT NULL,
    "IsOwnerReply" BOOLEAN NOT NULL DEFAULT FALSE,
    "CreatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "CreatedBy" UUID NULL,
    "UpdatedAt" TIMESTAMP NULL,
    "UpdatedBy" UUID NULL,
    "IsDeleted" BOOLEAN NOT NULL DEFAULT FALSE,
    "DeletedAt" TIMESTAMP NULL,
    "DeletedBy" UUID NULL,
    CONSTRAINT "FK_PetAdQuestionReplies_PetAdQuestions_QuestionId" 
        FOREIGN KEY ("QuestionId") REFERENCES "PetAdQuestions"("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_PetAdQuestionReplies_RegularUsers_UserId" 
        FOREIGN KEY ("UserId") REFERENCES "RegularUsers"("Id") ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS "IX_PetAdQuestionReplies_QuestionId_CreatedAt" 
    ON "PetAdQuestionReplies"("QuestionId", "CreatedAt");
"@

$sql | psql -h 127.0.0.1 -p 5433 -U petwebsite_user -d PetWebsiteDb
