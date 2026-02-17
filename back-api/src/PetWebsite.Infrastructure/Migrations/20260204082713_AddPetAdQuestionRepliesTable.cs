using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PetWebsite.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPetAdQuestionRepliesTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Conversations_PetAds_PetAdId",
                table: "Conversations");

            migrationBuilder.AlterColumn<string>(
                name: "Content",
                table: "Messages",
                type: "character varying(2000)",
                maxLength: 2000,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(1000)",
                oldMaxLength: 1000);

            migrationBuilder.AddForeignKey(
                name: "FK_Conversations_PetAds_PetAdId",
                table: "Conversations",
                column: "PetAdId",
                principalTable: "PetAds",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Conversations_PetAds_PetAdId",
                table: "Conversations");

            migrationBuilder.AlterColumn<string>(
                name: "Content",
                table: "Messages",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(2000)",
                oldMaxLength: 2000);

            migrationBuilder.AddForeignKey(
                name: "FK_Conversations_PetAds_PetAdId",
                table: "Conversations",
                column: "PetAdId",
                principalTable: "PetAds",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
