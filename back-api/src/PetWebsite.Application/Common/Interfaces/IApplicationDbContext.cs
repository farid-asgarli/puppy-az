using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Common.Interfaces;

/// <summary>
/// Defines the contract for the application's database context.
/// This interface allows the Application layer to interact with the database
/// without depending on the concrete Infrastructure implementation.
/// </summary>
public interface IApplicationDbContext
{
	/// <summary>
	/// Gets the DbSet for AppLocale entities.
	/// </summary>
	DbSet<AppLocale> AppLocales { get; }

	/// <summary>
	/// Gets the DbSet for PetCategory entities.
	/// </summary>
	DbSet<PetCategory> PetCategories { get; }

	/// <summary>
	/// Gets the DbSet for PetCategoryLocalization entities.
	/// </summary>
	DbSet<PetCategoryLocalization> PetCategoryLocalizations { get; }

	/// <summary>
	/// Gets the DbSet for PetBreed entities.
	/// </summary>
	DbSet<PetBreed> PetBreeds { get; }

	/// <summary>
	/// Gets the DbSet for PetBreedLocalization entities.
	/// </summary>
	DbSet<PetBreedLocalization> PetBreedLocalizations { get; }

	/// <summary>
	/// Gets the DbSet for City entities.
	/// </summary>
	DbSet<City> Cities { get; }

	/// <summary>
	/// Gets the DbSet for PetAd entities.
	/// </summary>
	DbSet<PetAd> PetAds { get; }

	/// <summary>
	/// Gets the DbSet for PetAdImage entities.
	/// </summary>
	DbSet<PetAdImage> PetAdImages { get; }

	/// <summary>
	/// Gets the DbSet for PetAdView entities.
	/// </summary>
	DbSet<PetAdView> PetAdViews { get; }

	/// <summary>
	/// Gets the DbSet for FavoriteAd entities.
	/// </summary>
	DbSet<FavoriteAd> FavoriteAds { get; }

	/// <summary>
	/// Gets the DbSet for PetAdQuestion entities.
	/// </summary>
	DbSet<PetAdQuestion> PetAdQuestions { get; }

	/// <summary>
	/// Gets the DbSet for BlacklistedToken entities.
	/// </summary>
	DbSet<BlacklistedToken> BlacklistedTokens { get; }

	/// <summary>
	/// Gets the DbSet for SmsVerificationCode entities.
	/// </summary>
	DbSet<SmsVerificationCode> SmsVerificationCodes { get; }

	/// <summary>
	/// Gets the DbSet for RegularUser entities.
	/// </summary>
	DbSet<User> RegularUsers { get; }

	/// <summary>
	/// Provides access to database-related information and operations.
	/// </summary>
	DatabaseFacade Database { get; }

	/// <summary>
	/// Saves all changes made in this context to the database.
	/// </summary>
	/// <param name="cancellationToken">A cancellation token to observe while waiting for the task to complete.</param>
	/// <returns>The number of state entries written to the database.</returns>
	Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
