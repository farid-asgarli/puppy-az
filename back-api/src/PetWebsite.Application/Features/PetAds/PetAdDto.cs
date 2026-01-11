using System.Text.Json.Serialization;
using PetWebsite.Domain.Enums;

namespace PetWebsite.Application.Features.PetAds;

public class PetCategoryDto
{
	public int Id { get; init; }
	public string Title { get; init; } = string.Empty;
	public string Subtitle { get; init; } = string.Empty;
}

public class PetCategoryDetailedDto : PetCategoryDto
{
	public string SvgIcon { get; init; } = string.Empty;
	public string IconColor { get; init; } = string.Empty;
	public string BackgroundColor { get; init; } = string.Empty;
	public int PetAdsCount { get; init; }
}

public class PetBreedDto
{
	public int Id { get; init; }
	public string Title { get; init; } = string.Empty;
	public int CategoryId { get; init; }
}

public class PetAdOwnerDto
{
	public Guid Id { get; init; }
	public string FullName { get; init; } = string.Empty;
	public string? ProfilePictureUrl { get; set; }
	public DateTime MemberSince { get; init; }
	public string? ContactPhoneNumber { get; init; } = string.Empty;
	public string? ContactEmail { get; init; } = string.Empty;
}

public class PetAdDetailsDto
{
	public int Id { get; init; }
	public string Title { get; init; } = string.Empty;
	public string Description { get; init; } = string.Empty;
	public int AgeInMonths { get; init; }
	public PetGender Gender { get; init; }
	public PetAdType AdType { get; init; }
	public string Color { get; init; } = string.Empty;
	public decimal? Weight { get; init; }
	public PetSize? Size { get; init; }
	public decimal? Price { get; init; }
	public int ViewCount { get; set; }
	public bool IsPremium { get; init; }
	public DateTime? PremiumExpiresAt { get; init; }
	public DateTime PublishedAt { get; init; }
	public DateTime? UpdatedAt { get; init; }
	public DateTime? ExpiresAt { get; init; }
	public PetBreedDto Breed { get; init; } = null!;
	public string CityName { get; init; } = string.Empty;
	public int CityId { get; init; }
	public string CategoryTitle { get; init; } = string.Empty;
	public PetAdOwnerDto? Owner { get; init; }
	public List<PetAdImageDto> Images { get; init; } = [];
	public List<PetAdQuestionDto> Questions { get; init; } = [];
}

public class PetAdListItemDto
{
	public int Id { get; init; }
	public string Title { get; init; } = string.Empty;
	public int AgeInMonths { get; init; }
	public PetGender Gender { get; init; }
	public PetAdType AdType { get; init; }

	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public PetSize? Size { get; init; }

	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public decimal? Price { get; init; }
	public string CityName { get; init; } = string.Empty;
	public string CategoryTitle { get; init; } = string.Empty;
	public int CategoryId { get; init; }
	public int BreedId { get; init; }
	public int CityId { get; init; }

	// Keep as 'set' because it's modified after projection for URL conversion
	public string PrimaryImageUrl { get; set; } = string.Empty;

	public DateTime PublishedAt { get; init; }
	public bool IsPremium { get; init; }

	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public string? RejectionReason { get; init; }
}

public class MyPetAdListItemDto : PetAdListItemDto
{
	public PetAdStatus Status { get; init; }
	public int ViewCount { get; init; }
	public DateTime CreatedAt { get; init; }
}

public class CategoryWithAdsDto : PetCategoryDetailedDto
{
	public List<PetAdListItemDto> PetAds { get; init; } = [];
}
