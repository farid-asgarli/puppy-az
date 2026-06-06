using System.Linq;

namespace PetWebsite.Domain.Helpers;

/// <summary>
/// Helper for normalizing Azerbaijani phone numbers to a single canonical storage format.
/// Canonical format is the 9-digit national number without country code or leading zero
/// (e.g. "501234567"). This keeps admin-created users, self-registration and SMS login
/// lookups consistent so an account can always be matched regardless of input formatting.
/// </summary>
public static class PhoneNumberHelper
{
	/// <summary>
	/// Normalizes a phone number to the canonical 9-digit national format.
	/// Strips spaces, dashes, parentheses, a leading "+", the "994" country code and a leading "0".
	/// Returns the input's digits unchanged when it does not look like an Azerbaijani number.
	/// </summary>
	/// <param name="phoneNumber">The raw phone number in any common format.</param>
	/// <returns>The canonical phone number, or the original value when it is null/empty.</returns>
	public static string? Normalize(string? phoneNumber)
	{
		if (string.IsNullOrWhiteSpace(phoneNumber))
		{
			return phoneNumber;
		}

		// Keep digits only.
		var digits = new string(phoneNumber.Where(char.IsDigit).ToArray());

		if (digits.Length == 0)
		{
			return digits;
		}

		// Strip the Azerbaijani country code "994" when present (e.g. 994501234567).
		if (digits.Length == 12 && digits.StartsWith("994"))
		{
			digits = digits[3..];
		}

		// Strip a single leading zero from the national format (e.g. 0501234567).
		if (digits.Length == 10 && digits.StartsWith("0"))
		{
			digits = digits[1..];
		}

		return digits;
	}

	/// <summary>
	/// Builds the set of equivalent phone-number formats for a given input so that
	/// lookups can still match records persisted before normalization was introduced
	/// (e.g. "+994501234567", "994501234567", "0501234567").
	/// </summary>
	/// <param name="phoneNumber">The raw phone number in any common format.</param>
	/// <returns>Distinct candidate representations of the phone number.</returns>
	public static string[] GetLookupCandidates(string? phoneNumber)
	{
		var normalized = Normalize(phoneNumber);

		if (string.IsNullOrWhiteSpace(normalized))
		{
			return string.IsNullOrWhiteSpace(phoneNumber) ? [] : [phoneNumber!];
		}

		return new[]
		{
			normalized,
			$"+994{normalized}",
			$"994{normalized}",
			$"0{normalized}",
		}
		.Distinct()
		.ToArray();
	}
}
