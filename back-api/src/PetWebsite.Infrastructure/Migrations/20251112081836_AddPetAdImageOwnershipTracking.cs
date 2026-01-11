using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PetWebsite.Infrastructure.Migrations
{
	/// <inheritdoc />
	public partial class AddPetAdImageOwnershipTracking : Migration
	{
		/// <inheritdoc />
		protected override void Up(MigrationBuilder migrationBuilder)
		{
			// Step 1: Make PetAdId nullable
			migrationBuilder.AlterColumn<int>(
				name: "PetAdId",
				table: "PetAdImages",
				type: "integer",
				nullable: true,
				oldClrType: typeof(int),
				oldType: "integer"
			);

			// Step 2: Add AttachedAt column (nullable)
			migrationBuilder.AddColumn<DateTime>(
				name: "AttachedAt",
				table: "PetAdImages",
				type: "timestamp with time zone",
				nullable: true
			);

			// Step 3: Add UploadedById column as nullable first
			migrationBuilder.AddColumn<Guid>(name: "UploadedById", table: "PetAdImages", type: "uuid", nullable: true);

			// Step 4: Update existing records - set UploadedById to the user who owns the PetAd
			// For images already attached to ads, use the ad owner's ID
			migrationBuilder.Sql(
				@"
                UPDATE ""PetAdImages"" 
                SET ""UploadedById"" = ""PetAds"".""UserId"",
                    ""AttachedAt"" = ""PetAdImages"".""UploadedAt""
                FROM ""PetAds""
                WHERE ""PetAdImages"".""PetAdId"" = ""PetAds"".""Id""
                  AND ""PetAds"".""UserId"" IS NOT NULL;
            "
			);

			// Step 5: Delete any orphaned images that couldn't be migrated (no associated user)
			migrationBuilder.Sql(
				@"
                DELETE FROM ""PetAdImages"" 
                WHERE ""UploadedById"" IS NULL;
            "
			);

			// Step 6: Now make UploadedById non-nullable
			migrationBuilder.AlterColumn<Guid>(
				name: "UploadedById",
				table: "PetAdImages",
				type: "uuid",
				nullable: false,
				oldClrType: typeof(Guid),
				oldType: "uuid",
				oldNullable: true
			);

			// Step 7: Create indexes
			migrationBuilder.CreateIndex(
				name: "IX_PetAdImages_UploadedAt_PetAdId",
				table: "PetAdImages",
				columns: new[] { "UploadedAt", "PetAdId" }
			);

			migrationBuilder.CreateIndex(name: "IX_PetAdImages_UploadedById", table: "PetAdImages", column: "UploadedById");

			migrationBuilder.CreateIndex(
				name: "IX_PetAdImages_UploadedById_PetAdId",
				table: "PetAdImages",
				columns: new[] { "UploadedById", "PetAdId" }
			);

			// Step 8: Add foreign key constraint
			migrationBuilder.AddForeignKey(
				name: "FK_PetAdImages_RegularUsers_UploadedById",
				table: "PetAdImages",
				column: "UploadedById",
				principalTable: "RegularUsers",
				principalColumn: "Id",
				onDelete: ReferentialAction.Restrict
			);
		}

		/// <inheritdoc />
		protected override void Down(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.DropForeignKey(name: "FK_PetAdImages_RegularUsers_UploadedById", table: "PetAdImages");

			migrationBuilder.DropIndex(name: "IX_PetAdImages_UploadedAt_PetAdId", table: "PetAdImages");

			migrationBuilder.DropIndex(name: "IX_PetAdImages_UploadedById", table: "PetAdImages");

			migrationBuilder.DropIndex(name: "IX_PetAdImages_UploadedById_PetAdId", table: "PetAdImages");

			migrationBuilder.DropColumn(name: "AttachedAt", table: "PetAdImages");

			migrationBuilder.DropColumn(name: "UploadedById", table: "PetAdImages");

			migrationBuilder.AlterColumn<int>(
				name: "PetAdId",
				table: "PetAdImages",
				type: "integer",
				nullable: false,
				defaultValue: 0,
				oldClrType: typeof(int),
				oldType: "integer",
				oldNullable: true
			);
		}
	}
}
