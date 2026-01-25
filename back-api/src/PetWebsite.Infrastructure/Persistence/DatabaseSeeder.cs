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

		// Seed Pet Colors
		await SeedPetColorsAsync(context);

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

	private static async Task SeedPetColorsAsync(ApplicationDbContext context)
	{
		if (await context.PetColors.AnyAsync())
			return;

		// Get locales
		var azLocale = await context.AppLocales.FirstOrDefaultAsync(l => l.Code == "az");
		var enLocale = await context.AppLocales.FirstOrDefaultAsync(l => l.Code == "en");
		var ruLocale = await context.AppLocales.FirstOrDefaultAsync(l => l.Code == "ru");

		if (azLocale == null || enLocale == null || ruLocale == null)
			return;

		var now = DateTime.UtcNow;
		// Essential pet colors with soft backgrounds
		var colors = new List<(string Key, string BgColor, string TextColor, string BorderColor, string Az, string En, string Ru)>
		{
			// Basic colors
			("black", "#4B5563", "#FFFFFF", "#4B5563", "Qara", "Black", "Чёрный"),
			("white", "#FEFEFE", "#6B7280", "#E5E7EB", "Ağ", "White", "Белый"),
			("gray", "#F3F4F6", "#4B5563", "#E5E7EB", "Boz", "Gray", "Серый"),
			("brown", "#F5E6DC", "#78350F", "#E8D4C4", "Qəhvəyi", "Brown", "Коричневый"),
			("golden", "#FEF9C3", "#92400E", "#FDE68A", "Qızılı", "Golden", "Золотистый"),
			("cream", "#FFFBEB", "#92400E", "#FEF3C7", "Krem", "Cream", "Кремовый"),
			("beige", "#FAF5F0", "#78716C", "#E7E5E4", "Bej", "Beige", "Бежевый"),
			("red", "#FEF2F2", "#B91C1C", "#FECACA", "Qırmızı", "Red", "Рыжий"),
			("orange", "#FFF7ED", "#C2410C", "#FED7AA", "Narıncı", "Orange", "Оранжевый"),
			("yellow", "#FEFCE8", "#A16207", "#FEF08A", "Sarı", "Yellow", "Жёлтый"),
			("green", "#F0FDF4", "#166534", "#BBF7D0", "Yaşıl", "Green", "Зелёный"),
			("blue", "#EFF6FF", "#1D4ED8", "#BFDBFE", "Mavi", "Blue", "Голубой"),
			("spotted", "#FAFAFA", "#525252", "#E5E5E5", "Xallı", "Spotted", "Пятнистый"),
			("striped", "#FEF9C3", "#92400E", "#FDE68A", "Zolaqlı", "Striped", "Полосатый"),
			("mixed", "#F9FAFB", "#4B5563", "#E5E7EB", "Qarışıq", "Mixed", "Смешанный"),
		};

		foreach (var (key, bgColor, textColor, borderColor, az, en, ru) in colors)
		{
			var petColor = new PetColor
			{
				Key = key,
				BackgroundColor = bgColor,
				TextColor = textColor,
				BorderColor = borderColor,
				SortOrder = colors.FindIndex(c => c.Key == key) + 1,
				IsActive = true,
				CreatedAt = now
			};

			petColor.Localizations.Add(new PetColorLocalization
			{
				AppLocaleId = azLocale.Id,
				Title = az
			});

			petColor.Localizations.Add(new PetColorLocalization
			{
				AppLocaleId = enLocale.Id,
				Title = en
			});

			petColor.Localizations.Add(new PetColorLocalization
			{
				AppLocaleId = ruLocale.Id,
				Title = ru
			});

			context.PetColors.Add(petColor);
		}

		await context.SaveChangesAsync();
		Console.WriteLine($"Successfully seeded {colors.Count} pet colors with localizations.");
	}

	private static async Task SeedCitiesAsync(ApplicationDbContext context)
	{
		if (await context.Cities.AnyAsync())
			return;

		var now = DateTime.UtcNow;
		var cities = new List<City>
		{
			// Major Cities (İri Şəhərlər)
			new() { NameAz = "Bakı", NameEn = "Baku", NameRu = "Баку", IsMajorCity = true, DisplayOrder = 1, IsActive = true, CreatedAt = now },
			new() { NameAz = "Gəncə", NameEn = "Ganja", NameRu = "Гянджа", IsMajorCity = true, DisplayOrder = 2, IsActive = true, CreatedAt = now },
			new() { NameAz = "Sumqayıt", NameEn = "Sumgait", NameRu = "Сумгаит", IsMajorCity = true, DisplayOrder = 3, IsActive = true, CreatedAt = now },
			new() { NameAz = "Mingəçevir", NameEn = "Mingachevir", NameRu = "Мингечевир", IsMajorCity = true, DisplayOrder = 4, IsActive = true, CreatedAt = now },
			new() { NameAz = "Lənkəran", NameEn = "Lankaran", NameRu = "Ленкорань", IsMajorCity = true, DisplayOrder = 5, IsActive = true, CreatedAt = now },
			new() { NameAz = "Şirvan", NameEn = "Shirvan", NameRu = "Ширван", IsMajorCity = true, DisplayOrder = 6, IsActive = true, CreatedAt = now },
			new() { NameAz = "Naxçıvan", NameEn = "Nakhchivan", NameRu = "Нахичевань", IsMajorCity = true, DisplayOrder = 7, IsActive = true, CreatedAt = now },
			new() { NameAz = "Şəki", NameEn = "Shaki", NameRu = "Шеки", IsMajorCity = true, DisplayOrder = 8, IsActive = true, CreatedAt = now },
			new() { NameAz = "Yevlax", NameEn = "Yevlakh", NameRu = "Евлах", IsMajorCity = true, DisplayOrder = 9, IsActive = true, CreatedAt = now },
			new() { NameAz = "Xankəndi", NameEn = "Khankendi", NameRu = "Ханкенди", IsMajorCity = true, DisplayOrder = 10, IsActive = true, CreatedAt = now },

			// Districts (Rayonlar) - Alphabetically ordered
			new() { NameAz = "Abşeron", NameEn = "Absheron", NameRu = "Апшерон", IsMajorCity = false, DisplayOrder = 100, IsActive = true, CreatedAt = now },
			new() { NameAz = "Ağcabədi", NameEn = "Aghjabadi", NameRu = "Агджабеди", IsMajorCity = false, DisplayOrder = 101, IsActive = true, CreatedAt = now },
			new() { NameAz = "Ağdam", NameEn = "Aghdam", NameRu = "Агдам", IsMajorCity = false, DisplayOrder = 102, IsActive = true, CreatedAt = now },
			new() { NameAz = "Ağdaş", NameEn = "Aghdash", NameRu = "Агдаш", IsMajorCity = false, DisplayOrder = 103, IsActive = true, CreatedAt = now },
			new() { NameAz = "Ağstafa", NameEn = "Aghstafa", NameRu = "Агстафа", IsMajorCity = false, DisplayOrder = 104, IsActive = true, CreatedAt = now },
			new() { NameAz = "Ağsu", NameEn = "Aghsu", NameRu = "Агсу", IsMajorCity = false, DisplayOrder = 105, IsActive = true, CreatedAt = now },
			new() { NameAz = "Astara", NameEn = "Astara", NameRu = "Астара", IsMajorCity = false, DisplayOrder = 106, IsActive = true, CreatedAt = now },
			new() { NameAz = "Babək", NameEn = "Babek", NameRu = "Бабек", IsMajorCity = false, DisplayOrder = 107, IsActive = true, CreatedAt = now },
			new() { NameAz = "Balakən", NameEn = "Balakan", NameRu = "Балакен", IsMajorCity = false, DisplayOrder = 108, IsActive = true, CreatedAt = now },
			new() { NameAz = "Beyləqan", NameEn = "Beylagan", NameRu = "Бейлаган", IsMajorCity = false, DisplayOrder = 109, IsActive = true, CreatedAt = now },
			new() { NameAz = "Bərdə", NameEn = "Barda", NameRu = "Барда", IsMajorCity = false, DisplayOrder = 110, IsActive = true, CreatedAt = now },
			new() { NameAz = "Biləsuvar", NameEn = "Bilasuvar", NameRu = "Билясувар", IsMajorCity = false, DisplayOrder = 111, IsActive = true, CreatedAt = now },
			new() { NameAz = "Cəbrayıl", NameEn = "Jabrayil", NameRu = "Джебраил", IsMajorCity = false, DisplayOrder = 112, IsActive = true, CreatedAt = now },
			new() { NameAz = "Cəlilabad", NameEn = "Jalilabad", NameRu = "Джалилабад", IsMajorCity = false, DisplayOrder = 113, IsActive = true, CreatedAt = now },
			new() { NameAz = "Culfa", NameEn = "Julfa", NameRu = "Джульфа", IsMajorCity = false, DisplayOrder = 114, IsActive = true, CreatedAt = now },
			new() { NameAz = "Daşkəsən", NameEn = "Dashkasan", NameRu = "Дашкесан", IsMajorCity = false, DisplayOrder = 115, IsActive = true, CreatedAt = now },
			new() { NameAz = "Füzuli", NameEn = "Fuzuli", NameRu = "Физули", IsMajorCity = false, DisplayOrder = 116, IsActive = true, CreatedAt = now },
			new() { NameAz = "Gədəbəy", NameEn = "Gadabay", NameRu = "Гедабей", IsMajorCity = false, DisplayOrder = 117, IsActive = true, CreatedAt = now },
			new() { NameAz = "Goranboy", NameEn = "Goranboy", NameRu = "Горанбой", IsMajorCity = false, DisplayOrder = 118, IsActive = true, CreatedAt = now },
			new() { NameAz = "Göyçay", NameEn = "Goychay", NameRu = "Гёйчай", IsMajorCity = false, DisplayOrder = 119, IsActive = true, CreatedAt = now },
			new() { NameAz = "Göygöl", NameEn = "Goygol", NameRu = "Гёйгёль", IsMajorCity = false, DisplayOrder = 120, IsActive = true, CreatedAt = now },
			new() { NameAz = "Hacıqabul", NameEn = "Hajigabul", NameRu = "Гаджигабул", IsMajorCity = false, DisplayOrder = 121, IsActive = true, CreatedAt = now },
			new() { NameAz = "Xaçmaz", NameEn = "Khachmaz", NameRu = "Хачмаз", IsMajorCity = false, DisplayOrder = 122, IsActive = true, CreatedAt = now },
			new() { NameAz = "Xırdalan", NameEn = "Khirdalan", NameRu = "Хырдалан", IsMajorCity = false, DisplayOrder = 123, IsActive = true, CreatedAt = now },
			new() { NameAz = "Xızı", NameEn = "Khizi", NameRu = "Хызы", IsMajorCity = false, DisplayOrder = 124, IsActive = true, CreatedAt = now },
			new() { NameAz = "Xocalı", NameEn = "Khojaly", NameRu = "Ходжалы", IsMajorCity = false, DisplayOrder = 125, IsActive = true, CreatedAt = now },
			new() { NameAz = "Xocavənd", NameEn = "Khojavend", NameRu = "Ходжавенд", IsMajorCity = false, DisplayOrder = 126, IsActive = true, CreatedAt = now },
			new() { NameAz = "İmişli", NameEn = "Imishli", NameRu = "Имишли", IsMajorCity = false, DisplayOrder = 127, IsActive = true, CreatedAt = now },
			new() { NameAz = "İsmayıllı", NameEn = "Ismayilli", NameRu = "Исмаиллы", IsMajorCity = false, DisplayOrder = 128, IsActive = true, CreatedAt = now },
			new() { NameAz = "Kəlbəcər", NameEn = "Kalbajar", NameRu = "Кельбаджар", IsMajorCity = false, DisplayOrder = 129, IsActive = true, CreatedAt = now },
			new() { NameAz = "Kəngərli", NameEn = "Kangarli", NameRu = "Кенгерли", IsMajorCity = false, DisplayOrder = 130, IsActive = true, CreatedAt = now },
			new() { NameAz = "Kürdəmir", NameEn = "Kurdamir", NameRu = "Кюрдамир", IsMajorCity = false, DisplayOrder = 131, IsActive = true, CreatedAt = now },
			new() { NameAz = "Laçın", NameEn = "Lachin", NameRu = "Лачин", IsMajorCity = false, DisplayOrder = 132, IsActive = true, CreatedAt = now },
			new() { NameAz = "Lerik", NameEn = "Lerik", NameRu = "Лерик", IsMajorCity = false, DisplayOrder = 133, IsActive = true, CreatedAt = now },
			new() { NameAz = "Masallı", NameEn = "Masalli", NameRu = "Масаллы", IsMajorCity = false, DisplayOrder = 134, IsActive = true, CreatedAt = now },
			new() { NameAz = "Neftçala", NameEn = "Neftchala", NameRu = "Нефтечала", IsMajorCity = false, DisplayOrder = 135, IsActive = true, CreatedAt = now },
			new() { NameAz = "Oğuz", NameEn = "Oguz", NameRu = "Огуз", IsMajorCity = false, DisplayOrder = 136, IsActive = true, CreatedAt = now },
			new() { NameAz = "Ordubad", NameEn = "Ordubad", NameRu = "Ордубад", IsMajorCity = false, DisplayOrder = 137, IsActive = true, CreatedAt = now },
			new() { NameAz = "Qax", NameEn = "Gakh", NameRu = "Гах", IsMajorCity = false, DisplayOrder = 138, IsActive = true, CreatedAt = now },
			new() { NameAz = "Qazax", NameEn = "Gazakh", NameRu = "Газах", IsMajorCity = false, DisplayOrder = 139, IsActive = true, CreatedAt = now },
			new() { NameAz = "Qəbələ", NameEn = "Gabala", NameRu = "Габала", IsMajorCity = false, DisplayOrder = 140, IsActive = true, CreatedAt = now },
			new() { NameAz = "Qobustan", NameEn = "Gobustan", NameRu = "Гобустан", IsMajorCity = false, DisplayOrder = 141, IsActive = true, CreatedAt = now },
			new() { NameAz = "Quba", NameEn = "Guba", NameRu = "Губа", IsMajorCity = false, DisplayOrder = 142, IsActive = true, CreatedAt = now },
			new() { NameAz = "Qubadlı", NameEn = "Gubadli", NameRu = "Губадлы", IsMajorCity = false, DisplayOrder = 143, IsActive = true, CreatedAt = now },
			new() { NameAz = "Qusar", NameEn = "Gusar", NameRu = "Гусар", IsMajorCity = false, DisplayOrder = 144, IsActive = true, CreatedAt = now },
			new() { NameAz = "Saatlı", NameEn = "Saatli", NameRu = "Саатлы", IsMajorCity = false, DisplayOrder = 145, IsActive = true, CreatedAt = now },
			new() { NameAz = "Sabirabad", NameEn = "Sabirabad", NameRu = "Сабирабад", IsMajorCity = false, DisplayOrder = 146, IsActive = true, CreatedAt = now },
			new() { NameAz = "Şabran", NameEn = "Shabran", NameRu = "Шабран", IsMajorCity = false, DisplayOrder = 147, IsActive = true, CreatedAt = now },
			new() { NameAz = "Sədərək", NameEn = "Sadarak", NameRu = "Садарак", IsMajorCity = false, DisplayOrder = 148, IsActive = true, CreatedAt = now },
			new() { NameAz = "Şahbuz", NameEn = "Shahbuz", NameRu = "Шахбуз", IsMajorCity = false, DisplayOrder = 149, IsActive = true, CreatedAt = now },
			new() { NameAz = "Salyan", NameEn = "Salyan", NameRu = "Сальян", IsMajorCity = false, DisplayOrder = 150, IsActive = true, CreatedAt = now },
			new() { NameAz = "Şamaxı", NameEn = "Shamakhi", NameRu = "Шамахы", IsMajorCity = false, DisplayOrder = 151, IsActive = true, CreatedAt = now },
			new() { NameAz = "Samux", NameEn = "Samukh", NameRu = "Самух", IsMajorCity = false, DisplayOrder = 152, IsActive = true, CreatedAt = now },
			new() { NameAz = "Şərur", NameEn = "Sharur", NameRu = "Шарур", IsMajorCity = false, DisplayOrder = 153, IsActive = true, CreatedAt = now },
			new() { NameAz = "Siyəzən", NameEn = "Siazan", NameRu = "Сиазань", IsMajorCity = false, DisplayOrder = 154, IsActive = true, CreatedAt = now },
			new() { NameAz = "Şuşa", NameEn = "Shusha", NameRu = "Шуша", IsMajorCity = false, DisplayOrder = 155, IsActive = true, CreatedAt = now },
			new() { NameAz = "Tərtər", NameEn = "Tartar", NameRu = "Тертер", IsMajorCity = false, DisplayOrder = 156, IsActive = true, CreatedAt = now },
			new() { NameAz = "Tovuz", NameEn = "Tovuz", NameRu = "Товуз", IsMajorCity = false, DisplayOrder = 157, IsActive = true, CreatedAt = now },
			new() { NameAz = "Ucar", NameEn = "Ujar", NameRu = "Уджар", IsMajorCity = false, DisplayOrder = 158, IsActive = true, CreatedAt = now },
			new() { NameAz = "Yardımlı", NameEn = "Yardimli", NameRu = "Ярдымлы", IsMajorCity = false, DisplayOrder = 159, IsActive = true, CreatedAt = now },
			new() { NameAz = "Zaqatala", NameEn = "Zagatala", NameRu = "Загатала", IsMajorCity = false, DisplayOrder = 160, IsActive = true, CreatedAt = now },
			new() { NameAz = "Zəngilan", NameEn = "Zangilan", NameRu = "Зангилан", IsMajorCity = false, DisplayOrder = 161, IsActive = true, CreatedAt = now },
			new() { NameAz = "Zərdab", NameEn = "Zardab", NameRu = "Зардаб", IsMajorCity = false, DisplayOrder = 162, IsActive = true, CreatedAt = now },
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
				Price = adType == PetAdType.Sale ? random.Next(50, 5000) : 0,
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
