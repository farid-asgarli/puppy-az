using AutoMapper;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Features.Admin.PetBreeds;

/// <summary>
/// AutoMapper profile for PetBreed entity mappings.
/// </summary>
public class PetBreedMappingProfile : Profile
{
	public PetBreedMappingProfile()
	{
		// PetBreedLocalization -> PetBreedLocalizationDto
		CreateMap<PetBreedLocalization, PetBreedLocalizationDto>()
			.ForMember(dest => dest.LocaleCode, opt => opt.MapFrom(src => src.AppLocale.Code));

		// PetBreed -> PetBreedDto (with current localization and category context)
		CreateMap<PetBreed, PetBreedDto>()
			.ForMember(dest => dest.Title, opt => opt.MapFrom<PetBreedTitleResolver>())
			.ForMember(dest => dest.CategoryTitle, opt => opt.MapFrom<PetBreedCategoryTitleResolver>())
			.ForMember(dest => dest.Localizations, opt => opt.MapFrom(src => src.Localizations));

		// PetBreed -> PetBreedListItemDto (with current localization and category context)
		CreateMap<PetBreed, PetBreedListItemDto>()
			.ForMember(dest => dest.Title, opt => opt.MapFrom<PetBreedTitleResolver>())
			.ForMember(dest => dest.CategoryTitle, opt => opt.MapFrom<PetBreedCategoryTitleResolver>())
			.ForMember(dest => dest.PetAdsCount, opt => opt.MapFrom(src => src.PetAds.Count));
	}
}

/// <summary>
/// Custom value resolver for PetBreed title from current localization context.
/// </summary>
public class PetBreedTitleResolver : IValueResolver<PetBreed, object, string>
{
	public string Resolve(PetBreed source, object destination, string destMember, ResolutionContext context)
	{
		if (context.Items.TryGetValue("CurrentLocalization", out var locObj) && locObj is PetBreedLocalization localization)
		{
			return localization.Title;
		}
		return string.Empty;
	}
}

/// <summary>
/// Custom value resolver for PetBreed category title from context.
/// </summary>
public class PetBreedCategoryTitleResolver : IValueResolver<PetBreed, object, string>
{
	public string Resolve(PetBreed source, object destination, string destMember, ResolutionContext context)
	{
		if (context.Items.TryGetValue("CategoryTitle", out var titleObj) && titleObj is string title)
		{
			return title;
		}
		return string.Empty;
	}
}
