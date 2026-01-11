using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace PetWebsite.Infrastructure.Migrations
{
	/// <inheritdoc />
	public partial class InitialMigration : Migration
	{
		/// <inheritdoc />
		protected override void Up(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.CreateTable(
				name: "AdminRoles",
				columns: table => new
				{
					Id = table.Column<Guid>(type: "uuid", nullable: false),
					Name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
					NormalizedName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
					ConcurrencyStamp = table.Column<string>(type: "text", nullable: true),
				},
				constraints: table =>
				{
					table.PrimaryKey("PK_AdminRoles", x => x.Id);
				}
			);

			migrationBuilder.CreateTable(
				name: "Admins",
				columns: table => new
				{
					Id = table.Column<Guid>(type: "uuid", nullable: false),
					FirstName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
					LastName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
					RefreshToken = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
					RefreshTokenExpiryTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
					CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
					LastLoginAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
					IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
					UserName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
					NormalizedUserName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
					Email = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
					NormalizedEmail = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
					EmailConfirmed = table.Column<bool>(type: "boolean", nullable: false),
					PasswordHash = table.Column<string>(type: "text", nullable: true),
					SecurityStamp = table.Column<string>(type: "text", nullable: true),
					ConcurrencyStamp = table.Column<string>(type: "text", nullable: true),
					PhoneNumber = table.Column<string>(type: "text", nullable: true),
					PhoneNumberConfirmed = table.Column<bool>(type: "boolean", nullable: false),
					TwoFactorEnabled = table.Column<bool>(type: "boolean", nullable: false),
					LockoutEnd = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
					LockoutEnabled = table.Column<bool>(type: "boolean", nullable: false),
					AccessFailedCount = table.Column<int>(type: "integer", nullable: false),
				},
				constraints: table =>
				{
					table.PrimaryKey("PK_Admins", x => x.Id);
				}
			);

			migrationBuilder.CreateTable(
				name: "AppLocales",
				columns: table => new
				{
					Id = table
						.Column<int>(type: "integer", nullable: false)
						.Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
					Code = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
					Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
					NativeName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
					IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
					IsDefault = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
				},
				constraints: table =>
				{
					table.PrimaryKey("PK_AppLocales", x => x.Id);
				}
			);

			migrationBuilder.CreateTable(
				name: "BlacklistedTokens",
				columns: table => new
				{
					Id = table
						.Column<int>(type: "integer", nullable: false)
						.Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
					TokenId = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
					UserId = table.Column<Guid>(type: "uuid", nullable: false),
					UserType = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
					BlacklistedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
					ExpiresAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
					Reason = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
				},
				constraints: table =>
				{
					table.PrimaryKey("PK_BlacklistedTokens", x => x.Id);
				}
			);

			migrationBuilder.CreateTable(
				name: "Cities",
				columns: table => new
				{
					Id = table
						.Column<int>(type: "integer", nullable: false)
						.Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
					Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
					IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
					CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
					UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
					CreatedBy = table.Column<Guid>(type: "uuid", nullable: true),
					UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true),
					IsDeleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
					DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
					DeletedBy = table.Column<Guid>(type: "uuid", nullable: true),
				},
				constraints: table =>
				{
					table.PrimaryKey("PK_Cities", x => x.Id);
				}
			);

			migrationBuilder.CreateTable(
				name: "PetCategories",
				columns: table => new
				{
					Id = table
						.Column<int>(type: "integer", nullable: false)
						.Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
					SvgIcon = table.Column<string>(type: "text", nullable: false),
					IconColor = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
					BackgroundColor = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
					IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
					CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
					UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
					CreatedBy = table.Column<Guid>(type: "uuid", nullable: true),
					UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true),
					IsDeleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
					DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
					DeletedBy = table.Column<Guid>(type: "uuid", nullable: true),
				},
				constraints: table =>
				{
					table.PrimaryKey("PK_PetCategories", x => x.Id);
				}
			);

			migrationBuilder.CreateTable(
				name: "RegularUsers",
				columns: table => new
				{
					Id = table.Column<Guid>(type: "uuid", nullable: false),
					FirstName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
					LastName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
					RefreshToken = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
					RefreshTokenExpiryTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
					CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
					LastLoginAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
					IsActive = table.Column<bool>(type: "boolean", nullable: false),
					ProfilePictureUrl = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
					UserName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
					NormalizedUserName = table.Column<string>(type: "text", nullable: true),
					Email = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
					NormalizedEmail = table.Column<string>(type: "text", nullable: true),
					EmailConfirmed = table.Column<bool>(type: "boolean", nullable: false),
					PasswordHash = table.Column<string>(type: "text", nullable: true),
					SecurityStamp = table.Column<string>(type: "text", nullable: true),
					ConcurrencyStamp = table.Column<string>(type: "text", nullable: true),
					PhoneNumber = table.Column<string>(type: "text", nullable: true),
					PhoneNumberConfirmed = table.Column<bool>(type: "boolean", nullable: false),
					TwoFactorEnabled = table.Column<bool>(type: "boolean", nullable: false),
					LockoutEnd = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
					LockoutEnabled = table.Column<bool>(type: "boolean", nullable: false),
					AccessFailedCount = table.Column<int>(type: "integer", nullable: false),
				},
				constraints: table =>
				{
					table.PrimaryKey("PK_RegularUsers", x => x.Id);
				}
			);

			migrationBuilder.CreateTable(
				name: "SmsVerificationCodes",
				columns: table => new
				{
					Id = table
						.Column<int>(type: "integer", nullable: false)
						.Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
					PhoneNumber = table.Column<string>(type: "text", nullable: false),
					Code = table.Column<string>(type: "text", nullable: false),
					CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
					ExpiresAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
					IsVerified = table.Column<bool>(type: "boolean", nullable: false),
					VerifiedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
					Purpose = table.Column<string>(type: "text", nullable: false),
				},
				constraints: table =>
				{
					table.PrimaryKey("PK_SmsVerificationCodes", x => x.Id);
				}
			);

			migrationBuilder.CreateTable(
				name: "AdminRoleClaims",
				columns: table => new
				{
					Id = table
						.Column<int>(type: "integer", nullable: false)
						.Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
					RoleId = table.Column<Guid>(type: "uuid", nullable: false),
					ClaimType = table.Column<string>(type: "text", nullable: true),
					ClaimValue = table.Column<string>(type: "text", nullable: true),
				},
				constraints: table =>
				{
					table.PrimaryKey("PK_AdminRoleClaims", x => x.Id);
					table.ForeignKey(
						name: "FK_AdminRoleClaims_AdminRoles_RoleId",
						column: x => x.RoleId,
						principalTable: "AdminRoles",
						principalColumn: "Id",
						onDelete: ReferentialAction.Cascade
					);
				}
			);

			migrationBuilder.CreateTable(
				name: "AdminUserClaims",
				columns: table => new
				{
					Id = table
						.Column<int>(type: "integer", nullable: false)
						.Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
					UserId = table.Column<Guid>(type: "uuid", nullable: false),
					ClaimType = table.Column<string>(type: "text", nullable: true),
					ClaimValue = table.Column<string>(type: "text", nullable: true),
				},
				constraints: table =>
				{
					table.PrimaryKey("PK_AdminUserClaims", x => x.Id);
					table.ForeignKey(
						name: "FK_AdminUserClaims_Admins_UserId",
						column: x => x.UserId,
						principalTable: "Admins",
						principalColumn: "Id",
						onDelete: ReferentialAction.Cascade
					);
				}
			);

			migrationBuilder.CreateTable(
				name: "AdminUserLogins",
				columns: table => new
				{
					LoginProvider = table.Column<string>(type: "text", nullable: false),
					ProviderKey = table.Column<string>(type: "text", nullable: false),
					ProviderDisplayName = table.Column<string>(type: "text", nullable: true),
					UserId = table.Column<Guid>(type: "uuid", nullable: false),
				},
				constraints: table =>
				{
					table.PrimaryKey("PK_AdminUserLogins", x => new { x.LoginProvider, x.ProviderKey });
					table.ForeignKey(
						name: "FK_AdminUserLogins_Admins_UserId",
						column: x => x.UserId,
						principalTable: "Admins",
						principalColumn: "Id",
						onDelete: ReferentialAction.Cascade
					);
				}
			);

			migrationBuilder.CreateTable(
				name: "AdminUserRoles",
				columns: table => new
				{
					UserId = table.Column<Guid>(type: "uuid", nullable: false),
					RoleId = table.Column<Guid>(type: "uuid", nullable: false),
				},
				constraints: table =>
				{
					table.PrimaryKey("PK_AdminUserRoles", x => new { x.UserId, x.RoleId });
					table.ForeignKey(
						name: "FK_AdminUserRoles_AdminRoles_RoleId",
						column: x => x.RoleId,
						principalTable: "AdminRoles",
						principalColumn: "Id",
						onDelete: ReferentialAction.Cascade
					);
					table.ForeignKey(
						name: "FK_AdminUserRoles_Admins_UserId",
						column: x => x.UserId,
						principalTable: "Admins",
						principalColumn: "Id",
						onDelete: ReferentialAction.Cascade
					);
				}
			);

			migrationBuilder.CreateTable(
				name: "AdminUserTokens",
				columns: table => new
				{
					UserId = table.Column<Guid>(type: "uuid", nullable: false),
					LoginProvider = table.Column<string>(type: "text", nullable: false),
					Name = table.Column<string>(type: "text", nullable: false),
					Value = table.Column<string>(type: "text", nullable: true),
				},
				constraints: table =>
				{
					table.PrimaryKey(
						"PK_AdminUserTokens",
						x => new
						{
							x.UserId,
							x.LoginProvider,
							x.Name,
						}
					);
					table.ForeignKey(
						name: "FK_AdminUserTokens_Admins_UserId",
						column: x => x.UserId,
						principalTable: "Admins",
						principalColumn: "Id",
						onDelete: ReferentialAction.Cascade
					);
				}
			);

			migrationBuilder.CreateTable(
				name: "PetBreeds",
				columns: table => new
				{
					Id = table
						.Column<int>(type: "integer", nullable: false)
						.Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
					IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
					PetCategoryId = table.Column<int>(type: "integer", nullable: false),
					CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
					UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
					CreatedBy = table.Column<Guid>(type: "uuid", nullable: true),
					UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true),
					IsDeleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
					DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
					DeletedBy = table.Column<Guid>(type: "uuid", nullable: true),
				},
				constraints: table =>
				{
					table.PrimaryKey("PK_PetBreeds", x => x.Id);
					table.ForeignKey(
						name: "FK_PetBreeds_PetCategories_PetCategoryId",
						column: x => x.PetCategoryId,
						principalTable: "PetCategories",
						principalColumn: "Id",
						onDelete: ReferentialAction.Restrict
					);
				}
			);

			migrationBuilder.CreateTable(
				name: "PetCategoryLocalizations",
				columns: table => new
				{
					Id = table
						.Column<int>(type: "integer", nullable: false)
						.Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
					PetCategoryId = table.Column<int>(type: "integer", nullable: false),
					Title = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
					Subtitle = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
					AppLocaleId = table.Column<int>(type: "integer", nullable: false),
				},
				constraints: table =>
				{
					table.PrimaryKey("PK_PetCategoryLocalizations", x => x.Id);
					table.ForeignKey(
						name: "FK_PetCategoryLocalizations_AppLocales_AppLocaleId",
						column: x => x.AppLocaleId,
						principalTable: "AppLocales",
						principalColumn: "Id",
						onDelete: ReferentialAction.Restrict
					);
					table.ForeignKey(
						name: "FK_PetCategoryLocalizations_PetCategories_PetCategoryId",
						column: x => x.PetCategoryId,
						principalTable: "PetCategories",
						principalColumn: "Id",
						onDelete: ReferentialAction.Cascade
					);
				}
			);

			migrationBuilder.CreateTable(
				name: "PetAds",
				columns: table => new
				{
					Id = table
						.Column<int>(type: "integer", nullable: false)
						.Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
					Title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
					Description = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: false),
					AgeInMonths = table.Column<int>(type: "integer", nullable: false),
					Gender = table.Column<int>(type: "integer", nullable: false),
					AdType = table.Column<int>(type: "integer", nullable: false),
					Color = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
					Weight = table.Column<decimal>(type: "numeric(8,2)", precision: 8, scale: 2, nullable: true),
					Size = table.Column<int>(type: "integer", nullable: true),
					Price = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: true),
					CityId = table.Column<int>(type: "integer", nullable: false),
					ContactPhone = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
					ContactEmail = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
					Status = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
					RejectionReason = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
					IsAvailable = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
					IsPremium = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
					PremiumActivatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
					PremiumExpiresAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
					ViewCount = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
					PublishedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
					ExpiresAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
					PetBreedId = table.Column<int>(type: "integer", nullable: false),
					UserId = table.Column<Guid>(type: "uuid", nullable: true),
					CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
					UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
					CreatedBy = table.Column<Guid>(type: "uuid", nullable: true),
					UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true),
					IsDeleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
					DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
					DeletedBy = table.Column<Guid>(type: "uuid", nullable: true),
				},
				constraints: table =>
				{
					table.PrimaryKey("PK_PetAds", x => x.Id);
					table.ForeignKey(
						name: "FK_PetAds_Cities_CityId",
						column: x => x.CityId,
						principalTable: "Cities",
						principalColumn: "Id",
						onDelete: ReferentialAction.Restrict
					);
					table.ForeignKey(
						name: "FK_PetAds_PetBreeds_PetBreedId",
						column: x => x.PetBreedId,
						principalTable: "PetBreeds",
						principalColumn: "Id",
						onDelete: ReferentialAction.Restrict
					);
					table.ForeignKey(
						name: "FK_PetAds_RegularUsers_UserId",
						column: x => x.UserId,
						principalTable: "RegularUsers",
						principalColumn: "Id",
						onDelete: ReferentialAction.SetNull
					);
				}
			);

			migrationBuilder.CreateTable(
				name: "PetBreedLocalizations",
				columns: table => new
				{
					Id = table
						.Column<int>(type: "integer", nullable: false)
						.Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
					PetBreedId = table.Column<int>(type: "integer", nullable: false),
					Title = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
					AppLocaleId = table.Column<int>(type: "integer", nullable: false),
				},
				constraints: table =>
				{
					table.PrimaryKey("PK_PetBreedLocalizations", x => x.Id);
					table.ForeignKey(
						name: "FK_PetBreedLocalizations_AppLocales_AppLocaleId",
						column: x => x.AppLocaleId,
						principalTable: "AppLocales",
						principalColumn: "Id",
						onDelete: ReferentialAction.Restrict
					);
					table.ForeignKey(
						name: "FK_PetBreedLocalizations_PetBreeds_PetBreedId",
						column: x => x.PetBreedId,
						principalTable: "PetBreeds",
						principalColumn: "Id",
						onDelete: ReferentialAction.Cascade
					);
				}
			);

			migrationBuilder.CreateTable(
				name: "FavoriteAds",
				columns: table => new
				{
					UserId = table.Column<Guid>(type: "uuid", nullable: false),
					PetAdId = table.Column<int>(type: "integer", nullable: false),
					CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
				},
				constraints: table =>
				{
					table.PrimaryKey("PK_FavoriteAds", x => new { x.UserId, x.PetAdId });
					table.ForeignKey(
						name: "FK_FavoriteAds_PetAds_PetAdId",
						column: x => x.PetAdId,
						principalTable: "PetAds",
						principalColumn: "Id",
						onDelete: ReferentialAction.Cascade
					);
					table.ForeignKey(
						name: "FK_FavoriteAds_RegularUsers_UserId",
						column: x => x.UserId,
						principalTable: "RegularUsers",
						principalColumn: "Id",
						onDelete: ReferentialAction.Cascade
					);
				}
			);

			migrationBuilder.CreateTable(
				name: "PetAdImages",
				columns: table => new
				{
					Id = table
						.Column<int>(type: "integer", nullable: false)
						.Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
					FilePath = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
					FileName = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
					FileSize = table.Column<long>(type: "bigint", nullable: false),
					ContentType = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
					IsPrimary = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
					UploadedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
					PetAdId = table.Column<int>(type: "integer", nullable: false),
				},
				constraints: table =>
				{
					table.PrimaryKey("PK_PetAdImages", x => x.Id);
					table.ForeignKey(
						name: "FK_PetAdImages_PetAds_PetAdId",
						column: x => x.PetAdId,
						principalTable: "PetAds",
						principalColumn: "Id",
						onDelete: ReferentialAction.Cascade
					);
				}
			);

			migrationBuilder.CreateTable(
				name: "PetAdQuestions",
				columns: table => new
				{
					Id = table
						.Column<int>(type: "integer", nullable: false)
						.Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
					PetAdId = table.Column<int>(type: "integer", nullable: false),
					UserId = table.Column<Guid>(type: "uuid", nullable: false),
					Question = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
					Answer = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
					AnsweredAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
					IsDeleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
					CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
					UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
					CreatedBy = table.Column<Guid>(type: "uuid", nullable: true),
					UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true),
				},
				constraints: table =>
				{
					table.PrimaryKey("PK_PetAdQuestions", x => x.Id);
					table.ForeignKey(
						name: "FK_PetAdQuestions_PetAds_PetAdId",
						column: x => x.PetAdId,
						principalTable: "PetAds",
						principalColumn: "Id",
						onDelete: ReferentialAction.Cascade
					);
					table.ForeignKey(
						name: "FK_PetAdQuestions_RegularUsers_UserId",
						column: x => x.UserId,
						principalTable: "RegularUsers",
						principalColumn: "Id",
						onDelete: ReferentialAction.Restrict
					);
				}
			);

			migrationBuilder.CreateIndex(name: "IX_AdminRoleClaims_RoleId", table: "AdminRoleClaims", column: "RoleId");

			migrationBuilder.CreateIndex(name: "RoleNameIndex", table: "AdminRoles", column: "NormalizedName", unique: true);

			migrationBuilder.CreateIndex(name: "EmailIndex", table: "Admins", column: "NormalizedEmail");

			migrationBuilder.CreateIndex(name: "IX_Admins_IsActive", table: "Admins", column: "IsActive");

			migrationBuilder.CreateIndex(name: "UserNameIndex", table: "Admins", column: "NormalizedUserName", unique: true);

			migrationBuilder.CreateIndex(name: "IX_AdminUserClaims_UserId", table: "AdminUserClaims", column: "UserId");

			migrationBuilder.CreateIndex(name: "IX_AdminUserLogins_UserId", table: "AdminUserLogins", column: "UserId");

			migrationBuilder.CreateIndex(name: "IX_AdminUserRoles_RoleId", table: "AdminUserRoles", column: "RoleId");

			migrationBuilder.CreateIndex(name: "IX_AppLocales_Code", table: "AppLocales", column: "Code", unique: true);

			migrationBuilder.CreateIndex(name: "IX_BlacklistedTokens_ExpiresAt", table: "BlacklistedTokens", column: "ExpiresAt");

			migrationBuilder.CreateIndex(name: "IX_BlacklistedTokens_TokenId", table: "BlacklistedTokens", column: "TokenId", unique: true);

			migrationBuilder.CreateIndex(name: "IX_BlacklistedTokens_UserId", table: "BlacklistedTokens", column: "UserId");

			migrationBuilder.CreateIndex(name: "IX_Cities_IsActive", table: "Cities", column: "IsActive");

			migrationBuilder.CreateIndex(name: "IX_Cities_IsDeleted", table: "Cities", column: "IsDeleted");

			migrationBuilder.CreateIndex(name: "IX_Cities_Name", table: "Cities", column: "Name");

			migrationBuilder.CreateIndex(name: "IX_FavoriteAds_CreatedAt", table: "FavoriteAds", column: "CreatedAt");

			migrationBuilder.CreateIndex(name: "IX_FavoriteAds_PetAdId", table: "FavoriteAds", column: "PetAdId");

			migrationBuilder.CreateIndex(name: "IX_FavoriteAds_UserId", table: "FavoriteAds", column: "UserId");

			migrationBuilder.CreateIndex(name: "IX_PetAdImages_IsPrimary", table: "PetAdImages", column: "IsPrimary");

			migrationBuilder.CreateIndex(name: "IX_PetAdImages_PetAdId", table: "PetAdImages", column: "PetAdId");

			migrationBuilder.CreateIndex(name: "IX_PetAdQuestions_CreatedAt", table: "PetAdQuestions", column: "CreatedAt");

			migrationBuilder.CreateIndex(name: "IX_PetAdQuestions_PetAdId", table: "PetAdQuestions", column: "PetAdId");

			migrationBuilder.CreateIndex(name: "IX_PetAdQuestions_UserId", table: "PetAdQuestions", column: "UserId");

			migrationBuilder.CreateIndex(name: "IX_PetAds_AdType", table: "PetAds", column: "AdType");

			migrationBuilder.CreateIndex(name: "IX_PetAds_CityId", table: "PetAds", column: "CityId");

			migrationBuilder.CreateIndex(name: "IX_PetAds_CreatedAt", table: "PetAds", column: "CreatedAt");

			migrationBuilder.CreateIndex(name: "IX_PetAds_IsAvailable", table: "PetAds", column: "IsAvailable");

			migrationBuilder.CreateIndex(name: "IX_PetAds_IsDeleted", table: "PetAds", column: "IsDeleted");

			migrationBuilder.CreateIndex(name: "IX_PetAds_IsPremium", table: "PetAds", column: "IsPremium");

			migrationBuilder.CreateIndex(name: "IX_PetAds_PetBreedId", table: "PetAds", column: "PetBreedId");

			migrationBuilder.CreateIndex(name: "IX_PetAds_PremiumExpiresAt", table: "PetAds", column: "PremiumExpiresAt");

			migrationBuilder.CreateIndex(name: "IX_PetAds_PublishedAt", table: "PetAds", column: "PublishedAt");

			migrationBuilder.CreateIndex(name: "IX_PetAds_Size", table: "PetAds", column: "Size");

			migrationBuilder.CreateIndex(name: "IX_PetAds_Status", table: "PetAds", column: "Status");

			migrationBuilder.CreateIndex(name: "IX_PetAds_UserId", table: "PetAds", column: "UserId");

			migrationBuilder.CreateIndex(
				name: "IX_PetBreedLocalizations_AppLocaleId",
				table: "PetBreedLocalizations",
				column: "AppLocaleId"
			);

			migrationBuilder.CreateIndex(
				name: "IX_PetBreedLocalizations_PetBreedId_AppLocaleId",
				table: "PetBreedLocalizations",
				columns: ["PetBreedId", "AppLocaleId"],
				unique: true
			);

			migrationBuilder.CreateIndex(name: "IX_PetBreeds_IsDeleted", table: "PetBreeds", column: "IsDeleted");

			migrationBuilder.CreateIndex(name: "IX_PetBreeds_PetCategoryId", table: "PetBreeds", column: "PetCategoryId");

			migrationBuilder.CreateIndex(name: "IX_PetCategories_IsDeleted", table: "PetCategories", column: "IsDeleted");

			migrationBuilder.CreateIndex(
				name: "IX_PetCategoryLocalizations_AppLocaleId",
				table: "PetCategoryLocalizations",
				column: "AppLocaleId"
			);

			migrationBuilder.CreateIndex(
				name: "IX_PetCategoryLocalizations_PetCategoryId_AppLocaleId",
				table: "PetCategoryLocalizations",
				columns: ["PetCategoryId", "AppLocaleId"],
				unique: true
			);

			migrationBuilder.CreateIndex(name: "IX_RegularUsers_Email", table: "RegularUsers", column: "Email", unique: true);

			migrationBuilder.CreateIndex(name: "IX_RegularUsers_UserName", table: "RegularUsers", column: "UserName", unique: true);
		}

		/// <inheritdoc />
		protected override void Down(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.DropTable(name: "AdminRoleClaims");

			migrationBuilder.DropTable(name: "AdminUserClaims");

			migrationBuilder.DropTable(name: "AdminUserLogins");

			migrationBuilder.DropTable(name: "AdminUserRoles");

			migrationBuilder.DropTable(name: "AdminUserTokens");

			migrationBuilder.DropTable(name: "BlacklistedTokens");

			migrationBuilder.DropTable(name: "FavoriteAds");

			migrationBuilder.DropTable(name: "PetAdImages");

			migrationBuilder.DropTable(name: "PetAdQuestions");

			migrationBuilder.DropTable(name: "PetBreedLocalizations");

			migrationBuilder.DropTable(name: "PetCategoryLocalizations");

			migrationBuilder.DropTable(name: "SmsVerificationCodes");

			migrationBuilder.DropTable(name: "AdminRoles");

			migrationBuilder.DropTable(name: "Admins");

			migrationBuilder.DropTable(name: "PetAds");

			migrationBuilder.DropTable(name: "AppLocales");

			migrationBuilder.DropTable(name: "Cities");

			migrationBuilder.DropTable(name: "PetBreeds");

			migrationBuilder.DropTable(name: "RegularUsers");

			migrationBuilder.DropTable(name: "PetCategories");
		}
	}
}
