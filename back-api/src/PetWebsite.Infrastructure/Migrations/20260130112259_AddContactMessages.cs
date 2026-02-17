using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace PetWebsite.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddContactMessages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ContactMessages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SenderName = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    SenderEmail = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    SenderPhone = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: true),
                    UserId = table.Column<Guid>(type: "uuid", nullable: true),
                    Subject = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    Message = table.Column<string>(type: "character varying(5000)", maxLength: 5000, nullable: false),
                    MessageType = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    Status = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    LanguageCode = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false, defaultValue: "az"),
                    AdminReply = table.Column<string>(type: "character varying(5000)", maxLength: 5000, nullable: true),
                    ReadAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ReadByAdminId = table.Column<Guid>(type: "uuid", nullable: true),
                    RepliedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    RepliedByAdminId = table.Column<Guid>(type: "uuid", nullable: true),
                    IpAddress = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    UserAgent = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    SourceUrl = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    InternalNotes = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    IsSpam = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    IsStarred = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    IsArchived = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContactMessages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ContactMessages_RegularUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "RegularUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ContactMessages_CreatedAt",
                table: "ContactMessages",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_ContactMessages_IsArchived",
                table: "ContactMessages",
                column: "IsArchived");

            migrationBuilder.CreateIndex(
                name: "IX_ContactMessages_IsSpam",
                table: "ContactMessages",
                column: "IsSpam");

            migrationBuilder.CreateIndex(
                name: "IX_ContactMessages_IsStarred",
                table: "ContactMessages",
                column: "IsStarred");

            migrationBuilder.CreateIndex(
                name: "IX_ContactMessages_MessageType",
                table: "ContactMessages",
                column: "MessageType");

            migrationBuilder.CreateIndex(
                name: "IX_ContactMessages_ReadByAdminId",
                table: "ContactMessages",
                column: "ReadByAdminId");

            migrationBuilder.CreateIndex(
                name: "IX_ContactMessages_RepliedByAdminId",
                table: "ContactMessages",
                column: "RepliedByAdminId");

            migrationBuilder.CreateIndex(
                name: "IX_ContactMessages_SenderEmail",
                table: "ContactMessages",
                column: "SenderEmail");

            migrationBuilder.CreateIndex(
                name: "IX_ContactMessages_Status",
                table: "ContactMessages",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_ContactMessages_UserId",
                table: "ContactMessages",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ContactMessages");
        }
    }
}
