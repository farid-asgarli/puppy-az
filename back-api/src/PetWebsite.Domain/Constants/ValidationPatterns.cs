namespace PetWebsite.Domain.Constants;

/// <summary>
/// Contains centralized validation patterns and regex constants.
/// </summary>
public static class ValidationPatterns
{
	/// <summary>
	/// Valid Azerbaijani mobile operator codes.
	/// Azercell: 050, 051, 055, 070, 077
	/// Bakcell: 010, 099
	/// Nar Mobile: 060, 065
	/// </summary>
	public static readonly string[] AzerbaijaniOperatorCodes = ["010", "050", "051", "055", "060", "065", "070", "077", "099"];

	/// <summary>
	/// Regex pattern for Azerbaijani phone numbers.
	/// Accepts formats: 0XXXXXXXXX (10 digits) or XXXXXXXXX (9 digits)
	/// where XXX is a valid operator code.
	/// Examples: 0501234567, 501234567, 0101234567, 101234567
	/// </summary>
	public const string AzerbaijaniPhoneNumber = @"^0?(10|50|51|55|60|65|70|77|99)\d{7}$";

	/// <summary>
	/// Regex pattern for flexible phone numbers (for contact fields).
	/// Allows digits, spaces, plus signs, dashes, and parentheses.
	/// </summary>
	public const string FlexiblePhoneNumber = @"^[\d\s\+\-\(\)]+$";

	/// <summary>
	/// Regex pattern for 6-digit verification codes.
	/// </summary>
	public const string VerificationCode = @"^\d{6}$";

	/// <summary>
	/// Regex pattern for email addresses (basic validation).
	/// </summary>
	public const string Email = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";
}
