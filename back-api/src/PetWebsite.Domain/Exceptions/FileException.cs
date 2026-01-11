namespace PetWebsite.Domain.Exceptions;

/// <summary>
/// Exception thrown when file operations fail.
/// </summary>
public class FileException : Exception
{
	/// <summary>
	/// The localization key for the error message.
	/// </summary>
	public string LocalizationKey { get; }

	public FileException(string localizationKey, string message)
		: base(message)
	{
		LocalizationKey = localizationKey;
	}

	public FileException(string localizationKey, string message, Exception innerException)
		: base(message, innerException)
	{
		LocalizationKey = localizationKey;
	}
}
