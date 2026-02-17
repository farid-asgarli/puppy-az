using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace PetWebsite.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddDistricts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsCreatedByAdmin",
                table: "RegularUsers",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AlterColumn<int>(
                name: "PetBreedId",
                table: "PetAds",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<int>(
                name: "Gender",
                table: "PetAds",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<int>(
                name: "AgeInMonths",
                table: "PetAds",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddColumn<int>(
                name: "DistrictId",
                table: "PetAds",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PetCategoryId",
                table: "PetAds",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SuggestedBreedName",
                table: "PetAds",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.CreateTable(
                name: "BreedSuggestions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    PetCategoryId = table.Column<int>(type: "integer", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: true),
                    Status = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    ApprovedBreedId = table.Column<int>(type: "integer", nullable: true),
                    AdminNote = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BreedSuggestions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BreedSuggestions_PetBreeds_ApprovedBreedId",
                        column: x => x.ApprovedBreedId,
                        principalTable: "PetBreeds",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_BreedSuggestions_PetCategories_PetCategoryId",
                        column: x => x.PetCategoryId,
                        principalTable: "PetCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_BreedSuggestions_RegularUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "RegularUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "Districts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    NameAz = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    NameEn = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    NameRu = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    DisplayOrder = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    CityId = table.Column<int>(type: "integer", nullable: false),
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
                    table.PrimaryKey("PK_Districts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Districts_Cities_CityId",
                        column: x => x.CityId,
                        principalTable: "Cities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PetAds_DistrictId",
                table: "PetAds",
                column: "DistrictId");

            migrationBuilder.CreateIndex(
                name: "IX_PetAds_PetCategoryId",
                table: "PetAds",
                column: "PetCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_BreedSuggestions_ApprovedBreedId",
                table: "BreedSuggestions",
                column: "ApprovedBreedId");

            migrationBuilder.CreateIndex(
                name: "IX_BreedSuggestions_PetCategoryId",
                table: "BreedSuggestions",
                column: "PetCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_BreedSuggestions_Status",
                table: "BreedSuggestions",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_BreedSuggestions_UserId",
                table: "BreedSuggestions",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Districts_CityId",
                table: "Districts",
                column: "CityId");

            migrationBuilder.CreateIndex(
                name: "IX_Districts_DisplayOrder",
                table: "Districts",
                column: "DisplayOrder");

            migrationBuilder.CreateIndex(
                name: "IX_Districts_IsActive",
                table: "Districts",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_Districts_IsDeleted",
                table: "Districts",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_Districts_NameAz",
                table: "Districts",
                column: "NameAz");

            migrationBuilder.AddForeignKey(
                name: "FK_PetAds_Districts_DistrictId",
                table: "PetAds",
                column: "DistrictId",
                principalTable: "Districts",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_PetAds_PetCategories_PetCategoryId",
                table: "PetAds",
                column: "PetCategoryId",
                principalTable: "PetCategories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PetAds_Districts_DistrictId",
                table: "PetAds");

            migrationBuilder.DropForeignKey(
                name: "FK_PetAds_PetCategories_PetCategoryId",
                table: "PetAds");

            migrationBuilder.DropTable(
                name: "BreedSuggestions");

            migrationBuilder.DropTable(
                name: "Districts");

            migrationBuilder.DropIndex(
                name: "IX_PetAds_DistrictId",
                table: "PetAds");

            migrationBuilder.DropIndex(
                name: "IX_PetAds_PetCategoryId",
                table: "PetAds");

            migrationBuilder.DropColumn(
                name: "IsCreatedByAdmin",
                table: "RegularUsers");

            migrationBuilder.DropColumn(
                name: "DistrictId",
                table: "PetAds");

            migrationBuilder.DropColumn(
                name: "PetCategoryId",
                table: "PetAds");

            migrationBuilder.DropColumn(
                name: "SuggestedBreedName",
                table: "PetAds");

            migrationBuilder.AlterColumn<int>(
                name: "PetBreedId",
                table: "PetAds",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Gender",
                table: "PetAds",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "AgeInMonths",
                table: "PetAds",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);
        }
    }
}
