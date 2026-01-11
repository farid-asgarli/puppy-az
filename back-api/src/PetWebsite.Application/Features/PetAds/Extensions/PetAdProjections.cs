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
			PublishedAt = p.CreatedAt,
			IsPremium = p.IsPremium,
			RejectionReason = p.RejectionReason,
			CategoryTitle =
				p.Breed.Category.Localizations.Where(l => l.AppLocale.Code == currentCulture || l.AppLocale.IsDefault)
					.OrderByDescending(l => l.AppLocale.Code == currentCulture)
					.Select(l => l.Title)
					.FirstOrDefault() ?? "",
			BreedId = p.PetBreedId,
			CategoryId = p.Breed.Category.Id,
			CityId = p.CityId,
			CityName = p.City.Name,
			PrimaryImageUrl =
				"/"
				+ (
					p.Images.Where(i => i.IsPrimary).Select(i => i.FilePath).FirstOrDefault()
					?? p.Images.OrderBy(i => i.Id).Select(i => i.FilePath).FirstOrDefault()
					?? ""
				),
			Size = p.Size,
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
			PublishedAt = p.CreatedAt,
			IsPremium = p.IsPremium,
			RejectionReason = p.RejectionReason,
			CategoryTitle =
				p.Breed.Category.Localizations.Where(l => l.AppLocale.Code == currentCulture || l.AppLocale.IsDefault)
					.OrderByDescending(l => l.AppLocale.Code == currentCulture)
					.Select(l => l.Title)
					.FirstOrDefault() ?? "",
			BreedId = p.PetBreedId,
			CategoryId = p.Breed.Category.Id,
			CityId = p.CityId,
			CityName = p.City.Name,
			PrimaryImageUrl =
				"/"
				+ (
					p.Images.Where(i => i.IsPrimary).Select(i => i.FilePath).FirstOrDefault()
					?? p.Images.OrderBy(i => i.Id).Select(i => i.FilePath).FirstOrDefault()
					?? ""
				),
			Size = p.Size,
			CreatedAt = p.CreatedAt,
			ViewCount = p.ViewCount,
			Status = p.Status,
		};
	}
}
