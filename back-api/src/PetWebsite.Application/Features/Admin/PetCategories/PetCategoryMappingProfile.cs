using AutoMapper;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Features.Admin.PetCategories;

/// <summary>
/// AutoMapper profile for PetCategory entity mappings.
/// </summary>
public class PetCategoryMappingProfile : Profile
{
	public PetCategoryMappingProfile()
	{
		// PetCategoryLocalization -> PetCategoryLocalizationDto
		CreateMap<PetCategoryLocalization, PetCategoryLocalizationDto>()
			.ForMember(dest => dest.LocaleCode, opt => opt.MapFrom(src => src.AppLocale.Code));

		// PetCategory -> PetCategoryDto (with current localization context)
		CreateMap<PetCategory, PetCategoryDto>()
			.ForMember(dest => dest.Title, opt => opt.MapFrom<PetCategoryTitleResolver>())
			.ForMember(dest => dest.Subtitle, opt => opt.MapFrom<PetCategorySubtitleResolver>())
			.ForMember(dest => dest.Localizations, opt => opt.MapFrom(src => src.Localizations));

		// PetCategory -> PetCategoryListItemDto (with current localization context)
		CreateMap<PetCategory, PetCategoryListItemDto>()
			.ForMember(dest => dest.Title, opt => opt.MapFrom<PetCategoryTitleResolver>())
			.ForMember(dest => dest.Subtitle, opt => opt.MapFrom<PetCategorySubtitleResolver>())
			.ForMember(dest => dest.BreedsCount, opt => opt.MapFrom(src => src.Breeds.Count(b => !b.IsDeleted)));
	}
}

/// <summary>
/// Custom value resolver for PetCategory title from current localization context.
/// </summary>
public class PetCategoryTitleResolver : IValueResolver<PetCategory, object, string>
{
	public string Resolve(PetCategory source, object destination, string destMember, ResolutionContext context)
	{
		if (context.Items.TryGetValue("CurrentLocalization", out var locObj) && locObj is PetCategoryLocalization localization)
		{
			return localization.Title;
		}
		return string.Empty;
	}
}

/// <summary>
/// Custom value resolver for PetCategory subtitle from current localization context.
/// </summary>
public class PetCategorySubtitleResolver : IValueResolver<PetCategory, object, string>
{
	public string Resolve(PetCategory source, object destination, string destMember, ResolutionContext context)
	{
		if (context.Items.TryGetValue("CurrentLocalization", out var locObj) && locObj is PetCategoryLocalization localization)
		{
			return localization.Subtitle;
		}
		return string.Empty;
	}
}
