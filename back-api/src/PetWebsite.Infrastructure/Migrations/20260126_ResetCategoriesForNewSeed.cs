using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PetWebsite.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ResetCategoriesForNewSeed : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Delete all pet ads first (has foreign keys to categories)
            migrationBuilder.Sql("DELETE FROM \"PetAds\";");

            // Delete all breed localizations
            migrationBuilder.Sql("DELETE FROM \"PetBreedLocalizations\";");

            // Delete all pet breeds
            migrationBuilder.Sql("DELETE FROM \"PetBreeds\";");

            // Delete all category localizations
            migrationBuilder.Sql("DELETE FROM \"PetCategoryLocalizations\";");

            // Delete all pet categories
            migrationBuilder.Sql("DELETE FROM \"PetCategories\";");

            // Reset identity/sequence for categories if using PostgreSQL
            migrationBuilder.Sql("ALTER SEQUENCE \"PetCategories_Id_seq\" RESTART WITH 1;");
            migrationBuilder.Sql("ALTER SEQUENCE \"PetBreeds_Id_seq\" RESTART WITH 1;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // This migration is one-way - down migration would require data restoration
        }
    }
}
