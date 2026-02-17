-- Create Conversations table
CREATE TABLE "Conversations" (
    "Id" serial NOT NULL,
    "PetAdId" integer NOT NULL,
    "InitiatorId" uuid NOT NULL,
    "OwnerId" uuid NOT NULL,
    "LastMessageContent" character varying(500) NOT NULL,
    "LastMessageAt" timestamp with time zone NOT NULL,
    "InitiatorUnreadCount" integer NOT NULL DEFAULT 0,
    "OwnerUnreadCount" integer NOT NULL DEFAULT 0,
    "IsArchivedByInitiator" boolean NOT NULL DEFAULT FALSE,
    "IsArchivedByOwner" boolean NOT NULL DEFAULT FALSE,
    "CreatedAt" timestamp with time zone NOT NULL,
    "CreatedBy" uuid NULL,
    "UpdatedAt" timestamp with time zone NULL,
    "UpdatedBy" uuid NULL,
    CONSTRAINT "PK_Conversations" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_Conversations_PetAds_PetAdId" FOREIGN KEY ("PetAdId") REFERENCES "PetAds" ("Id") ON DELETE RESTRICT,
    CONSTRAINT "FK_Conversations_RegularUsers_InitiatorId" FOREIGN KEY ("InitiatorId") REFERENCES "RegularUsers" ("Id") ON DELETE RESTRICT,
    CONSTRAINT "FK_Conversations_RegularUsers_OwnerId" FOREIGN KEY ("OwnerId") REFERENCES "RegularUsers" ("Id") ON DELETE RESTRICT
);

-- Create indexes for Conversations
CREATE INDEX "IX_Conversations_InitiatorId" ON "Conversations" ("InitiatorId");
CREATE INDEX "IX_Conversations_LastMessageAt" ON "Conversations" ("LastMessageAt");
CREATE INDEX "IX_Conversations_OwnerId" ON "Conversations" ("OwnerId");
CREATE UNIQUE INDEX "IX_Conversations_PetAdId_InitiatorId_OwnerId" ON "Conversations" ("PetAdId", "InitiatorId", "OwnerId");

-- Create Messages table
CREATE TABLE "Messages" (
    "Id" serial NOT NULL,
    "ConversationId" integer NOT NULL,
    "SenderId" uuid NOT NULL,
    "Content" character varying(2000) NOT NULL,
    "IsRead" boolean NOT NULL DEFAULT FALSE,
    "ReadAt" timestamp with time zone NULL,
    "IsDeletedBySender" boolean NOT NULL DEFAULT FALSE,
    "IsDeletedByRecipient" boolean NOT NULL DEFAULT FALSE,
    "CreatedAt" timestamp with time zone NOT NULL,
    "CreatedBy" uuid NULL,
    "UpdatedAt" timestamp with time zone NULL,
    "UpdatedBy" uuid NULL,
    CONSTRAINT "PK_Messages" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_Messages_Conversations_ConversationId" FOREIGN KEY ("ConversationId") REFERENCES "Conversations" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_Messages_RegularUsers_SenderId" FOREIGN KEY ("SenderId") REFERENCES "RegularUsers" ("Id") ON DELETE RESTRICT
);

-- Create indexes for Messages
CREATE INDEX "IX_Messages_ConversationId" ON "Messages" ("ConversationId");
CREATE INDEX "IX_Messages_CreatedAt" ON "Messages" ("CreatedAt");
CREATE INDEX "IX_Messages_SenderId" ON "Messages" ("SenderId");
