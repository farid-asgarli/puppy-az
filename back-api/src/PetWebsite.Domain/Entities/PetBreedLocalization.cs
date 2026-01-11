using PetWebsite.Domain.Common;

namespace PetWebsite.Domain.Entities;

/// <summary>
/// Represents localized content for a pet breed.
/// </summary>
public class PetBreedLocalization : Localization
{
	/// <summary>
	/// Gets or sets the pet breed ID.
	/// </summary>
	public int PetBreedId { get; set; }

	/// <summary>
	/// Gets or sets the localized title.
	/// </summary>
	public string Title { get; set; } = string.Empty;

	/// <summary>
	/// Navigation property to the pet breed.
	/// </summary>
	public PetBreed PetBreed { get; set; } = null!;
}
