namespace PetWebsite.Application.Common.Interfaces;

/// <summary>
/// Service for calculating and verifying file checksums.
/// </summary>
public interface IChecksumService
{
	/// <summary>
	/// Calculates the checksum of a stream.
	/// </summary>
	/// <param name="stream">The stream to calculate checksum for.</param>
	/// <param name="algorithm">The hash algorithm to use (MD5, SHA256, SHA512).</param>
	/// <param name="cancellationToken">Cancellation token.</param>
	/// <returns>The checksum as a hexadecimal string.</returns>
	Task<string> CalculateChecksumAsync(Stream stream, string algorithm = "SHA256", CancellationToken cancellationToken = default);

	/// <summary>
	/// Verifies if a checksum matches the expected value.
	/// </summary>
	/// <param name="actualChecksum">The actual checksum.</param>
	/// <param name="expectedChecksum">The expected checksum.</param>
	/// <returns>True if checksums match.</returns>
	bool VerifyChecksum(string actualChecksum, string expectedChecksum);
}
