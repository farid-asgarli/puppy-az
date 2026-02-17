using Microsoft.EntityFrameworkCore;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Enums;

namespace PetWebsite.Application.Features.Admin.Dashboard.Queries.GetChartStats;

public class GetChartStatsQueryHandler(
	IApplicationDbContext dbContext,
	ICurrentUserService currentUserService
) : IQueryHandler<GetChartStatsQuery, Result<ChartStatsDto>>
{
	public async Task<Result<ChartStatsDto>> Handle(GetChartStatsQuery request, CancellationToken ct)
	{
		var currentCulture = currentUserService.CurrentCulture;
		var year = request.Year == 0 ? DateTime.UtcNow.Year : request.Year;
		var isMonthly = request.Period.ToLower() == "monthly";

		var result = new ChartStatsDto();

		// Get base data
		var allListings = await dbContext.PetAds
			.Where(p => !p.IsDeleted)
			.Select(p => new
			{
				p.Id,
				p.CreatedAt,
				p.PublishedAt,
				p.Status,
				p.AdType,
				p.Gender,
				p.Size,
				p.IsPremium,
				p.ViewCount,
				p.Price,
				p.CityId,
				CityName = currentCulture == "ru" ? p.City.NameRu : currentCulture == "en" ? p.City.NameEn : p.City.NameAz,
				p.PetBreedId,
				BreedName = p.Breed != null 
					? p.Breed.Localizations
						.Where(l => l.AppLocale.Code == currentCulture || l.AppLocale.IsDefault)
						.OrderByDescending(l => l.AppLocale.Code == currentCulture)
						.Select(l => l.Title)
						.FirstOrDefault() ?? ""
					: "",
				CategoryId = p.Breed != null ? (int?)p.Breed.PetCategoryId : null,
				CategoryName = p.Breed != null 
					? p.Breed.Category.Localizations
						.Where(l => l.AppLocale.Code == currentCulture || l.AppLocale.IsDefault)
						.OrderByDescending(l => l.AppLocale.Code == currentCulture)
						.Select(l => l.Title)
						.FirstOrDefault() ?? ""
					: "",
				p.UserId,
				UserName = p.User.FirstName + " " + p.User.LastName,
				UserPhone = p.User.PhoneNumber ?? ""
			})
			.ToListAsync(ct);

		// 1. Listings Trend (by month or year)
		if (isMonthly)
		{
			result.ListingsTrend = allListings
				.Where(p => p.CreatedAt.Year == year)
				.GroupBy(p => p.CreatedAt.Month)
				.Select(g => new TimeSeriesDataPoint
				{
					Label = GetMonthName(g.Key, currentCulture),
					Value = g.Count(),
					Period = $"{year}-{g.Key:D2}"
				})
				.OrderBy(x => x.Period)
				.ToList();

			// Fill missing months
			for (int month = 1; month <= 12; month++)
			{
				if (!result.ListingsTrend.Any(x => x.Period == $"{year}-{month:D2}"))
				{
					result.ListingsTrend.Add(new TimeSeriesDataPoint
					{
						Label = GetMonthName(month, currentCulture),
						Value = 0,
						Period = $"{year}-{month:D2}"
					});
				}
			}
			result.ListingsTrend = result.ListingsTrend.OrderBy(x => x.Period).ToList();
		}
		else
		{
			result.ListingsTrend = allListings
				.GroupBy(p => p.CreatedAt.Year)
				.Select(g => new TimeSeriesDataPoint
				{
					Label = g.Key.ToString(),
					Value = g.Count(),
					Period = g.Key.ToString()
				})
				.OrderBy(x => x.Period)
				.ToList();
		}

		// 2. Users Trend
		var allUsers = await dbContext.RegularUsers
			.Select(u => new { u.Id, u.CreatedAt })
			.ToListAsync(ct);

		if (isMonthly)
		{
			result.UsersTrend = allUsers
				.Where(u => u.CreatedAt.Year == year)
				.GroupBy(u => u.CreatedAt.Month)
				.Select(g => new TimeSeriesDataPoint
				{
					Label = GetMonthName(g.Key, currentCulture),
					Value = g.Count(),
					Period = $"{year}-{g.Key:D2}"
				})
				.OrderBy(x => x.Period)
				.ToList();

			// Fill missing months
			for (int month = 1; month <= 12; month++)
			{
				if (!result.UsersTrend.Any(x => x.Period == $"{year}-{month:D2}"))
				{
					result.UsersTrend.Add(new TimeSeriesDataPoint
					{
						Label = GetMonthName(month, currentCulture),
						Value = 0,
						Period = $"{year}-{month:D2}"
					});
				}
			}
			result.UsersTrend = result.UsersTrend.OrderBy(x => x.Period).ToList();
		}
		else
		{
			result.UsersTrend = allUsers
				.GroupBy(u => u.CreatedAt.Year)
				.Select(g => new TimeSeriesDataPoint
				{
					Label = g.Key.ToString(),
					Value = g.Count(),
					Period = g.Key.ToString()
				})
				.OrderBy(x => x.Period)
				.ToList();
		}

		// 3. Top/Bottom Categories (filter out null categories)
		var totalListings = allListings.Count;
		var categoryStats = allListings
			.Where(p => p.CategoryId.HasValue)
			.GroupBy(p => new { p.CategoryId, p.CategoryName })
			.Select(g => new RankingItem
			{
				Id = g.Key.CategoryId!.Value,
				Name = g.Key.CategoryName,
				Count = g.Count(),
				Percentage = totalListings > 0 ? Math.Round((double)g.Count() / totalListings * 100, 1) : 0
			})
			.OrderByDescending(x => x.Count)
			.ToList();

		result.TopCategories = categoryStats.Take(5).ToList();
		result.BottomCategories = categoryStats.TakeLast(5).Reverse().ToList();

		// 4. Top/Bottom Breeds (filter out null breeds)
		var breedStats = allListings
			.Where(p => p.PetBreedId.HasValue)
			.GroupBy(p => new { p.PetBreedId, p.BreedName })
			.Select(g => new RankingItem
			{
				Id = g.Key.PetBreedId!.Value,
				Name = g.Key.BreedName,
				Count = g.Count(),
				Percentage = totalListings > 0 ? Math.Round((double)g.Count() / totalListings * 100, 1) : 0
			})
			.OrderByDescending(x => x.Count)
			.ToList();

		result.TopBreeds = breedStats.Take(10).ToList();
		result.BottomBreeds = breedStats.Where(b => b.Count > 0).TakeLast(10).Reverse().ToList();

		// 5. Top/Bottom Cities
		var cityStats = allListings
			.GroupBy(p => new { p.CityId, p.CityName })
			.Select(g => new RankingItem
			{
				Id = g.Key.CityId,
				Name = g.Key.CityName,
				Count = g.Count(),
				Percentage = totalListings > 0 ? Math.Round((double)g.Count() / totalListings * 100, 1) : 0
			})
			.OrderByDescending(x => x.Count)
			.ToList();

		result.TopCities = cityStats.Take(10).ToList();
		result.BottomCities = cityStats.TakeLast(10).Reverse().ToList();

		// 6. Listing Type Distribution
		result.ListingTypeDistribution = allListings
			.GroupBy(p => p.AdType)
			.Select(g => new DistributionItem
			{
				Key = g.Key.ToString(),
				Name = GetAdTypeName(g.Key, currentCulture),
				Count = g.Count(),
				Percentage = totalListings > 0 ? Math.Round((double)g.Count() / totalListings * 100, 1) : 0,
				Color = GetAdTypeColor(g.Key)
			})
			.OrderByDescending(x => x.Count)
			.ToList();

		// 7. Gender Distribution (filter out null genders)
		result.GenderDistribution = allListings
			.Where(p => p.Gender.HasValue)
			.GroupBy(p => p.Gender!.Value)
			.Select(g => new DistributionItem
			{
				Key = g.Key.ToString(),
				Name = GetGenderName(g.Key, currentCulture),
				Count = g.Count(),
				Percentage = totalListings > 0 ? Math.Round((double)g.Count() / totalListings * 100, 1) : 0,
				Color = g.Key == PetGender.Male ? "#3B82F6" : "#EC4899"
			})
			.OrderByDescending(x => x.Count)
			.ToList();

		// 8. Size Distribution
		result.SizeDistribution = allListings
			.Where(p => p.Size.HasValue)
			.GroupBy(p => p.Size!.Value)
			.Select(g => new DistributionItem
			{
				Key = g.Key.ToString(),
				Name = GetSizeName(g.Key, currentCulture),
				Count = g.Count(),
				Percentage = totalListings > 0 ? Math.Round((double)g.Count() / totalListings * 100, 1) : 0,
				Color = GetSizeColor(g.Key)
			})
			.OrderByDescending(x => x.Count)
			.ToList();

		// 9. Status Distribution
		result.StatusDistribution = allListings
			.GroupBy(p => p.Status)
			.Select(g => new DistributionItem
			{
				Key = g.Key.ToString(),
				Name = GetStatusName(g.Key, currentCulture),
				Count = g.Count(),
				Percentage = totalListings > 0 ? Math.Round((double)g.Count() / totalListings * 100, 1) : 0,
				Color = GetStatusColor(g.Key)
			})
			.OrderByDescending(x => x.Count)
			.ToList();

		// 10. Membership Distribution
		result.MembershipDistribution =
		[
			new DistributionItem
			{
				Key = "Premium",
				Name = "Premium",
				Count = allListings.Count(p => p.IsPremium),
				Percentage = totalListings > 0 ? Math.Round((double)allListings.Count(p => p.IsPremium) / totalListings * 100, 1) : 0,
				Color = "#F59E0B"
			},
			new DistributionItem
			{
				Key = "Standard",
				Name = "Standart",
				Count = allListings.Count(p => !p.IsPremium),
				Percentage = totalListings > 0 ? Math.Round((double)allListings.Count(p => !p.IsPremium) / totalListings * 100, 1) : 0,
				Color = "#6B7280"
			}
		];

		// 11. Top Users
		result.TopUsers = allListings
			.Where(p => p.UserId.HasValue)
			.GroupBy(p => new { UserId = p.UserId!.Value, p.UserName, p.UserPhone })
			.Select(g => new UserRankingItem
			{
				UserId = g.Key.UserId,
				FullName = g.Key.UserName,
				Phone = g.Key.UserPhone,
				ListingsCount = g.Count(),
				TotalViews = g.Sum(p => p.ViewCount)
			})
			.OrderByDescending(x => x.ListingsCount)
			.Take(10)
			.ToList();

		// 12. Average Price by Category (filter out null categories)
		result.AveragePriceByCategory = allListings
			.Where(p => p.Price.HasValue && p.Price > 0 && p.CategoryId.HasValue)
			.GroupBy(p => new { p.CategoryId, p.CategoryName })
			.Select(g => new RankingItem
			{
				Id = g.Key.CategoryId!.Value,
				Name = g.Key.CategoryName,
				Count = g.Count(),
				AverageValue = Math.Round(g.Average(p => p.Price!.Value), 2)
			})
			.OrderByDescending(x => x.AverageValue)
			.ToList();

		// 13. Listings by Day of Week
		var dayNames = GetDayNames(currentCulture);
		result.ListingsByDayOfWeek = allListings
			.GroupBy(p => p.CreatedAt.DayOfWeek)
			.Select(g => new DistributionItem
			{
				Key = g.Key.ToString(),
				Name = dayNames[(int)g.Key],
				Count = g.Count(),
				Percentage = totalListings > 0 ? Math.Round((double)g.Count() / totalListings * 100, 1) : 0,
				Color = "#8B5CF6"
			})
			.OrderBy(x => (int)Enum.Parse<DayOfWeek>(x.Key))
			.ToList();

		// 14. Views Trend
		if (isMonthly)
		{
			result.ViewsTrend = allListings
				.Where(p => p.CreatedAt.Year == year)
				.GroupBy(p => p.CreatedAt.Month)
				.Select(g => new TimeSeriesDataPoint
				{
					Label = GetMonthName(g.Key, currentCulture),
					Value = g.Sum(p => p.ViewCount),
					Period = $"{year}-{g.Key:D2}"
				})
				.OrderBy(x => x.Period)
				.ToList();
			
			// Fill missing months for views trend
			for (int month = 1; month <= 12; month++)
			{
				if (!result.ViewsTrend.Any(x => x.Period == $"{year}-{month:D2}"))
				{
					result.ViewsTrend.Add(new TimeSeriesDataPoint
					{
						Label = GetMonthName(month, currentCulture),
						Value = 0,
						Period = $"{year}-{month:D2}"
					});
				}
			}
			result.ViewsTrend = result.ViewsTrend.OrderBy(x => x.Period).ToList();
		}
		else
		{
			result.ViewsTrend = allListings
				.GroupBy(p => p.CreatedAt.Year)
				.Select(g => new TimeSeriesDataPoint
				{
					Label = g.Key.ToString(),
					Value = g.Sum(p => p.ViewCount),
					Period = g.Key.ToString()
				})
				.OrderBy(x => x.Period)
				.ToList();
		}

		return Result<ChartStatsDto>.Success(result);
	}

	private static string GetMonthName(int month, string culture)
	{
		return culture switch
		{
			"az" => month switch
			{
				1 => "Yanvar",
				2 => "Fevral",
				3 => "Mart",
				4 => "Aprel",
				5 => "May",
				6 => "İyun",
				7 => "İyul",
				8 => "Avqust",
				9 => "Sentyabr",
				10 => "Oktyabr",
				11 => "Noyabr",
				12 => "Dekabr",
				_ => month.ToString()
			},
			"ru" => month switch
			{
				1 => "Январь",
				2 => "Февраль",
				3 => "Март",
				4 => "Апрель",
				5 => "Май",
				6 => "Июнь",
				7 => "Июль",
				8 => "Август",
				9 => "Сентябрь",
				10 => "Октябрь",
				11 => "Ноябрь",
				12 => "Декабрь",
				_ => month.ToString()
			},
			_ => month switch
			{
				1 => "January",
				2 => "February",
				3 => "March",
				4 => "April",
				5 => "May",
				6 => "June",
				7 => "July",
				8 => "August",
				9 => "September",
				10 => "October",
				11 => "November",
				12 => "December",
				_ => month.ToString()
			}
		};
	}

	private static string[] GetDayNames(string culture)
	{
		return culture switch
		{
			"az" => ["Bazar", "Bazar ertəsi", "Çərşənbə axşamı", "Çərşənbə", "Cümə axşamı", "Cümə", "Şənbə"],
			"ru" => ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
			_ => ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
		};
	}

	private static string GetAdTypeName(PetAdType adType, string culture)
	{
		return (adType, culture) switch
		{
			(PetAdType.Sale, "az") => "Satış",
			(PetAdType.Sale, "ru") => "Продажа",
			(PetAdType.Sale, _) => "Sale",
			(PetAdType.Match, "az") => "Cütləşmə",
			(PetAdType.Match, "ru") => "Спаривание",
			(PetAdType.Match, _) => "Match",
			(PetAdType.Found, "az") => "Tapılmış",
			(PetAdType.Found, "ru") => "Найдено",
			(PetAdType.Found, _) => "Found",
			(PetAdType.Lost, "az") => "İtirilmiş",
			(PetAdType.Lost, "ru") => "Потеряно",
			(PetAdType.Lost, _) => "Lost",
			(PetAdType.Owning, "az") => "Sahiblənmə",
			(PetAdType.Owning, "ru") => "Усыновление",
			(PetAdType.Owning, _) => "Owning",
			_ => adType.ToString()
		};
	}

	private static string GetAdTypeColor(PetAdType adType)
	{
		return adType switch
		{
			PetAdType.Sale => "#10B981",
			PetAdType.Match => "#8B5CF6",
			PetAdType.Found => "#3B82F6",
			PetAdType.Lost => "#EF4444",
			PetAdType.Owning => "#F59E0B",
			_ => "#6B7280"
		};
	}

	private static string GetGenderName(PetGender gender, string culture)
	{
		return (gender, culture) switch
		{
			(PetGender.Male, "az") => "Erkək",
			(PetGender.Male, "ru") => "Мужской",
			(PetGender.Male, _) => "Male",
			(PetGender.Female, "az") => "Dişi",
			(PetGender.Female, "ru") => "Женский",
			(PetGender.Female, _) => "Female",
			_ => gender.ToString()
		};
	}

	private static string GetSizeName(PetSize size, string culture)
	{
		return (size, culture) switch
		{
			(PetSize.ExtraSmall, "az") => "Çox Kiçik",
			(PetSize.ExtraSmall, "ru") => "Очень маленький",
			(PetSize.ExtraSmall, _) => "Extra Small",
			(PetSize.Small, "az") => "Kiçik",
			(PetSize.Small, "ru") => "Маленький",
			(PetSize.Small, _) => "Small",
			(PetSize.Medium, "az") => "Orta",
			(PetSize.Medium, "ru") => "Средний",
			(PetSize.Medium, _) => "Medium",
			(PetSize.Large, "az") => "Böyük",
			(PetSize.Large, "ru") => "Большой",
			(PetSize.Large, _) => "Large",
			(PetSize.ExtraLarge, "az") => "Çox Böyük",
			(PetSize.ExtraLarge, "ru") => "Очень большой",
			(PetSize.ExtraLarge, _) => "Extra Large",
			_ => size.ToString()
		};
	}

	private static string GetSizeColor(PetSize size)
	{
		return size switch
		{
			PetSize.ExtraSmall => "#EC4899",
			PetSize.Small => "#8B5CF6",
			PetSize.Medium => "#3B82F6",
			PetSize.Large => "#10B981",
			PetSize.ExtraLarge => "#F59E0B",
			_ => "#6B7280"
		};
	}

	private static string GetStatusName(PetAdStatus status, string culture)
	{
		return (status, culture) switch
		{
			(PetAdStatus.Pending, "az") => "Gözləmədə",
			(PetAdStatus.Pending, "ru") => "Ожидает",
			(PetAdStatus.Pending, _) => "Pending",
			(PetAdStatus.Published, "az") => "Aktiv",
			(PetAdStatus.Published, "ru") => "Активно",
			(PetAdStatus.Published, _) => "Active",
			(PetAdStatus.Rejected, "az") => "Rədd edilmiş",
			(PetAdStatus.Rejected, "ru") => "Отклонено",
			(PetAdStatus.Rejected, _) => "Rejected",
			(PetAdStatus.Expired, "az") => "Vaxtı bitmiş",
			(PetAdStatus.Expired, "ru") => "Истекло",
			(PetAdStatus.Expired, _) => "Expired",
			_ => status.ToString()
		};
	}

	private static string GetStatusColor(PetAdStatus status)
	{
		return status switch
		{
			PetAdStatus.Pending => "#F59E0B",
			PetAdStatus.Published => "#10B981",
			PetAdStatus.Rejected => "#EF4444",
			PetAdStatus.Expired => "#6B7280",
			_ => "#6B7280"
		};
	}
}
