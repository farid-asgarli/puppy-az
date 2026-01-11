using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace PetWebsite.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemoveContactFieldsFromPetAd : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ContactEmail",
                table: "PetAds");

            migrationBuilder.DropColumn(
                name: "ContactPhone",
                table: "PetAds");

            migrationBuilder.CreateTable(
                name: "PetAdViews",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    PetAdId = table.Column<int>(type: "integer", nullable: false),
                    ViewedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PetAdViews", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PetAdViews_PetAds_PetAdId",
                        column: x => x.PetAdId,
                        principalTable: "PetAds",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PetAdViews_RegularUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "RegularUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PetAdViews_PetAdId",
                table: "PetAdViews",
                column: "PetAdId");

            migrationBuilder.CreateIndex(
                name: "IX_PetAdViews_UserId_PetAdId",
                table: "PetAdViews",
                columns: new[] { "UserId", "PetAdId" });

            migrationBuilder.CreateIndex(
                name: "IX_PetAdViews_UserId_ViewedAt",
                table: "PetAdViews",
                columns: new[] { "UserId", "ViewedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_PetAdViews_ViewedAt",
                table: "PetAdViews",
                column: "ViewedAt");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PetAdViews");

            migrationBuilder.AddColumn<string>(
                name: "ContactEmail",
                table: "PetAds",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ContactPhone",
                table: "PetAds",
                type: "character varying(20)",
                maxLength: 20,
                nullable: true);
        }
    }
}
