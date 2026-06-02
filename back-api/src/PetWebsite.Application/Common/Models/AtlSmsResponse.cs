using System.Text.Json.Serialization;

namespace PetWebsite.Application.Common.Models;

/// <summary>
/// Response model from ATL SMS JSON API.
/// </summary>
public class AtlSmsResponse
{
	/// <summary>
	/// Response message from the API.
	/// </summary>
	[JsonPropertyName("message")]
	public string? Message { get; set; }

	/// <summary>
	/// Transaction ID returned on successful send.
	/// </summary>
	[JsonPropertyName("transId")]
	public string? TransId { get; set; }

	/// <summary>
	/// Error code returned on failure (null on success).
	/// </summary>
	[JsonPropertyName("error_code")]
	public int? ErrorCode { get; set; }
}
