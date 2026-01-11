using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using PetWebsite.API.Controllers.Base;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Exceptions;

namespace PetWebsite.API.Controllers.Files;

/// <summary>
/// Controller for file upload, download, and management operations.
/// </summary>
public class FilesController(
	IMediator mediator,
	IStringLocalizer<FilesController> localizer,
	IFileService fileService,
	ILogger<FilesController> logger
) : BaseApiController(mediator, localizer)
{
	private readonly IFileService _fileService = fileService;
	private readonly ILogger<FilesController> _logger = logger;

	/// <summary>
	/// Uploads a file to the server.
	/// </summary>
	[HttpPost("upload")]
	[RequestSizeLimit(10 * 1024 * 1024)] // 10 MB limit
	public async Task<IActionResult> UploadFile(
		IFormFile file,
		[FromQuery] string? subfolder = null,
		CancellationToken cancellationToken = default
	)
	{
		if (file == null || file.Length == 0)
		{
			var message = Localizer[LocalizationKeys.File.FileNameCannotBeEmpty];
			return BadRequest(new { error = message.Value });
		}

		try
		{
			await using var stream = file.OpenReadStream();
			var metadata = await _fileService.SaveFileAsync(stream, file.FileName, subfolder, cancellationToken);

			var successMessage = Localizer[LocalizationKeys.File.UploadSuccess];
			return Created(string.Empty, new { message = successMessage.Value, data = metadata });
		}
		catch (FileException ex)
		{
			_logger.LogWarning(ex, "File upload failed: {Message}", ex.Message);
			return BadRequest(new { error = ex.Message });
		}
	}

	/// <summary>
	/// Downloads a file from the server.
	/// </summary>
	[HttpGet("download")]
	public async Task<IActionResult> DownloadFile([FromQuery] string path, CancellationToken cancellationToken = default)
	{
		if (string.IsNullOrWhiteSpace(path))
		{
			var message = Localizer[LocalizationKeys.File.InvalidPath];
			return BadRequest(new { error = message.Value });
		}

		try
		{
			var stream = await _fileService.GetFileAsync(path, cancellationToken);
			var metadata = await _fileService.GetFileMetadataAsync(path, cancellationToken);

			return File(stream, metadata.ContentType, metadata.FileName);
		}
		catch (FileException ex)
		{
			_logger.LogWarning(ex, "File download failed: {Message}", ex.Message);
			return ex.LocalizationKey == LocalizationKeys.File.FileNotFound
				? NotFound(new { error = ex.Message })
				: BadRequest(new { error = ex.Message });
		}
	}

	/// <summary>
	/// Deletes a file from the server.
	/// </summary>
	[HttpDelete]
	public async Task<IActionResult> DeleteFile([FromQuery] string path, CancellationToken cancellationToken = default)
	{
		if (string.IsNullOrWhiteSpace(path))
		{
			var message = Localizer[LocalizationKeys.File.InvalidPath];
			return BadRequest(new { error = message.Value });
		}

		try
		{
			await _fileService.DeleteFileAsync(path, cancellationToken);

			var successMessage = Localizer[LocalizationKeys.File.DeleteSuccess];
			return Ok(new { message = successMessage.Value });
		}
		catch (FileException ex)
		{
			_logger.LogWarning(ex, "File deletion failed: {Message}", ex.Message);
			return ex.LocalizationKey == LocalizationKeys.File.FileNotFound
				? NotFound(new { error = ex.Message })
				: BadRequest(new { error = ex.Message });
		}
	}

	/// <summary>
	/// Gets metadata for a file.
	/// </summary>
	[HttpGet("metadata")]
	public async Task<IActionResult> GetFileMetadata([FromQuery] string path, CancellationToken cancellationToken = default)
	{
		if (string.IsNullOrWhiteSpace(path))
		{
			var message = Localizer[LocalizationKeys.File.InvalidPath];
			return BadRequest(new { error = message.Value });
		}

		try
		{
			var metadata = await _fileService.GetFileMetadataAsync(path, cancellationToken);
			return Ok(metadata);
		}
		catch (FileException ex)
		{
			_logger.LogWarning(ex, "Failed to get file metadata: {Message}", ex.Message);
			return ex.LocalizationKey == LocalizationKeys.File.FileNotFound
				? NotFound(new { error = ex.Message })
				: BadRequest(new { error = ex.Message });
		}
	}

	/// <summary>
	/// Verifies the integrity of a file using checksum.
	/// </summary>
	[HttpPost("verify")]
	public async Task<IActionResult> VerifyFileIntegrity(
		[FromQuery] string path,
		[FromQuery] string checksum,
		[FromQuery] string algorithm = "SHA256",
		CancellationToken cancellationToken = default
	)
	{
		if (string.IsNullOrWhiteSpace(path))
		{
			var message = Localizer[LocalizationKeys.File.InvalidPath];
			return BadRequest(new { error = message.Value });
		}

		if (string.IsNullOrWhiteSpace(checksum))
		{
			var message = Localizer[LocalizationKeys.Validation.Required];
			return BadRequest(new { error = message.Value });
		}

		try
		{
			var isValid = await _fileService.VerifyFileIntegrityAsync(path, checksum, algorithm, cancellationToken);

			return Ok(
				new
				{
					isValid,
					message = isValid
						? Localizer[LocalizationKeys.Success.OperationCompleted].Value
						: Localizer[LocalizationKeys.File.ChecksumMismatch].Value,
				}
			);
		}
		catch (FileException ex)
		{
			_logger.LogWarning(ex, "File integrity verification failed: {Message}", ex.Message);
			return ex.LocalizationKey == LocalizationKeys.File.FileNotFound
				? NotFound(new { error = ex.Message })
				: BadRequest(new { error = ex.Message });
		}
	}
}
