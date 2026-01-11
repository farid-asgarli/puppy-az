using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Options;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;
using PetWebsite.Infrastructure.Configuration;

namespace PetWebsite.Infrastructure.Services.Files;

/// <summary>
/// Implementation of file validation service.
/// </summary>
public class FileValidator : IFileValidator
{
	private readonly HashSet<string> _allowedExtensions;
	private readonly long _maxFileSize;
	private readonly IStringLocalizer _localizer;

	public FileValidator(IOptions<FileStorageOptions> options, IStringLocalizer localizer)
	{
		_localizer = localizer;
		var settings = options.Value;
		_maxFileSize = settings.MaxFileSize;
		_allowedExtensions = new HashSet<string>(settings.AllowedExtensions, StringComparer.OrdinalIgnoreCase);
	}

	public ValidationResult ValidateFile(Stream stream, string fileName)
	{
		// Validate file name
		if (string.IsNullOrWhiteSpace(fileName))
		{
			var message = _localizer[LocalizationKeys.File.FileNameCannotBeEmpty];
			return ValidationResult.Failure(LocalizationKeys.File.FileNameCannotBeEmpty, message);
		}

		// Get extension
		var extension = Path.GetExtension(fileName).ToLowerInvariant();

		// Validate file extension
		if (!IsExtensionAllowed(extension))
		{
			var message = _localizer[LocalizationKeys.File.FileExtensionNotAllowed, extension];
			return ValidationResult.Failure(LocalizationKeys.File.FileExtensionNotAllowed, message);
		}

		// Check file size
		if (stream.Length > _maxFileSize)
		{
			var maxSizeMB = _maxFileSize / 1024 / 1024;
			var message = _localizer[LocalizationKeys.File.FileSizeExceedsLimit, maxSizeMB];
			return ValidationResult.Failure(LocalizationKeys.File.FileSizeExceedsLimit, message);
		}

		return ValidationResult.Success();
	}

	public bool IsExtensionAllowed(string extension)
	{
		return _allowedExtensions.Contains(extension);
	}

	public string SanitizeFileName(string fileName)
	{
		if (string.IsNullOrWhiteSpace(fileName))
		{
			return string.Empty;
		}

		// Get just the filename without any path information to prevent directory traversal
		return Path.GetFileName(fileName);
	}

	public string SanitizePath(string path)
	{
		if (string.IsNullOrWhiteSpace(path))
		{
			return string.Empty;
		}

		// Remove any potentially dangerous characters
		var invalidChars = Path.GetInvalidPathChars().Concat([':', '*', '?', '"', '<', '>', '|']);
		var sanitized = string.Join("", path.Split([.. invalidChars]));

		// Normalize path separators and remove any ".." components
		return sanitized
			.Replace("/", Path.DirectorySeparatorChar.ToString())
			.Replace("\\", Path.DirectorySeparatorChar.ToString())
			.Split(Path.DirectorySeparatorChar, StringSplitOptions.RemoveEmptyEntries)
			.Where(part => part != "..")
			.Aggregate("", Path.Combine);
	}
}
