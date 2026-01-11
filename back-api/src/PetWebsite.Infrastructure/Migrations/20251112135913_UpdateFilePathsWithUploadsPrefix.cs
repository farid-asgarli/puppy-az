using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PetWebsite.Infrastructure.Migrations
{
	/// <inheritdoc />
	public partial class UpdateFilePathsWithUploadsPrefix : Migration
	{
		/// <inheritdoc />
		protected override void Up(MigrationBuilder migrationBuilder)
		{
			// Update existing PetAdImages to add "uploads/" prefix to FilePath
			migrationBuilder.Sql(
				@"UPDATE ""PetAdImages"" 
                  SET ""FilePath"" = '/uploads/' || ""FilePath"" 
                  WHERE ""FilePath"" NOT LIKE '/uploads/%'"
			);
		}

		/// <inheritdoc />
		protected override void Down(MigrationBuilder migrationBuilder)
		{
			// Remove "uploads/" prefix from FilePath
			migrationBuilder.Sql(
				@"UPDATE ""PetAdImages"" 
                  SET ""FilePath"" = SUBSTRING(""FilePath"" FROM 9) 
                  WHERE ""FilePath"" LIKE '/uploads/%'"
			);
		}
	}
}
