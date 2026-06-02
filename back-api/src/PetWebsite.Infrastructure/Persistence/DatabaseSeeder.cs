using System.Globalization;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Entities;
using PetWebsite.Domain.Enums;

namespace PetWebsite.Infrastructure.Persistence;

public static partial class DatabaseSeeder
{
	public static async Task SeedAsync(
		ApplicationDbContext context,
		UserManager<AdminUser> userManager,
		RoleManager<IdentityRole<Guid>> roleManager
	)
	{
		// Run migrations if needed (safe to call even if already up to date)
		try
		{
			await context.Database.MigrateAsync();
			Console.WriteLine("[DatabaseSeeder] Migrations applied");
		}
		catch (Exception ex)
		{
			Console.WriteLine($"[DatabaseSeeder] Migration warning: {ex.Message}");
		}

		// Each seed method guards itself with an existence check — safe to call repeatedly
		await SeedRolesAsync(roleManager);
		await SeedSuperAdminAsync(userManager);
		await SeedLocalesAsync(context);
		await SeedPetCategoriesAndBreedsAsync(context);
		await SeedPetColorsAsync(context);
		await SeedPetAdTypesAsync(context);
		await SeedCitiesAsync(context);
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

		// Get locales
		var azLocale = await context.AppLocales.FirstOrDefaultAsync(l => l.Code == "az");
		var enLocale = await context.AppLocales.FirstOrDefaultAsync(l => l.Code == "en");
		var ruLocale = await context.AppLocales.FirstOrDefaultAsync(l => l.Code == "ru");
		if (azLocale == null || enLocale == null || ruLocale == null)
			return;

		// Read seed.json for category metadata
		var seedJsonPath = ResolveSeedFilePath("seed.json");
		if (seedJsonPath == null)
		{
			Console.WriteLine("Warning: seed.json file not found. Skipping pet categories and breeds seeding.");
			return;
		}

		var jsonContent = await File.ReadAllTextAsync(seedJsonPath);
		var seedData = JsonSerializer.Deserialize<Dictionary<string, PetCategorySeedData>>(
			jsonContent,
			new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
		);

		if (seedData == null)
			return;

		// Read seed-breeds.json for trilingual breed data
		var breedsJsonPath = ResolveSeedFilePath("seed-breeds.json");
		if (breedsJsonPath == null)
		{
			Console.WriteLine("Warning: seed-breeds.json file not found. Skipping breeds seeding.");
			return;
		}

		var breedsJsonContent = await File.ReadAllTextAsync(breedsJsonPath);
		var breedsData = JsonSerializer.Deserialize<Dictionary<string, List<BreedSeedData>>>(
			breedsJsonContent,
			new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
		);

		// Map category keys from seed.json to breed keys in seed-breeds.json
		var categoryToBreedKey = new Dictionary<string, string>
		{
			{ "dog", "dog" },
			{ "cat", "cat" },
			{ "bird", "bird" },
			{ "fish", "fish" },
			{ "reptile", "reptile" },
			{ "insect", "insect" },
			{ "farmAnimal", "farm" },
			{ "rodent", "rodent" },
			{ "wildAnimal", "wild" },
			{ "other", "other" },
		};

		var orderedCategories = seedData.OrderBy(kvp => kvp.Value.Order).ToList();

		// Track used slugs per locale to avoid unique constraint violations
		var usedSlugs = new Dictionary<int, HashSet<string>>
		{
			{ azLocale.Id, new HashSet<string>() },
			{ enLocale.Id, new HashSet<string>() },
			{ ruLocale.Id, new HashSet<string>() },
		};

		foreach (var (categoryKey, data) in orderedCategories)
		{
			if (data.Order <= 0)
				continue;

			var category = new PetCategory
			{
				SvgIcon = data.Icon,
				IconColor = data.IconColor,
				BackgroundColor = data.BgColor,
				IsActive = true,
				CreatedAt = DateTime.UtcNow,
			};

			// Add category localizations for AZ / EN / RU
			category.Localizations.Add(
				new PetCategoryLocalization
				{
					AppLocaleId = azLocale.Id,
					Title = data.TitleAz,
					Subtitle = data.SubtitleAz,
					Slug = Slugify(data.TitleAz),
				}
			);
			category.Localizations.Add(
				new PetCategoryLocalization
				{
					AppLocaleId = enLocale.Id,
					Title = data.TitleEn,
					Subtitle = data.SubtitleEn,
					Slug = Slugify(data.TitleEn),
				}
			);
			category.Localizations.Add(
				new PetCategoryLocalization
				{
					AppLocaleId = ruLocale.Id,
					Title = data.TitleRu,
					Subtitle = data.SubtitleRu,
					Slug = Slugify(data.TitleRu),
				}
			);

			// Add breeds from trilingual seed-breeds.json
			if (
				breedsData != null
				&& categoryToBreedKey.TryGetValue(categoryKey, out var breedKey)
				&& breedsData.TryGetValue(breedKey, out var breeds)
			)
			{
				foreach (var breedEntry in breeds)
				{
					var breed = new PetBreed { IsActive = true, CreatedAt = DateTime.UtcNow };

					breed.Localizations.Add(
						new PetBreedLocalization
						{
							AppLocaleId = azLocale.Id,
							Title = breedEntry.Az,
							Slug = GetUniqueSlug(breedEntry.Az, azLocale.Id, usedSlugs),
						}
					);
					breed.Localizations.Add(
						new PetBreedLocalization
						{
							AppLocaleId = enLocale.Id,
							Title = breedEntry.En,
							Slug = GetUniqueSlug(breedEntry.En, enLocale.Id, usedSlugs),
						}
					);
					breed.Localizations.Add(
						new PetBreedLocalization
						{
							AppLocaleId = ruLocale.Id,
							Title = breedEntry.Ru,
							Slug = GetUniqueSlug(breedEntry.Ru, ruLocale.Id, usedSlugs),
						}
					);

					category.Breeds.Add(breed);
				}
			}

			await context.PetCategories.AddAsync(category);
		}

		await context.SaveChangesAsync();
		Console.WriteLine($"Successfully seeded {orderedCategories.Count} pet categories with trilingual breeds.");
	}

	private static string? ResolveSeedFilePath(string fileName)
	{
		var path = Path.Combine(AppContext.BaseDirectory, fileName);
		if (File.Exists(path))
			return path;

		var altPath = Path.Combine(Directory.GetCurrentDirectory(), fileName);
		if (File.Exists(altPath))
			return altPath;

		return null;
	}

	private static string GetUniqueSlug(string text, int localeId, Dictionary<int, HashSet<string>> usedSlugs)
	{
		var slug = Slugify(text);
		var localeSet = usedSlugs[localeId];
		if (localeSet.Add(slug))
			return slug;

		var counter = 2;
		while (!localeSet.Add($"{slug}-{counter}"))
			counter++;

		return $"{slug}-{counter}";
	}

	// Helper classes for JSON deserialization
	private class PetCategorySeedData
	{
		public int Order { get; set; }
		public string Icon { get; set; } = string.Empty;
		public string IconColor { get; set; } = string.Empty;
		public string BgColor { get; set; } = string.Empty;
		public string TitleAz { get; set; } = string.Empty;
		public string TitleEn { get; set; } = string.Empty;
		public string TitleRu { get; set; } = string.Empty;
		public string SubtitleAz { get; set; } = string.Empty;
		public string SubtitleEn { get; set; } = string.Empty;
		public string SubtitleRu { get; set; } = string.Empty;
		public int Count { get; set; }
		public List<string> Breeds { get; set; } = [];
	}

	private class BreedSeedData
	{
		public string Az { get; set; } = string.Empty;
		public string En { get; set; } = string.Empty;
		public string Ru { get; set; } = string.Empty;
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
				CreatedAt = now,
			};

			petColor.Localizations.Add(new PetColorLocalization { AppLocaleId = azLocale.Id, Title = az });

			petColor.Localizations.Add(new PetColorLocalization { AppLocaleId = enLocale.Id, Title = en });

			petColor.Localizations.Add(new PetColorLocalization { AppLocaleId = ruLocale.Id, Title = ru });

			context.PetColors.Add(petColor);
		}

		await context.SaveChangesAsync();
		Console.WriteLine($"Successfully seeded {colors.Count} pet colors with localizations.");
	}

	private static async Task SeedPetAdTypesAsync(ApplicationDbContext context)
	{
		if (await context.PetAdTypes.AnyAsync())
			return;

		// Get locales
		var azLocale = await context.AppLocales.FirstOrDefaultAsync(l => l.Code == "az");
		var enLocale = await context.AppLocales.FirstOrDefaultAsync(l => l.Code == "en");
		var ruLocale = await context.AppLocales.FirstOrDefaultAsync(l => l.Code == "ru");

		if (azLocale == null || enLocale == null || ruLocale == null)
			return;

		var now = DateTime.UtcNow;

		// Pet ad types with their styling and localizations
		var adTypes = new List<(
			int Id,
			string Key,
			string Emoji,
			string BgColor,
			string TextColor,
			string BorderColor,
			string TitleAz,
			string TitleEn,
			string TitleRu,
			string DescAz,
			string DescEn,
			string DescRu
		)>
		{
			(
				1,
				"sale",
				"💰",
				"bg-sky-100",
				"text-sky-600",
				"border-sky-200",
				"Satış",
				"For Sale",
				"Продажа",
				"Satılıq ev heyvanları tapın",
				"Find pets for sale",
				"Найдите питомцев на продажу"
			),
			(
				2,
				"match",
				"❤️",
				"bg-rose-100",
				"text-rose-600",
				"border-rose-200",
				"Cütləşmə",
				"Mating",
				"Вязка",
				"Cütləşmə sorğuları üçün",
				"For mating requests",
				"Для запросов на спаривание"
			),
			(
				3,
				"found",
				"🔍",
				"bg-indigo-100",
				"text-indigo-600",
				"border-indigo-200",
				"Tapılıb",
				"Found",
				"Найдено",
				"Yaxınlıqda tapılmış heyvanlar",
				"Found pets nearby",
				"Найденные животные поблизости"
			),
			(
				4,
				"lost",
				"😢",
				"bg-teal-100",
				"text-teal-600",
				"border-teal-200",
				"İtirilmişdir",
				"Lost",
				"Потерянно",
				"İtirilmiş heyvanların tapılmasına kömək edin",
				"Help find lost pets",
				"Помогите найти потерянных питомцев"
			),
			(
				5,
				"owning",
				"🏠",
				"bg-amber-100",
				"text-amber-600",
				"border-amber-200",
				"Sahiblənmə",
				"Adoption",
				"Усыновление",
				"Ev axtaran heyvanlar",
				"Pets looking for a home",
				"Питомцы в поисках дома"
			),
		};

		foreach (var adType in adTypes)
		{
			var petAdType = new PetAdTypeEntity
			{
				Id = adType.Id,
				Key = adType.Key,
				Emoji = adType.Emoji,
				BackgroundColor = adType.BgColor,
				TextColor = adType.TextColor,
				BorderColor = adType.BorderColor,
				SortOrder = adType.Id,
				IsActive = true,
				CreatedAt = now,
			};

			petAdType.Localizations.Add(
				new PetAdTypeLocalization
				{
					AppLocaleId = azLocale.Id,
					Title = adType.TitleAz,
					Description = adType.DescAz,
				}
			);

			petAdType.Localizations.Add(
				new PetAdTypeLocalization
				{
					AppLocaleId = enLocale.Id,
					Title = adType.TitleEn,
					Description = adType.DescEn,
				}
			);

			petAdType.Localizations.Add(
				new PetAdTypeLocalization
				{
					AppLocaleId = ruLocale.Id,
					Title = adType.TitleRu,
					Description = adType.DescRu,
				}
			);

			context.PetAdTypes.Add(petAdType);
		}

		await context.SaveChangesAsync();
		Console.WriteLine($"Successfully seeded {adTypes.Count} pet ad types with localizations.");
	}

	private static async Task SeedCitiesAsync(ApplicationDbContext context)
	{
		if (await context.Cities.AnyAsync())
			return;

		var now = DateTime.UtcNow;
		var cities = new List<City>
		{
			// Major Cities (İri Şəhərlər)
			new()
			{
				NameAz = "Bakı",
				NameEn = "Baku",
				NameRu = "Баку",
				IsMajorCity = true,
				DisplayOrder = 1,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Gəncə",
				NameEn = "Ganja",
				NameRu = "Гянджа",
				IsMajorCity = true,
				DisplayOrder = 2,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Sumqayıt",
				NameEn = "Sumgait",
				NameRu = "Сумгаит",
				IsMajorCity = true,
				DisplayOrder = 3,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Mingəçevir",
				NameEn = "Mingachevir",
				NameRu = "Мингечевир",
				IsMajorCity = true,
				DisplayOrder = 4,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Lənkəran",
				NameEn = "Lankaran",
				NameRu = "Ленкорань",
				IsMajorCity = true,
				DisplayOrder = 5,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Şirvan",
				NameEn = "Shirvan",
				NameRu = "Ширван",
				IsMajorCity = true,
				DisplayOrder = 6,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Naxçıvan",
				NameEn = "Nakhchivan",
				NameRu = "Нахичевань",
				IsMajorCity = true,
				DisplayOrder = 7,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Şəki",
				NameEn = "Shaki",
				NameRu = "Шеки",
				IsMajorCity = true,
				DisplayOrder = 8,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Yevlax",
				NameEn = "Yevlakh",
				NameRu = "Евлах",
				IsMajorCity = true,
				DisplayOrder = 9,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Xankəndi",
				NameEn = "Khankendi",
				NameRu = "Ханкенди",
				IsMajorCity = true,
				DisplayOrder = 10,
				IsActive = true,
				CreatedAt = now,
			},
			// Districts (Rayonlar) - Alphabetically ordered
			new()
			{
				NameAz = "Abşeron",
				NameEn = "Absheron",
				NameRu = "Апшерон",
				IsMajorCity = false,
				DisplayOrder = 100,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Ağcabədi",
				NameEn = "Aghjabadi",
				NameRu = "Агджабеди",
				IsMajorCity = false,
				DisplayOrder = 101,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Ağdam",
				NameEn = "Aghdam",
				NameRu = "Агдам",
				IsMajorCity = false,
				DisplayOrder = 102,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Ağdaş",
				NameEn = "Aghdash",
				NameRu = "Агдаш",
				IsMajorCity = false,
				DisplayOrder = 103,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Ağstafa",
				NameEn = "Aghstafa",
				NameRu = "Агстафа",
				IsMajorCity = false,
				DisplayOrder = 104,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Ağsu",
				NameEn = "Aghsu",
				NameRu = "Агсу",
				IsMajorCity = false,
				DisplayOrder = 105,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Astara",
				NameEn = "Astara",
				NameRu = "Астара",
				IsMajorCity = false,
				DisplayOrder = 106,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Babək",
				NameEn = "Babek",
				NameRu = "Бабек",
				IsMajorCity = false,
				DisplayOrder = 107,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Balakən",
				NameEn = "Balakan",
				NameRu = "Балакен",
				IsMajorCity = false,
				DisplayOrder = 108,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Beyləqan",
				NameEn = "Beylagan",
				NameRu = "Бейлаган",
				IsMajorCity = false,
				DisplayOrder = 109,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Bərdə",
				NameEn = "Barda",
				NameRu = "Барда",
				IsMajorCity = false,
				DisplayOrder = 110,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Biləsuvar",
				NameEn = "Bilasuvar",
				NameRu = "Билясувар",
				IsMajorCity = false,
				DisplayOrder = 111,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Cəbrayıl",
				NameEn = "Jabrayil",
				NameRu = "Джебраил",
				IsMajorCity = false,
				DisplayOrder = 112,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Cəlilabad",
				NameEn = "Jalilabad",
				NameRu = "Джалилабад",
				IsMajorCity = false,
				DisplayOrder = 113,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Culfa",
				NameEn = "Julfa",
				NameRu = "Джульфа",
				IsMajorCity = false,
				DisplayOrder = 114,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Daşkəsən",
				NameEn = "Dashkasan",
				NameRu = "Дашкесан",
				IsMajorCity = false,
				DisplayOrder = 115,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Füzuli",
				NameEn = "Fuzuli",
				NameRu = "Физули",
				IsMajorCity = false,
				DisplayOrder = 116,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Gədəbəy",
				NameEn = "Gadabay",
				NameRu = "Гедабей",
				IsMajorCity = false,
				DisplayOrder = 117,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Goranboy",
				NameEn = "Goranboy",
				NameRu = "Горанбой",
				IsMajorCity = false,
				DisplayOrder = 118,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Göyçay",
				NameEn = "Goychay",
				NameRu = "Гёйчай",
				IsMajorCity = false,
				DisplayOrder = 119,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Göygöl",
				NameEn = "Goygol",
				NameRu = "Гёйгёль",
				IsMajorCity = false,
				DisplayOrder = 120,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Hacıqabul",
				NameEn = "Hajigabul",
				NameRu = "Гаджигабул",
				IsMajorCity = false,
				DisplayOrder = 121,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Xaçmaz",
				NameEn = "Khachmaz",
				NameRu = "Хачмаз",
				IsMajorCity = false,
				DisplayOrder = 122,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Xırdalan",
				NameEn = "Khirdalan",
				NameRu = "Хырдалан",
				IsMajorCity = false,
				DisplayOrder = 123,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Xızı",
				NameEn = "Khizi",
				NameRu = "Хызы",
				IsMajorCity = false,
				DisplayOrder = 124,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Xocalı",
				NameEn = "Khojaly",
				NameRu = "Ходжалы",
				IsMajorCity = false,
				DisplayOrder = 125,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Xocavənd",
				NameEn = "Khojavend",
				NameRu = "Ходжавенд",
				IsMajorCity = false,
				DisplayOrder = 126,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "İmişli",
				NameEn = "Imishli",
				NameRu = "Имишли",
				IsMajorCity = false,
				DisplayOrder = 127,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "İsmayıllı",
				NameEn = "Ismayilli",
				NameRu = "Исмаиллы",
				IsMajorCity = false,
				DisplayOrder = 128,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Kəlbəcər",
				NameEn = "Kalbajar",
				NameRu = "Кельбаджар",
				IsMajorCity = false,
				DisplayOrder = 129,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Kəngərli",
				NameEn = "Kangarli",
				NameRu = "Кенгерли",
				IsMajorCity = false,
				DisplayOrder = 130,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Kürdəmir",
				NameEn = "Kurdamir",
				NameRu = "Кюрдамир",
				IsMajorCity = false,
				DisplayOrder = 131,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Laçın",
				NameEn = "Lachin",
				NameRu = "Лачин",
				IsMajorCity = false,
				DisplayOrder = 132,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Lerik",
				NameEn = "Lerik",
				NameRu = "Лерик",
				IsMajorCity = false,
				DisplayOrder = 133,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Masallı",
				NameEn = "Masalli",
				NameRu = "Масаллы",
				IsMajorCity = false,
				DisplayOrder = 134,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Neftçala",
				NameEn = "Neftchala",
				NameRu = "Нефтечала",
				IsMajorCity = false,
				DisplayOrder = 135,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Oğuz",
				NameEn = "Oguz",
				NameRu = "Огуз",
				IsMajorCity = false,
				DisplayOrder = 136,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Ordubad",
				NameEn = "Ordubad",
				NameRu = "Ордубад",
				IsMajorCity = false,
				DisplayOrder = 137,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Qax",
				NameEn = "Gakh",
				NameRu = "Гах",
				IsMajorCity = false,
				DisplayOrder = 138,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Qazax",
				NameEn = "Gazakh",
				NameRu = "Газах",
				IsMajorCity = false,
				DisplayOrder = 139,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Qəbələ",
				NameEn = "Gabala",
				NameRu = "Габала",
				IsMajorCity = false,
				DisplayOrder = 140,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Qobustan",
				NameEn = "Gobustan",
				NameRu = "Гобустан",
				IsMajorCity = false,
				DisplayOrder = 141,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Quba",
				NameEn = "Guba",
				NameRu = "Губа",
				IsMajorCity = false,
				DisplayOrder = 142,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Qubadlı",
				NameEn = "Gubadli",
				NameRu = "Губадлы",
				IsMajorCity = false,
				DisplayOrder = 143,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Qusar",
				NameEn = "Gusar",
				NameRu = "Гусар",
				IsMajorCity = false,
				DisplayOrder = 144,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Saatlı",
				NameEn = "Saatli",
				NameRu = "Саатлы",
				IsMajorCity = false,
				DisplayOrder = 145,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Sabirabad",
				NameEn = "Sabirabad",
				NameRu = "Сабирабад",
				IsMajorCity = false,
				DisplayOrder = 146,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Şabran",
				NameEn = "Shabran",
				NameRu = "Шабран",
				IsMajorCity = false,
				DisplayOrder = 147,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Sədərək",
				NameEn = "Sadarak",
				NameRu = "Садарак",
				IsMajorCity = false,
				DisplayOrder = 148,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Şahbuz",
				NameEn = "Shahbuz",
				NameRu = "Шахбуз",
				IsMajorCity = false,
				DisplayOrder = 149,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Salyan",
				NameEn = "Salyan",
				NameRu = "Сальян",
				IsMajorCity = false,
				DisplayOrder = 150,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Şamaxı",
				NameEn = "Shamakhi",
				NameRu = "Шамахы",
				IsMajorCity = false,
				DisplayOrder = 151,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Samux",
				NameEn = "Samukh",
				NameRu = "Самух",
				IsMajorCity = false,
				DisplayOrder = 152,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Şərur",
				NameEn = "Sharur",
				NameRu = "Шарур",
				IsMajorCity = false,
				DisplayOrder = 153,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Siyəzən",
				NameEn = "Siazan",
				NameRu = "Сиазань",
				IsMajorCity = false,
				DisplayOrder = 154,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Şuşa",
				NameEn = "Shusha",
				NameRu = "Шуша",
				IsMajorCity = false,
				DisplayOrder = 155,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Tərtər",
				NameEn = "Tartar",
				NameRu = "Тертер",
				IsMajorCity = false,
				DisplayOrder = 156,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Tovuz",
				NameEn = "Tovuz",
				NameRu = "Товуз",
				IsMajorCity = false,
				DisplayOrder = 157,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Ucar",
				NameEn = "Ujar",
				NameRu = "Уджар",
				IsMajorCity = false,
				DisplayOrder = 158,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Yardımlı",
				NameEn = "Yardimli",
				NameRu = "Ярдымлы",
				IsMajorCity = false,
				DisplayOrder = 159,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Zaqatala",
				NameEn = "Zagatala",
				NameRu = "Загатала",
				IsMajorCity = false,
				DisplayOrder = 160,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Zəngilan",
				NameEn = "Zangilan",
				NameRu = "Зангилан",
				IsMajorCity = false,
				DisplayOrder = 161,
				IsActive = true,
				CreatedAt = now,
			},
			new()
			{
				NameAz = "Zərdab",
				NameEn = "Zardab",
				NameRu = "Зардаб",
				IsMajorCity = false,
				DisplayOrder = 162,
				IsActive = true,
				CreatedAt = now,
			},
		};

		await context.Cities.AddRangeAsync(cities);
		await context.SaveChangesAsync();
	}

	/// <summary>
	/// Converts a title string to a URL-friendly slug.
	/// Handles Azerbaijani, English and Russian characters.
	/// </summary>
	public static string Slugify(string text)
	{
		if (string.IsNullOrWhiteSpace(text))
			return string.Empty;

		// Azerbaijani character mappings
		var azMappings = new Dictionary<char, string>
		{
			{ 'ə', "e" },
			{ 'Ə', "e" },
			{ 'ü', "u" },
			{ 'Ü', "u" },
			{ 'ö', "o" },
			{ 'Ö', "o" },
			{ 'ğ', "g" },
			{ 'Ğ', "g" },
			{ 'ı', "i" },
			{ 'İ', "i" },
			{ 'ç', "c" },
			{ 'Ç', "c" },
			{ 'ş', "s" },
			{ 'Ş', "s" },
		};

		// Russian transliteration
		var ruMappings = new Dictionary<char, string>
		{
			{ 'а', "a" },
			{ 'б', "b" },
			{ 'в', "v" },
			{ 'г', "g" },
			{ 'д', "d" },
			{ 'е', "e" },
			{ 'ё', "yo" },
			{ 'ж', "zh" },
			{ 'з', "z" },
			{ 'и', "i" },
			{ 'й', "y" },
			{ 'к', "k" },
			{ 'л', "l" },
			{ 'м', "m" },
			{ 'н', "n" },
			{ 'о', "o" },
			{ 'п', "p" },
			{ 'р', "r" },
			{ 'с', "s" },
			{ 'т', "t" },
			{ 'у', "u" },
			{ 'ф', "f" },
			{ 'х', "kh" },
			{ 'ц', "ts" },
			{ 'ч', "ch" },
			{ 'ш', "sh" },
			{ 'щ', "shch" },
			{ 'ъ', "" },
			{ 'ы', "y" },
			{ 'ь', "" },
			{ 'э', "e" },
			{ 'ю', "yu" },
			{ 'я', "ya" },
			{ 'А', "a" },
			{ 'Б', "b" },
			{ 'В', "v" },
			{ 'Г', "g" },
			{ 'Д', "d" },
			{ 'Е', "e" },
			{ 'Ё', "yo" },
			{ 'Ж', "zh" },
			{ 'З', "z" },
			{ 'И', "i" },
			{ 'Й', "y" },
			{ 'К', "k" },
			{ 'Л', "l" },
			{ 'М', "m" },
			{ 'Н', "n" },
			{ 'О', "o" },
			{ 'П', "p" },
			{ 'Р', "r" },
			{ 'С', "s" },
			{ 'Т', "t" },
			{ 'У', "u" },
			{ 'Ф', "f" },
			{ 'Х', "kh" },
			{ 'Ц', "ts" },
			{ 'Ч', "ch" },
			{ 'Ш', "sh" },
			{ 'Щ', "shch" },
			{ 'Ъ', "" },
			{ 'Ы', "y" },
			{ 'Ь', "" },
			{ 'Э', "e" },
			{ 'Ю', "yu" },
			{ 'Я', "ya" },
		};

		var sb = new StringBuilder(text.Length);
		foreach (var c in text)
		{
			if (azMappings.TryGetValue(c, out var azReplacement))
				sb.Append(azReplacement);
			else if (ruMappings.TryGetValue(c, out var ruReplacement))
				sb.Append(ruReplacement);
			else
				sb.Append(c);
		}

		var result = sb.ToString().ToLowerInvariant();

		// Normalize unicode and remove diacritics
		result = result.Normalize(NormalizationForm.FormD);
		result = NonAsciiLetterRegex().Replace(result, "");

		// Replace non-alphanumeric with hyphens
		result = NonAlphanumericRegex().Replace(result, "-");

		// Remove consecutive hyphens
		result = ConsecutiveHyphensRegex().Replace(result, "-");

		// Trim hyphens
		result = result.Trim('-');

		return result;
	}

	[GeneratedRegex(@"[\p{Mn}]")]
	private static partial Regex NonAsciiLetterRegex();

	[GeneratedRegex(@"[^a-z0-9]+")]
	private static partial Regex NonAlphanumericRegex();

	[GeneratedRegex(@"-{2,}")]
	private static partial Regex ConsecutiveHyphensRegex();
}
