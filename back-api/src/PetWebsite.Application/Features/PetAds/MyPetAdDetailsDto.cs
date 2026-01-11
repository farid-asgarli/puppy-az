using System.Text.Json.Serialization;
using PetWebsite.Domain.Enums;

namespace PetWebsite.Application.Features.PetAds;

/// <summary>
/// DTO for pet ad details as seen by the owner (includes status, rejection reason, etc.)
/// </summary>
public class MyPetAdDetailsDto
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
	public DateTime CreatedAt { get; init; }
	public DateTime? UpdatedAt { get; init; }
	public DateTime? PublishedAt { get; init; }
	public DateTime? ExpiresAt { get; init; }

	// Owner-specific fields
	public PetAdStatus Status { get; init; }

	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public string? RejectionReason { get; init; }

	public bool IsAvailable { get; init; }

	// Related data
	public PetBreedDto Breed { get; init; } = null!;
	public string CityName { get; init; } = string.Empty;
	public int CityId { get; init; }
	public string CategoryTitle { get; init; } = string.Empty;
	public List<PetAdImageDto> Images { get; init; } = [];
	public List<PetAdQuestionDto> Questions { get; init; } = [];

	// Statistics
	public int TotalQuestions { get; init; }
	public int UnansweredQuestions { get; init; }
	public int FavoriteCount { get; init; }
}
