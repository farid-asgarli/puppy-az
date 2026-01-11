namespace PetWebsite.Application.Common.Models;

/// <summary>
/// Represents the result of a validation operation.
/// </summary>
public class ValidationResult
{
	public bool IsValid { get; init; }
	public string? ErrorKey { get; init; }
	public string? ErrorMessage { get; init; }

	public static ValidationResult Success() => new() { IsValid = true };

	public static ValidationResult Failure(string errorKey, string errorMessage) =>
		new()
		{
			IsValid = false,
			ErrorKey = errorKey,
			ErrorMessage = errorMessage,
		};
}
