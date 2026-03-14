using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PetWebsite.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class MakeUploadedByIdNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Slug",
                table: "PetCategoryLocalizations",
                type: "character varying(150)",
                maxLength: 150,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Slug",
                table: "PetBreedLocalizations",
                type: "character varying(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CustomDistrictName",
                table: "PetAds",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "UploadedById",
                table: "PetAdImages",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.CreateIndex(
                name: "IX_PetCategoryLocalizations_Slug_AppLocaleId",
                table: "PetCategoryLocalizations",
                columns: new[] { "Slug", "AppLocaleId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PetBreedLocalizations_Slug_AppLocaleId",
                table: "PetBreedLocalizations",
                columns: new[] { "Slug", "AppLocaleId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_PetCategoryLocalizations_Slug_AppLocaleId",
                table: "PetCategoryLocalizations");

            migrationBuilder.DropIndex(
                name: "IX_PetBreedLocalizations_Slug_AppLocaleId",
                table: "PetBreedLocalizations");

            migrationBuilder.DropColumn(
                name: "Slug",
                table: "PetCategoryLocalizations");

            migrationBuilder.DropColumn(
                name: "Slug",
                table: "PetBreedLocalizations");

            migrationBuilder.DropColumn(
                name: "CustomDistrictName",
                table: "PetAds");

            migrationBuilder.AlterColumn<Guid>(
                name: "UploadedById",
                table: "PetAdImages",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);
        }
    }
}
