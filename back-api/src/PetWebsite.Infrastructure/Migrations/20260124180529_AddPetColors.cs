using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace PetWebsite.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPetColors : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PetColors",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Key = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    BackgroundColor = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    TextColor = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    BorderColor = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    SortOrder = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    DeletedBy = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PetColors", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PetColorLocalizations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PetColorId = table.Column<int>(type: "integer", nullable: false),
                    Title = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    AppLocaleId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PetColorLocalizations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PetColorLocalizations_AppLocales_AppLocaleId",
                        column: x => x.AppLocaleId,
                        principalTable: "AppLocales",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PetColorLocalizations_PetColors_PetColorId",
                        column: x => x.PetColorId,
                        principalTable: "PetColors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PetColorLocalizations_AppLocaleId",
                table: "PetColorLocalizations",
                column: "AppLocaleId");

            migrationBuilder.CreateIndex(
                name: "IX_PetColorLocalizations_PetColorId_AppLocaleId",
                table: "PetColorLocalizations",
                columns: new[] { "PetColorId", "AppLocaleId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PetColors_IsDeleted",
                table: "PetColors",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_PetColors_Key",
                table: "PetColors",
                column: "Key",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PetColors_SortOrder",
                table: "PetColors",
                column: "SortOrder");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PetColorLocalizations");

            migrationBuilder.DropTable(
                name: "PetColors");
        }
    }
}
