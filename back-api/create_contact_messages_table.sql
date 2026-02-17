-- Create ContactMessages table
CREATE TABLE "ContactMessages" (
    "Id" SERIAL PRIMARY KEY,
    "SenderName" VARCHAR(200),
    "SenderEmail" VARCHAR(200),
    "SenderPhone" VARCHAR(50),
    "UserId" UUID,
    "Subject" VARCHAR(500),
    "Message" TEXT NOT NULL,
    "MessageType" INTEGER NOT NULL DEFAULT 0,
    "Status" INTEGER NOT NULL DEFAULT 0,
    "LanguageCode" VARCHAR(10) NOT NULL DEFAULT 'az',
    "AdminReply" TEXT,
    "ReadAt" TIMESTAMP,
    "ReadByAdminId" UUID,
    "RepliedAt" TIMESTAMP,
    "RepliedByAdminId" UUID,
    "IpAddress" VARCHAR(50),
    "UserAgent" TEXT,
    "SourceUrl" VARCHAR(500),
    "InternalNotes" TEXT,
    "IsSpam" BOOLEAN NOT NULL DEFAULT FALSE,
    "IsStarred" BOOLEAN NOT NULL DEFAULT FALSE,
    "IsArchived" BOOLEAN NOT NULL DEFAULT FALSE,
    "CreatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "UpdatedAt" TIMESTAMP,
    "CreatedBy" UUID,
    "UpdatedBy" UUID,
    "IsDeleted" BOOLEAN NOT NULL DEFAULT FALSE,
    "DeletedAt" TIMESTAMP,
    "DeletedBy" UUID
);

-- Create indexes
CREATE INDEX "IX_ContactMessages_Status" ON "ContactMessages" ("Status");
CREATE INDEX "IX_ContactMessages_MessageType" ON "ContactMessages" ("MessageType");
CREATE INDEX "IX_ContactMessages_UserId" ON "ContactMessages" ("UserId");
CREATE INDEX "IX_ContactMessages_CreatedAt" ON "ContactMessages" ("CreatedAt");
CREATE INDEX "IX_ContactMessages_IsDeleted" ON "ContactMessages" ("IsDeleted");

-- Seed some test data
INSERT INTO "ContactMessages" 
("SenderName", "SenderEmail", "SenderPhone", "Subject", "Message", "MessageType", "Status", "LanguageCode", "IpAddress", "CreatedAt")
VALUES
('Əli Məmmədov', 'ali@example.com', '+994501234567', 'Elan yerləşdirmə haqqında', 'Salam, elan yerləşdirmə prosesi ilə bağlı məlumat almaq istərdim. Təşəkkürlər.', 0, 0, 'az', '192.168.1.1', NOW() - INTERVAL '2 days'),
('Leyla Həsənova', 'leyla@example.com', '+994551234567', 'Ödəniş problemi', 'Premium elan üçün ödəniş etdim, amma aktivləşmədi. Kömək edə bilərsinizmi?', 1, 0, 'az', '192.168.1.2', NOW() - INTERVAL '1 day'),
('Rauf Quliyev', 'rauf@example.com', '+994701234567', 'Hesab silmə', 'Hesabımı silmək istəyirəm. Bu necə mümkündür?', 2, 1, 'az', '192.168.1.3', NOW() - INTERVAL '12 hours'),
('Nigar Əliyeva', 'nigar@example.com', '+994551112233', 'Şəkil yükləmə problemi', 'Elan yaradarkən şəkil yükləyə bilmirəm. Error mesajı alıram.', 1, 0, 'az', '192.168.1.4', NOW() - INTERVAL '6 hours'),
('Kamran Bayramov', 'kamran@example.com', '+994502223344', 'Təklif və rəy', 'Saytınız çox gözəldir! Bəzi təkliflərim var: mobil tətbiq yaratmaq, push bildirişlər əlavə etmək.', 3, 0, 'az', '192.168.1.5', NOW() - INTERVAL '3 hours');

-- Update one message as read
UPDATE "ContactMessages"
SET "Status" = 1, 
    "ReadAt" = NOW() - INTERVAL '6 hours'
WHERE "Id" = 3;

-- Verify
SELECT 
    "Id",
    "SenderName",
    "Subject",
    "Status",
    "MessageType",
    "CreatedAt"
FROM "ContactMessages"
ORDER BY "CreatedAt" DESC;

-- Count by status
SELECT 
    "Status",
    COUNT(*) as count
FROM "ContactMessages"
GROUP BY "Status";
