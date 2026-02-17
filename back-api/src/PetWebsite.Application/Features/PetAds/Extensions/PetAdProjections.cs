using System.Linq.Expressions;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Features.PetAds.Extensions;

/// <summary>
/// Provides reusable projection expressions for PetAd entities.
/// </summary>
public static class PetAdProjections
{
	/// <summary>
	/// Projects a PetAd entity to PetAdListItemDto with localized category title.
	/// This expression can be used in EF Core queries and will be translated to SQL.
	/// </summary>
	/// <param name="currentCulture">The current culture code (e.g., "en", "az") for localization.</param>
	/// <returns>An expression that can be used in Select() statements.</returns>
	public static Expression<Func<PetAd, PetAdListItemDto>> ToListItemDto(string currentCulture)
	{
		return p => new PetAdListItemDto
		{
			Id = p.Id,
			Title = p.Title,
			AgeInMonths = p.AgeInMonths,
			Gender = p.Gender,
			AdType = p.AdType,
			Price = p.Price,
			PublishedAt = p.PublishedAt ?? p.CreatedAt,
			IsPremium = p.IsPremium,
			IsVip = p.IsVip,
			RejectionReason = p.RejectionReason,
			// Get category title either from direct Category relation or from Breed's Category
			CategoryTitle = p.Category != null
				? p.Category.Localizations.Where(l => l.AppLocale.Code == currentCulture || l.AppLocale.IsDefault)
					.OrderByDescending(l => l.AppLocale.Code == currentCulture)
					.Select(l => l.Title)
					.FirstOrDefault() ?? ""
				: p.Breed != null
					? p.Breed.Category.Localizations.Where(l => l.AppLocale.Code == currentCulture || l.AppLocale.IsDefault)
						.OrderByDescending(l => l.AppLocale.Code == currentCulture)
						.Select(l => l.Title)
						.FirstOrDefault() ?? ""
					: "",
			BreedTitle = p.Breed != null
				? p.Breed.Localizations.Where(l => l.AppLocale.Code == currentCulture || l.AppLocale.IsDefault)
					.OrderByDescending(l => l.AppLocale.Code == currentCulture)
					.Select(l => l.Title)
					.FirstOrDefault() ?? ""
				: "",
			BreedId = p.PetBreedId,
			// Use direct PetCategoryId if available, otherwise fallback to Breed's Category
			CategoryId = p.PetCategoryId ?? (p.Breed != null ? p.Breed.Category.Id : (int?)null),
			CategorySlug = p.Category != null
				? p.Category.Localizations.Where(l => l.AppLocale.Code == currentCulture || l.AppLocale.IsDefault)
					.OrderByDescending(l => l.AppLocale.Code == currentCulture)
					.Select(l => l.Slug)
					.FirstOrDefault() ?? ""
				: p.Breed != null
					? p.Breed.Category.Localizations.Where(l => l.AppLocale.Code == currentCulture || l.AppLocale.IsDefault)
						.OrderByDescending(l => l.AppLocale.Code == currentCulture)
						.Select(l => l.Slug)
						.FirstOrDefault() ?? ""
					: "",
			BreedSlug = p.Breed != null
				? p.Breed.Localizations.Where(l => l.AppLocale.Code == currentCulture || l.AppLocale.IsDefault)
					.OrderByDescending(l => l.AppLocale.Code == currentCulture)
					.Select(l => l.Slug)
					.FirstOrDefault() ?? ""
				: "",
			CityId = p.CityId,
			CityName = currentCulture == "ru" ? p.City.NameRu : currentCulture == "en" ? p.City.NameEn : p.City.NameAz,
			DistrictId = p.DistrictId,
			DistrictName = p.District != null
				? (currentCulture == "ru" ? p.District.NameRu : currentCulture == "en" ? p.District.NameEn : p.District.NameAz)
				: null,
			PrimaryImageUrl =
				p.Images.Where(i => i.IsPrimary).Select(i => i.FilePath).FirstOrDefault()
				?? p.Images.OrderBy(i => i.Id).Select(i => i.FilePath).FirstOrDefault()
				?? "",
			Size = p.Size,
			Color = p.Color ?? "",
			SuggestedBreedName = p.SuggestedBreedName,
			CustomDistrictName = p.CustomDistrictName,
		};
	}

	/// <summary>
	/// Projects a PetAd entity to MyPetAdListItemDto with localized category title.
	/// This expression can be used in EF Core queries and will be translated to SQL.
	/// </summary>
	/// <param name="currentCulture">The current culture code (e.g., "en", "az") for localization.</param>
	/// <returns>An expression that can be used in Select() statements.</returns>
	public static Expression<Func<PetAd, MyPetAdListItemDto>> ToMyListItemDto(string currentCulture)
	{
		return p => new MyPetAdListItemDto
		{
			Id = p.Id,
			Title = p.Title,
			AgeInMonths = p.AgeInMonths,
			Gender = p.Gender,
			AdType = p.AdType,
			Price = p.Price,
			PublishedAt = p.PublishedAt ?? p.CreatedAt,
			IsPremium = p.IsPremium,
			IsVip = p.IsVip,
			RejectionReason = p.RejectionReason,
			// Get category title either from direct Category relation or from Breed's Category
			CategoryTitle = p.Category != null
				? p.Category.Localizations.Where(l => l.AppLocale.Code == currentCulture || l.AppLocale.IsDefault)
					.OrderByDescending(l => l.AppLocale.Code == currentCulture)
					.Select(l => l.Title)
					.FirstOrDefault() ?? ""
				: p.Breed != null
					? p.Breed.Category.Localizations.Where(l => l.AppLocale.Code == currentCulture || l.AppLocale.IsDefault)
						.OrderByDescending(l => l.AppLocale.Code == currentCulture)
						.Select(l => l.Title)
						.FirstOrDefault() ?? ""
					: "",
			BreedTitle = p.Breed != null
				? p.Breed.Localizations.Where(l => l.AppLocale.Code == currentCulture || l.AppLocale.IsDefault)
					.OrderByDescending(l => l.AppLocale.Code == currentCulture)
					.Select(l => l.Title)
					.FirstOrDefault() ?? ""
				: "",
			BreedId = p.PetBreedId,
			// Use direct PetCategoryId if available, otherwise fallback to Breed's Category
			CategoryId = p.PetCategoryId ?? (p.Breed != null ? p.Breed.Category.Id : (int?)null),
			CategorySlug = p.Category != null
				? p.Category.Localizations.Where(l => l.AppLocale.Code == currentCulture || l.AppLocale.IsDefault)
					.OrderByDescending(l => l.AppLocale.Code == currentCulture)
					.Select(l => l.Slug)
					.FirstOrDefault() ?? ""
				: p.Breed != null
					? p.Breed.Category.Localizations.Where(l => l.AppLocale.Code == currentCulture || l.AppLocale.IsDefault)
						.OrderByDescending(l => l.AppLocale.Code == currentCulture)
						.Select(l => l.Slug)
						.FirstOrDefault() ?? ""
					: "",
			BreedSlug = p.Breed != null
				? p.Breed.Localizations.Where(l => l.AppLocale.Code == currentCulture || l.AppLocale.IsDefault)
					.OrderByDescending(l => l.AppLocale.Code == currentCulture)
					.Select(l => l.Slug)
					.FirstOrDefault() ?? ""
				: "",
			CityId = p.CityId,
			CityName = currentCulture == "ru" ? p.City.NameRu : currentCulture == "en" ? p.City.NameEn : p.City.NameAz,
			DistrictId = p.DistrictId,
			DistrictName = p.District != null
				? (currentCulture == "ru" ? p.District.NameRu : currentCulture == "en" ? p.District.NameEn : p.District.NameAz)
				: null,
			PrimaryImageUrl =
				p.Images.Where(i => i.IsPrimary).Select(i => i.FilePath).FirstOrDefault()
				?? p.Images.OrderBy(i => i.Id).Select(i => i.FilePath).FirstOrDefault()
				?? "",
			Size = p.Size,
			Color = p.Color ?? "",
			SuggestedBreedName = p.SuggestedBreedName,
			CustomDistrictName = p.CustomDistrictName,
			CreatedAt = p.CreatedAt,
			ExpiresAt = p.ExpiresAt,
			ViewCount = p.ViewCount,
			Status = p.Status,
			Images = p.Images.OrderByDescending(i => i.IsPrimary).ThenBy(i => i.Id).Select(i => new PetAdImageDto
			{
				Id = i.Id,
				Url = i.FilePath,
				IsPrimary = i.IsPrimary,
			}).ToList(),
		};
	}
}
