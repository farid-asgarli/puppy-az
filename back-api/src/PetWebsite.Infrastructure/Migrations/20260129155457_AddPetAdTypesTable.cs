using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace PetWebsite.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPetAdTypesTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "Price",
                table: "PetAds",
                type: "numeric(18,2)",
                precision: 18,
                scale: 2,
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "numeric(18,2)",
                oldPrecision: 18,
                oldScale: 2);

            migrationBuilder.CreateTable(
                name: "PetAdTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Key = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Emoji = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    IconName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
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
                    table.PrimaryKey("PK_PetAdTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PetAdTypeLocalizations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PetAdTypeId = table.Column<int>(type: "integer", nullable: false),
                    Title = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    AppLocaleId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PetAdTypeLocalizations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PetAdTypeLocalizations_AppLocales_AppLocaleId",
                        column: x => x.AppLocaleId,
                        principalTable: "AppLocales",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PetAdTypeLocalizations_PetAdTypes_PetAdTypeId",
                        column: x => x.PetAdTypeId,
                        principalTable: "PetAdTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PetAdTypeLocalizations_AppLocaleId",
                table: "PetAdTypeLocalizations",
                column: "AppLocaleId");

            migrationBuilder.CreateIndex(
                name: "IX_PetAdTypeLocalizations_PetAdTypeId_AppLocaleId",
                table: "PetAdTypeLocalizations",
                columns: new[] { "PetAdTypeId", "AppLocaleId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PetAdTypes_IsDeleted",
                table: "PetAdTypes",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_PetAdTypes_Key",
                table: "PetAdTypes",
                column: "Key",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PetAdTypes_SortOrder",
                table: "PetAdTypes",
                column: "SortOrder");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PetAdTypeLocalizations");

            migrationBuilder.DropTable(
                name: "PetAdTypes");

            migrationBuilder.AlterColumn<decimal>(
                name: "Price",
                table: "PetAds",
                type: "numeric(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m,
                oldClrType: typeof(decimal),
                oldType: "numeric(18,2)",
                oldPrecision: 18,
                oldScale: 2,
                oldNullable: true);
        }
    }
}
