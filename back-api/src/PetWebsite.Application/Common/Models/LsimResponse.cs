namespace PetWebsite.Application.Common.Models;

/// <summary>
/// Response model from LSIM SMS provider API.
/// </summary>
public class LsimResponse
{
	/// <summary>
	/// Response data containing the balance or result.
	/// </summary>
	public LsimResponseData? Data { get; set; }
}

/// <summary>
/// Data object within LSIM response.
/// </summary>
public class LsimResponseData
{
	/// <summary>
	/// The object value (typically balance amount).
	/// </summary>
	public decimal Obj { get; set; }
}
