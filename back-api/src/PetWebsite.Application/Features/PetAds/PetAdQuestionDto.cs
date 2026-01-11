namespace PetWebsite.Application.Features.PetAds;

/// <summary>
/// DTO representing a question and answer on a pet advertisement.
/// </summary>
public class PetAdQuestionDto
{
	public int Id { get; init; }
	public string Question { get; init; } = null!;
	public string? Answer { get; init; }
	public string QuestionerName { get; init; } = null!;
	public DateTime AskedAt { get; init; }
	public DateTime? AnsweredAt { get; init; }
	public bool IsAnswered => Answer != null;
}
