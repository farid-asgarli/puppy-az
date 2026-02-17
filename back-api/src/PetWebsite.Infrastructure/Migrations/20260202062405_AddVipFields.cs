using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PetWebsite.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddVipFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsVip",
                table: "PetAds",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "VipActivatedAt",
                table: "PetAds",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "VipExpiresAt",
                table: "PetAds",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_PetAds_IsVip",
                table: "PetAds",
                column: "IsVip");

            migrationBuilder.CreateIndex(
                name: "IX_PetAds_VipExpiresAt",
                table: "PetAds",
                column: "VipExpiresAt");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_PetAds_IsVip",
                table: "PetAds");

            migrationBuilder.DropIndex(
                name: "IX_PetAds_VipExpiresAt",
                table: "PetAds");

            migrationBuilder.DropColumn(
                name: "IsVip",
                table: "PetAds");

            migrationBuilder.DropColumn(
                name: "VipActivatedAt",
                table: "PetAds");

            migrationBuilder.DropColumn(
                name: "VipExpiresAt",
                table: "PetAds");
        }
    }
}
