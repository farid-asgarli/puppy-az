using System.ComponentModel.DataAnnotations.Schema;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Domain.Common;

/// <summary>
/// Abstract base class for localized content.
/// </summary>
public abstract class Localization : BaseEntity
{
	/// <summary>
	/// Gets or sets the application locale ID.
	/// </summary>
	public int AppLocaleId { get; set; }

	/// <summary>
	/// Navigation property to the application locale.
	/// </summary>
	[ForeignKey(nameof(AppLocaleId))]
	public AppLocale AppLocale { get; set; } = null!;
}
