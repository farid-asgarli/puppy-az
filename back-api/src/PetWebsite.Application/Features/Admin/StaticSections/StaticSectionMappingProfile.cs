using AutoMapper;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Features.Admin.StaticSections;

public class StaticSectionMappingProfile : Profile
{
	public StaticSectionMappingProfile()
	{
		CreateMap<StaticSection, StaticSectionDto>()
			.ForMember(
				dest => dest.Localizations,
				opt => opt.MapFrom(src => src.Localizations)
			);

		CreateMap<StaticSectionLocalization, StaticSectionLocalizationDto>()
			.ForMember(dest => dest.LocaleCode, opt => opt.MapFrom(src => src.AppLocale.Code));

		CreateMap<StaticSection, StaticSectionListItemDto>()
			.ForMember(
				dest => dest.TitleAz,
				opt =>
					opt.MapFrom(src =>
						src.Localizations
							.Where(l => l.AppLocale.Code == "az")
							.Select(l => l.Title)
							.FirstOrDefault() ?? ""
					)
			)
			.ForMember(
				dest => dest.TitleEn,
				opt =>
					opt.MapFrom(src =>
						src.Localizations
							.Where(l => l.AppLocale.Code == "en")
							.Select(l => l.Title)
							.FirstOrDefault() ?? ""
					)
			)
			.ForMember(
				dest => dest.TitleRu,
				opt =>
					opt.MapFrom(src =>
						src.Localizations
							.Where(l => l.AppLocale.Code == "ru")
							.Select(l => l.Title)
							.FirstOrDefault() ?? ""
					)
			);
	}
}
