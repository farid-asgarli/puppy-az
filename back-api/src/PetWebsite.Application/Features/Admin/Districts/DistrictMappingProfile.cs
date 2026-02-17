using AutoMapper;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Features.Admin.Districts;

/// <summary>
/// AutoMapper profile for District entity mappings.
/// </summary>
public class DistrictMappingProfile : Profile
{
	public DistrictMappingProfile()
	{
		// District -> DistrictDto
		CreateMap<District, DistrictDto>()
			.ForMember(dest => dest.CityNameAz, opt => opt.MapFrom(src => src.City.NameAz));

		// District -> DistrictListItemDto
		CreateMap<District, DistrictListItemDto>()
			.ForMember(dest => dest.CityNameAz, opt => opt.MapFrom(src => src.City.NameAz))
			.ForMember(dest => dest.PetAdsCount, opt => opt.MapFrom(src => src.PetAds.Count));
	}
}
