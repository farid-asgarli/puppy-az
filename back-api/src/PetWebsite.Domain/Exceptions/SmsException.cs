namespace PetWebsite.Domain.Exceptions;

/// <summary>
/// Exception thrown when SMS operations fail.
/// </summary>
public class SmsException : Exception
{
	/// <summary>
	/// The localization key for the error message.
	/// </summary>
	public string LocalizationKey { get; }

	public SmsException(string localizationKey, string message)
		: base(message)
	{
		LocalizationKey = localizationKey;
	}

	public SmsException(string localizationKey, string message, Exception innerException)
		: base(message, innerException)
	{
		LocalizationKey = localizationKey;
	}
}
