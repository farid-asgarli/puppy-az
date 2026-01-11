namespace PetWebsite.Application.Features.PetAds;

/// <summary>
/// Summary of questions for ads owned by the user.
/// </summary>
public class MyAdsQuestionsSummaryDto
{
	/// <summary>
	/// Total number of questions across all user's ads.
	/// </summary>
	public int TotalQuestions { get; init; }

	/// <summary>
	/// Number of unanswered questions.
	/// </summary>
	public int UnansweredQuestions { get; init; }

	/// <summary>
	/// Number of ads with unanswered questions.
	/// </summary>
	public int AdsWithUnansweredQuestions { get; init; }

	/// <summary>
	/// Most recent unanswered question timestamp.
	/// </summary>
	public DateTime? LatestUnansweredQuestionAt { get; init; }
}
