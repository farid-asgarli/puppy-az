using System.Text.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Entities;
using PetWebsite.Domain.Enums;

namespace PetWebsite.Infrastructure.Persistence;

public static class DatabaseSeeder
{
	public static async Task SeedAsync(
		ApplicationDbContext context,
		UserManager<AdminUser> userManager,
		RoleManager<IdentityRole<Guid>> roleManager
	)
	{
		// Ensure database is created
		await context.Database.MigrateAsync();

		// Seed Roles
		await SeedRolesAsync(roleManager);

		// Seed Super Admin User
		await SeedSuperAdminAsync(userManager);

		// Seed Locales
		await SeedLocalesAsync(context);

		// Seed Pet Categories and Breeds
		await SeedPetCategoriesAndBreedsAsync(context);

		// Seed Cities
		await SeedCitiesAsync(context);

		// Seed Test Users
		await SeedTestUsersAsync(context);

		// Seed Pet Ads with Images
		await SeedPetAdsAsync(context);
	}

	private static async Task SeedRolesAsync(RoleManager<IdentityRole<Guid>> roleManager)
	{
		foreach (var role in AdminRoles.AllRoles)
		{
			if (!await roleManager.RoleExistsAsync(role))
			{
				await roleManager.CreateAsync(new IdentityRole<Guid>(role));
			}
		}
	}

	private static async Task SeedSuperAdminAsync(UserManager<AdminUser> userManager)
	{
		const string superAdminEmail = "admin@petwebsite.com";

		var existingAdmin = await userManager.FindByEmailAsync(superAdminEmail);
		if (existingAdmin != null)
			return;

		var superAdmin = new AdminUser
		{
			UserName = superAdminEmail,
			Email = superAdminEmail,
			FirstName = "Super",
			LastName = "Admin",
			EmailConfirmed = true,
			IsActive = true,
			CreatedAt = DateTime.UtcNow,
		};

		// Default password: Admin@123
		var result = await userManager.CreateAsync(superAdmin, "Admin@123");

		if (result.Succeeded)
		{
			await userManager.AddToRoleAsync(superAdmin, AdminRoles.SuperAdmin);
		}
	}

	private static async Task SeedLocalesAsync(ApplicationDbContext context)
	{
		if (await context.AppLocales.AnyAsync())
			return;

		var locales = new List<AppLocale>
		{
			new()
			{
				Code = "az",
				Name = "Azerbaijani",
				NativeName = "Azərbaycan",
				IsActive = true,
				IsDefault = true,
			},
			new()
			{
				Code = "en",
				Name = "English",
				NativeName = "English",
				IsActive = true,
				IsDefault = false,
			},
			new()
			{
				Code = "ru",
				Name = "Russian",
				NativeName = "Русский",
				IsActive = true,
				IsDefault = false,
			},
		};

		await context.AppLocales.AddRangeAsync(locales);
		await context.SaveChangesAsync();
	}

	private static async Task SeedPetCategoriesAndBreedsAsync(ApplicationDbContext context)
	{
		if (await context.PetCategories.AnyAsync())
			return;

		// Get the Azerbaijani locale ID (default)
		var azLocale = await context.AppLocales.FirstOrDefaultAsync(l => l.Code == "az");
		if (azLocale == null)
			return;

		// Read seed.json file
		var seedJsonPath = Path.Combine(AppContext.BaseDirectory, "seed.json");
		if (!File.Exists(seedJsonPath))
		{
			// Try alternative path (development scenario)
			var alternativePath = Path.Combine(Directory.GetCurrentDirectory(), "seed.json");
			if (File.Exists(alternativePath))
			{
				seedJsonPath = alternativePath;
			}
			else
			{
				Console.WriteLine("Warning: seed.json file not found. Skipping pet categories and breeds seeding.");
				return;
			}
		}

		var jsonContent = await File.ReadAllTextAsync(seedJsonPath);
		var seedData = JsonSerializer.Deserialize<Dictionary<string, PetCategorySeedData>>(
			jsonContent,
			new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
		);

		if (seedData == null)
			return;

		var categoryKeyMapping = new Dictionary<string, string>
		{
			{ "dog", "dog" },
			{ "cat", "cat" },
			{ "rabbit", "rabbit" },
			{ "bird", "bird" },
			{ "fish", "fish" },
			{ "rodent", "rodent" },
			{ "reptile", "reptile" },
			{ "horse", "horse" },
			{ "farmAnimal", "farm-animal" },
			{ "exotic", "exotic" },
			{ "insect", "insect" },
			{ "smallMammal", "small-mammal" },
			{ "aquatic", "aquatic" },
			{ "amphibian", "amphibian" },
			{ "monkey", "monkey" },
			{ "marsupial", "marsupial" },
			{ "arachnid", "arachnid" },
			{ "pig", "pig" },
			{ "deer", "deer" },
			{ "bear", "bear" },
			{ "fox", "fox" },
			{ "hedgehog", "hedgehog" },
			{ "marineMammal", "marine-mammal" },
			{ "mixedBreed", "mixed-breed" },
			{ "other", "other" },
		};

		foreach (var (key, data) in seedData)
		{
			var category = new PetCategory
			{
				SvgIcon = data.Icon,
				IconColor = data.IconColor,
				BackgroundColor = data.BgColor,
				IsActive = true,
				CreatedAt = DateTime.UtcNow,
			};

			// Add localization for Azerbaijani
			category.Localizations.Add(
				new PetCategoryLocalization
				{
					AppLocaleId = azLocale.Id,
					Title = data.Title,
					Subtitle = data.Subtitle,
				}
			);

			// Add breeds
			if (data.Breeds != null && data.Breeds.Count > 0)
			{
				foreach (var breedName in data.Breeds)
				{
					var breed = new PetBreed { IsActive = true, CreatedAt = DateTime.UtcNow };

					breed.Localizations.Add(new PetBreedLocalization { AppLocaleId = azLocale.Id, Title = breedName });

					category.Breeds.Add(breed);
				}
			}

			await context.PetCategories.AddAsync(category);
		}

		await context.SaveChangesAsync();
	}

	// Helper class for JSON deserialization
	private class PetCategorySeedData
	{
		public string Icon { get; set; } = string.Empty;
		public string IconColor { get; set; } = string.Empty;
		public string BgColor { get; set; } = string.Empty;
		public string Title { get; set; } = string.Empty;
		public string Subtitle { get; set; } = string.Empty;
		public int Count { get; set; }
		public List<string> Breeds { get; set; } = [];
	}

	private static async Task SeedCitiesAsync(ApplicationDbContext context)
	{
		if (await context.Cities.AnyAsync())
			return;

		var cities = new List<City>
		{
			new()
			{
				Name = "Bakı",
				IsActive = true,
				CreatedAt = DateTime.UtcNow,
			},
			new()
			{
				Name = "Gəncə",
				IsActive = true,
				CreatedAt = DateTime.UtcNow,
			},
			new()
			{
				Name = "Sumqayıt",
				IsActive = true,
				CreatedAt = DateTime.UtcNow,
			},
			new()
			{
				Name = "Mingəçevir",
				IsActive = true,
				CreatedAt = DateTime.UtcNow,
			},
			new()
			{
				Name = "Lənkəran",
				IsActive = true,
				CreatedAt = DateTime.UtcNow,
			},
			new()
			{
				Name = "Şəki",
				IsActive = true,
				CreatedAt = DateTime.UtcNow,
			},
			new()
			{
				Name = "Naxçıvan",
				IsActive = true,
				CreatedAt = DateTime.UtcNow,
			},
			new()
			{
				Name = "Şirvan",
				IsActive = true,
				CreatedAt = DateTime.UtcNow,
			},
			new()
			{
				Name = "Quba",
				IsActive = true,
				CreatedAt = DateTime.UtcNow,
			},
			new()
			{
				Name = "Qusar",
				IsActive = true,
				CreatedAt = DateTime.UtcNow,
			},
		};

		await context.Cities.AddRangeAsync(cities);
		await context.SaveChangesAsync();
	}

	private static async Task SeedTestUsersAsync(ApplicationDbContext context)
	{
		if (await context.RegularUsers.AnyAsync())
			return;

		var users = new List<User>
		{
			new()
			{
				Id = Guid.NewGuid(),
				UserName = "user1@example.com",
				NormalizedUserName = "USER1@EXAMPLE.COM",
				Email = "user1@example.com",
				NormalizedEmail = "USER1@EXAMPLE.COM",
				EmailConfirmed = true,
				FirstName = "Ayşə",
				LastName = "Məmmədova",
				PhoneNumber = "+994501234567",
				PhoneNumberConfirmed = true,
				IsActive = true,
				CreatedAt = DateTime.UtcNow,
			},
			new()
			{
				Id = Guid.NewGuid(),
				UserName = "user2@example.com",
				NormalizedUserName = "USER2@EXAMPLE.COM",
				Email = "user2@example.com",
				NormalizedEmail = "USER2@EXAMPLE.COM",
				EmailConfirmed = true,
				FirstName = "Elçin",
				LastName = "Əliyev",
				PhoneNumber = "+994502345678",
				PhoneNumberConfirmed = true,
				IsActive = true,
				CreatedAt = DateTime.UtcNow,
			},
			new()
			{
				Id = Guid.NewGuid(),
				UserName = "user3@example.com",
				NormalizedUserName = "USER3@EXAMPLE.COM",
				Email = "user3@example.com",
				NormalizedEmail = "USER3@EXAMPLE.COM",
				EmailConfirmed = true,
				FirstName = "Nigar",
				LastName = "Həsənova",
				PhoneNumber = "+994503456789",
				PhoneNumberConfirmed = true,
				IsActive = true,
				CreatedAt = DateTime.UtcNow,
			},
		};

		await context.RegularUsers.AddRangeAsync(users);
		await context.SaveChangesAsync();
	}

	private static async Task SeedPetAdsAsync(ApplicationDbContext context)
	{
		if (await context.PetAds.AnyAsync())
			return;

		var breeds = await context.PetBreeds.Include(it => it.Localizations).ToListAsync();
		var cities = await context.Cities.ToListAsync();
		var users = await context.RegularUsers.ToListAsync();

		if (breeds.Count == 0 || cities.Count == 0 || users.Count == 0)
		{
			Console.WriteLine("Warning: Cannot seed pet ads. Required data (breeds, cities, or users) not found.");
			return;
		}

		// Get seed photos from wwwroot/seed_photo
		var wwwrootPath = Path.Combine(AppContext.BaseDirectory, "wwwroot");
		if (!Directory.Exists(wwwrootPath))
		{
			// Try alternative path (development scenario)
			var alternativeWwwroot = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
			if (Directory.Exists(alternativeWwwroot))
			{
				wwwrootPath = alternativeWwwroot;
			}
			else
			{
				Console.WriteLine("Warning: wwwroot directory not found. Skipping pet ads seeding.");
				return;
			}
		}

		var seedPhotoPath = Path.Combine(wwwrootPath, "seed_photo");
		if (!Directory.Exists(seedPhotoPath))
		{
			Console.WriteLine("Warning: wwwroot/seed_photo directory not found. Skipping pet ads seeding.");
			return;
		}

		var photoFiles = Directory.GetFiles(seedPhotoPath, "*.jpg").ToList();
		if (photoFiles.Count == 0)
		{
			Console.WriteLine("Warning: No photos found in wwwroot/seed_photo directory.");
			return;
		}

		var random = new Random(12345); // Fixed seed for reproducibility
		var petAds = new List<PetAd>();

		// Sample data for generating random ads
		var petNames = new[]
		{
			"Max",
			"Bella",
			"Charlie",
			"Luna",
			"Cooper",
			"Lucy",
			"Buddy",
			"Daisy",
			"Rocky",
			"Molly",
			"Simba",
			"Nala",
			"Oliver",
			"Milo",
			"Leo",
			"Felix",
			"Whiskers",
			"Shadow",
			"Fluffy",
			"Snowball",
			"Oreo",
			"Mittens",
			"Tiger",
			"Pepper",
		};

		var colors = new[]
		{
			"Qara",
			"Ağ",
			"Qəhvəyi",
			"Boz",
			"Sarı",
			"Qızılı",
			"Çoxrəngli",
			"Black",
			"White",
			"Brown",
			"Gray",
			"Golden",
			"Cream",
			"Spotted",
		};

		var descriptions = new[]
		{
			"Çox mehriban və oynaşmağı sevir. Ailə üçün əladır.",
			"Sağlam və enerjili bir dost axtarırsınızsa, bu sizin seçiminizdir.",
			"Uşaqlarla çox yaxşı anlaşır, çox mehriban və sadiqdir.",
			"Gözəl xasiyyəti var, tərbiyəlidir və itaətkardir.",
			"Çox aktiv və oynaşmağı sevir. Böyük həyət lazımdır.",
			"Sakit və rahat xasiyyətlidir. Apartament üçün idealdır.",
			"Peşəkar təlim keçib, çox ağıllıdır.",
			"Ailə ilə qalmağı çox sevir, tək qalmağı sevmir.",
			"Very friendly and loves to play. Great for families.",
			"Healthy and energetic companion looking for a loving home.",
			"Gets along great with children, very affectionate and loyal.",
			"Beautiful temperament, well-trained and obedient.",
			"Very active and playful. Needs a large yard.",
			"Calm and relaxed personality. Perfect for apartments.",
			"Professionally trained, very intelligent.",
			"Loves being with family, doesn't like being alone.",
		};

		// Generate 500 random pet ads
		for (int i = 0; i < 500; i++)
		{
			var breed = breeds[random.Next(breeds.Count)];
			var city = cities[random.Next(cities.Count)];
			var user = users[random.Next(users.Count)];
			var adType = (PetAdType)random.Next(1, 6); // 1-5
			var gender = (PetGender)random.Next(1, 3); // 1-2
			var size = (PetSize)random.Next(1, 6); // 1-5
			var status = random.Next(100) < 80 ? PetAdStatus.Published : PetAdStatus.Pending; // 80% published

			var ageInMonths = random.Next(1, 120); // 1 month to 10 years
			var isPremium = random.Next(100) < 20; // 20% premium ads

			var petAd = new PetAd
			{
				Title = $"{petNames[random.Next(petNames.Length)]} - {breed.Localizations.FirstOrDefault()?.Title} cinsi",
				Description = descriptions[random.Next(descriptions.Length)],
				AgeInMonths = ageInMonths,
				Gender = gender,
				AdType = adType,
				Color = colors[random.Next(colors.Length)],
				Weight =
					adType == PetAdType.Sale || adType == PetAdType.Match
						? Math.Round((decimal)(random.NextDouble() * 30 + 2), 1) // 2-32 kg
						: null,
				Size = size,
				Price = adType == PetAdType.Sale ? random.Next(50, 5000) : null,
				CityId = city.Id,
				Status = status,
				IsAvailable = status == PetAdStatus.Published && random.Next(100) < 90, // 90% available
				IsPremium = isPremium,
				PremiumActivatedAt = isPremium ? DateTime.UtcNow.AddDays(-random.Next(1, 15)) : null,
				PremiumExpiresAt = isPremium ? DateTime.UtcNow.AddDays(random.Next(15, 30)) : null,
				ViewCount = random.Next(0, 500),
				PublishedAt = status == PetAdStatus.Published ? DateTime.UtcNow.AddDays(-random.Next(1, 60)) : null,
				ExpiresAt = DateTime.UtcNow.AddDays(random.Next(30, 90)),
				PetBreedId = breed.Id,
				UserId = user.Id,
				CreatedAt = DateTime.UtcNow.AddDays(-random.Next(1, 90)),
			};

			// Add 1-4 random images to the ad
			var imageCount = random.Next(1, 5);
			var selectedPhotos = photoFiles.OrderBy(x => random.Next()).Take(imageCount).ToList();

			for (int j = 0; j < selectedPhotos.Count; j++)
			{
				var photoFile = selectedPhotos[j];
				var fileName = Path.GetFileName(photoFile);
				var fileInfo = new FileInfo(photoFile);

				var image = new PetAdImage
				{
					FilePath = $"seed_photo/{fileName}",
					FileName = fileName,
					FileSize = fileInfo.Length,
					ContentType = "image/jpeg",
					IsPrimary = j == 0, // First image is primary
					UploadedAt = petAd.CreatedAt,
				};

				petAd.Images.Add(image);
			}

			petAds.Add(petAd);
		}

		await context.PetAds.AddRangeAsync(petAds);
		await context.SaveChangesAsync();

		Console.WriteLine($"Successfully seeded {petAds.Count} pet ads with images.");
	}
}
