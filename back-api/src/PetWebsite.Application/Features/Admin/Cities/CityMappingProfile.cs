using AutoMapper;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Features.Admin.Cities;

/// <summary>
/// AutoMapper profile for City entity mappings.
/// </summary>
public class CityMappingProfile : Profile
{
	public CityMappingProfile()
	{
		// City -> CityDto
		CreateMap<City, CityDto>();

		// City -> CityListItemDto
		CreateMap<City, CityListItemDto>()
			.ForMember(dest => dest.PetAdsCount, opt => opt.MapFrom(src => src.PetAds.Count));
	}
}
