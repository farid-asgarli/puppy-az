using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PetWebsite.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class LocalizedCities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Cities_Name",
                table: "Cities");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Cities",
                newName: "NameRu");

            migrationBuilder.AddColumn<int>(
                name: "DisplayOrder",
                table: "Cities",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "IsMajorCity",
                table: "Cities",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "NameAz",
                table: "Cities",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "NameEn",
                table: "Cities",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Cities_DisplayOrder",
                table: "Cities",
                column: "DisplayOrder");

            migrationBuilder.CreateIndex(
                name: "IX_Cities_NameAz",
                table: "Cities",
                column: "NameAz");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Cities_DisplayOrder",
                table: "Cities");

            migrationBuilder.DropIndex(
                name: "IX_Cities_NameAz",
                table: "Cities");

            migrationBuilder.DropColumn(
                name: "DisplayOrder",
                table: "Cities");

            migrationBuilder.DropColumn(
                name: "IsMajorCity",
                table: "Cities");

            migrationBuilder.DropColumn(
                name: "NameAz",
                table: "Cities");

            migrationBuilder.DropColumn(
                name: "NameEn",
                table: "Cities");

            migrationBuilder.RenameColumn(
                name: "NameRu",
                table: "Cities",
                newName: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_Cities_Name",
                table: "Cities",
                column: "Name");
        }
    }
}
