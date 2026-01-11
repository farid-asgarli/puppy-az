using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Exceptions;
using PetWebsite.Infrastructure.Configuration;

namespace PetWebsite.Infrastructure.Services.Files;

/// <summary>
/// Service for managing file operations following clean architecture principles.
/// Delegates responsibilities to specialized services for better separation of concerns.
/// </summary>
public class FileService : IFileService
{
	private readonly string _rootPath;
	private readonly ILogger<FileService> _logger;
	private readonly IStringLocalizer _localizer;
	private readonly IFileValidator _fileValidator;
	private readonly IFileSystemWrapper _fileSystem;
	private readonly IChecksumService _checksumService;
	private readonly IContentTypeProvider _contentTypeProvider;
	private readonly string _defaultChecksumAlgorithm;

	public FileService(
		ILogger<FileService> logger,
		IStringLocalizer localizer,
		IOptions<FileStorageOptions> options,
		IFileValidator fileValidator,
		IFileSystemWrapper fileSystem,
		IChecksumService checksumService,
		IContentTypeProvider contentTypeProvider
	)
	{
		_logger = logger;
		_localizer = localizer;
		_fileValidator = fileValidator;
		_fileSystem = fileSystem;
		_checksumService = checksumService;
		_contentTypeProvider = contentTypeProvider;

		var settings = options.Value;
		_rootPath = Path.GetFullPath(Path.Combine(Directory.GetCurrentDirectory(), settings.RootPath));
		_defaultChecksumAlgorithm = settings.ChecksumAlgorithm;

		// Ensure root directory exists
		if (!_fileSystem.DirectoryExists(_rootPath))
		{
			_fileSystem.CreateDirectory(_rootPath);
			_logger.LogInformation("Created file storage directory at {Path}", _rootPath);
		}
	}

	public async Task<FileMetadata> SaveFileAsync(
		Stream stream,
		string fileName,
		string? subfolder = null,
		CancellationToken cancellationToken = default
	)
	{
		ArgumentNullException.ThrowIfNull(stream);
		ArgumentNullException.ThrowIfNull(fileName);

		try
		{
			// Validate file
			var validationResult = _fileValidator.ValidateFile(stream, fileName);
			if (!validationResult.IsValid)
			{
				throw new FileException(validationResult.ErrorKey!, validationResult.ErrorMessage!);
			}

			// Sanitize filename to prevent directory traversal attacks
			fileName = _fileValidator.SanitizeFileName(fileName);
			var extension = Path.GetExtension(fileName).ToLowerInvariant();

			// Generate unique filename to avoid conflicts
			var uniqueFileName = $"{Guid.NewGuid()}_{fileName}";
			var targetDirectory = string.IsNullOrWhiteSpace(subfolder)
				? _rootPath
				: _fileSystem.CombinePaths(_rootPath, _fileValidator.SanitizePath(subfolder));

			// Ensure target directory exists
			if (!_fileSystem.DirectoryExists(targetDirectory))
			{
				_fileSystem.CreateDirectory(targetDirectory);
			}

			var fullPath = _fileSystem.CombinePaths(targetDirectory, uniqueFileName);
			var relativePath = Path.GetRelativePath(_rootPath, fullPath);

			// Save file to disk
			await using (var fileStream = _fileSystem.CreateFile(fullPath))
			{
				stream.Position = 0; // Reset stream position
				await stream.CopyToAsync(fileStream, cancellationToken);
			}

			// Calculate checksum
			stream.Position = 0;
			var checksum = await _checksumService.CalculateChecksumAsync(stream, _defaultChecksumAlgorithm, cancellationToken);

			var metadata = new FileMetadata
			{
				FileName = fileName,
				ContentType = _contentTypeProvider.GetContentType(extension),
				Size = stream.Length,
				Extension = extension,
				RelativePath = relativePath.Replace("\\", "/"),
				Checksum = checksum,
				ChecksumAlgorithm = _defaultChecksumAlgorithm,
				UploadedAt = DateTime.UtcNow,
			};

			_logger.LogInformation("File saved successfully: {FileName} at {Path}", fileName, relativePath);

			return metadata;
		}
		catch (FileException)
		{
			throw;
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Error saving file: {FileName}", fileName);
			var message = _localizer[LocalizationKeys.File.FailedToSaveFile, ex.Message];
			throw new FileException(LocalizationKeys.File.FailedToSaveFile, message, ex);
		}
	}

	public Task<Stream> GetFileAsync(string relativePath, CancellationToken cancellationToken = default)
	{
		ArgumentException.ThrowIfNullOrWhiteSpace(relativePath);

		try
		{
			var fullPath = GetPhysicalPath(relativePath);

			if (!_fileSystem.FileExists(fullPath))
			{
				var message = _localizer[LocalizationKeys.File.FileNotFound, relativePath];
				throw new FileException(LocalizationKeys.File.FileNotFound, message);
			}

			var fileStream = _fileSystem.OpenRead(fullPath);

			_logger.LogInformation("File retrieved: {Path}", relativePath);

			return Task.FromResult(fileStream);
		}
		catch (FileException)
		{
			throw;
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Error retrieving file: {Path}", relativePath);
			var message = _localizer[LocalizationKeys.File.FailedToRetrieveFile, ex.Message];
			throw new FileException(LocalizationKeys.File.FailedToRetrieveFile, message, ex);
		}
	}

	public Task DeleteFileAsync(string relativePath, CancellationToken cancellationToken = default)
	{
		ArgumentException.ThrowIfNullOrWhiteSpace(relativePath);

		try
		{
			var fullPath = GetPhysicalPath(relativePath);

			if (!_fileSystem.FileExists(fullPath))
			{
				var message = _localizer[LocalizationKeys.File.FileNotFound, relativePath];
				throw new FileException(LocalizationKeys.File.FileNotFound, message);
			}

			// Delete the file
			_fileSystem.DeleteFile(fullPath);

			_logger.LogInformation("File deleted: {Path}", relativePath);

			return Task.CompletedTask;
		}
		catch (FileException)
		{
			throw;
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Error deleting file: {Path}", relativePath);
			var message = _localizer[LocalizationKeys.File.FailedToDeleteFile, ex.Message];
			throw new FileException(LocalizationKeys.File.FailedToDeleteFile, message, ex);
		}
	}

	public bool FileExists(string relativePath)
	{
		if (string.IsNullOrWhiteSpace(relativePath))
		{
			return false;
		}

		try
		{
			var fullPath = GetPhysicalPath(relativePath);
			return _fileSystem.FileExists(fullPath);
		}
		catch
		{
			return false;
		}
	}

	public Task<string> CalculateChecksumAsync(Stream stream, string algorithm = "SHA256", CancellationToken cancellationToken = default)
	{
		return _checksumService.CalculateChecksumAsync(stream, algorithm, cancellationToken);
	}

	public async Task<bool> VerifyFileIntegrityAsync(
		string relativePath,
		string expectedChecksum,
		string algorithm = "SHA256",
		CancellationToken cancellationToken = default
	)
	{
		ArgumentException.ThrowIfNullOrWhiteSpace(relativePath);
		ArgumentException.ThrowIfNullOrWhiteSpace(expectedChecksum);

		try
		{
			var fullPath = GetPhysicalPath(relativePath);

			if (!_fileSystem.FileExists(fullPath))
			{
				var message = _localizer[LocalizationKeys.File.FileNotFound, relativePath];
				throw new FileException(LocalizationKeys.File.FileNotFound, message);
			}

			await using var stream = _fileSystem.OpenRead(fullPath);
			var actualChecksum = await _checksumService.CalculateChecksumAsync(stream, algorithm, cancellationToken);

			var isValid = _checksumService.VerifyChecksum(actualChecksum, expectedChecksum);

			if (!isValid)
			{
				_logger.LogWarning(
					"Checksum mismatch for {Path}. Expected: {Expected}, Actual: {Actual}",
					relativePath,
					expectedChecksum,
					actualChecksum
				);
			}

			return isValid;
		}
		catch (FileException)
		{
			throw;
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Error verifying file integrity: {Path}", relativePath);
			var message = _localizer[LocalizationKeys.File.FailedToVerifyFileIntegrity, ex.Message];
			throw new FileException(LocalizationKeys.File.FailedToVerifyFileIntegrity, message, ex);
		}
	}

	public async Task<FileMetadata> GetFileMetadataAsync(string relativePath, CancellationToken cancellationToken = default)
	{
		ArgumentException.ThrowIfNullOrWhiteSpace(relativePath);

		try
		{
			var fullPath = GetPhysicalPath(relativePath);

			if (!_fileSystem.FileExists(fullPath))
			{
				var message = _localizer[LocalizationKeys.File.FileNotFound, relativePath];
				throw new FileException(LocalizationKeys.File.FileNotFound, message);
			}

			var fileInfo = _fileSystem.GetFileInfo(fullPath);

			string checksum;
			await using (var stream = _fileSystem.OpenRead(fullPath))
			{
				checksum = await _checksumService.CalculateChecksumAsync(stream, _defaultChecksumAlgorithm, cancellationToken);
			}

			var metadata = new FileMetadata
			{
				FileName = fileInfo.Name,
				ContentType = _contentTypeProvider.GetContentType(fileInfo.Extension),
				Size = fileInfo.Length,
				Extension = fileInfo.Extension,
				RelativePath = relativePath.Replace("\\", "/"),
				Checksum = checksum,
				ChecksumAlgorithm = _defaultChecksumAlgorithm,
				UploadedAt = fileInfo.CreationTimeUtc,
			};

			return metadata;
		}
		catch (FileException)
		{
			throw;
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Error getting file metadata: {Path}", relativePath);
			var message = _localizer[LocalizationKeys.File.FailedToGetFileMetadata, ex.Message];
			throw new FileException(LocalizationKeys.File.FailedToGetFileMetadata, message, ex);
		}
	}

	public string GetPhysicalPath(string relativePath)
	{
		ArgumentException.ThrowIfNullOrWhiteSpace(relativePath);

		try
		{
			// Sanitize and normalize the path
			var sanitizedPath = _fileValidator.SanitizePath(relativePath);
			var fullPath = _fileSystem.GetFullPath(_fileSystem.CombinePaths(_rootPath, sanitizedPath));

			// Ensure the path is within the root directory (prevent directory traversal)
			if (!fullPath.StartsWith(_rootPath, StringComparison.OrdinalIgnoreCase))
			{
				var message = _localizer[LocalizationKeys.File.AccessToPathDenied];
				throw new FileException(LocalizationKeys.File.AccessToPathDenied, message);
			}

			return fullPath;
		}
		catch (FileException)
		{
			throw;
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Error getting physical path for: {Path}", relativePath);
			var message = _localizer[LocalizationKeys.File.FailedToResolvePath, ex.Message];
			throw new FileException(LocalizationKeys.File.FailedToResolvePath, message, ex);
		}
	}
}
