namespace PetWebsite.Application.Features.PetAds;

/// <summary>
/// DTO representing a question on the ad owner's advertisements.
/// Includes ad information for context.
/// </summary>
public class MyAdQuestionDto
{
	public int QuestionId { get; init; }
	public int PetAdId { get; init; }
	public string PetAdTitle { get; init; } = null!;
	public string Question { get; init; } = null!;
	public string? Answer { get; init; }
	public string QuestionerName { get; init; } = null!;
	public DateTime AskedAt { get; init; }
	public DateTime? AnsweredAt { get; init; }
	public bool IsAnswered => Answer != null;
	public string? PrimaryImageUrl { get; init; }
}
