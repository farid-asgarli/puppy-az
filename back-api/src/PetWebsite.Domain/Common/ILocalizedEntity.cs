namespace PetWebsite.Domain.Common;

/// <summary>
/// Interface for entities that support localization.
/// </summary>
/// <typeparam name="TLocalization">The type of localization entity.</typeparam>
public interface ILocalizedEntity<TLocalization>
	where TLocalization : Localization
{
	/// <summary>
	/// Gets or sets the collection of localizations for this entity.
	/// </summary>
	ICollection<TLocalization> Localizations { get; set; }
}
