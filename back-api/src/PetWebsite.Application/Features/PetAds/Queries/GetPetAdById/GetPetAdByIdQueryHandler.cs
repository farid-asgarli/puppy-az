using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Extensions;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Entities;
using PetWebsite.Domain.Enums;

namespace PetWebsite.Application.Features.PetAds.Queries.GetPetAdById;

public class GetPetAdByIdQueryHandler(
	IApplicationDbContext dbContext,
	ICurrentUserService currentUserService,
	IUrlService urlService,
	IStringLocalizer localizer
) : BaseHandler(localizer), IQueryHandler<GetPetAdByIdQuery, Result<PetAdDetailsDto>>
{
	public async Task<Result<PetAdDetailsDto>> Handle(GetPetAdByIdQuery request, CancellationToken ct)
	{
		var currentCulture = currentUserService.CurrentCulture;

		var dto = await dbContext
			.PetAds.WhereNotDeleted<PetAd, int>()
			.AsNoTracking()
			.Where(p => p.Id == request.Id && p.Status == PetAdStatus.Published)
			.Select(p => new PetAdDetailsDto
			{
				Id = p.Id,
				Title = p.Title,
				Description = p.Description,
				AgeInMonths = p.AgeInMonths,
				Gender = p.Gender,
				AdType = p.AdType,
				Color = p.Color,
				Weight = p.Weight,
				Size = p.Size,
				Price = p.Price,
				ViewCount = p.ViewCount,
				IsPremium = p.IsPremium,
				PremiumExpiresAt = p.PremiumExpiresAt,
				PublishedAt = p.PublishedAt ?? DateTime.UtcNow,
				UpdatedAt = p.UpdatedAt,
				ExpiresAt = p.ExpiresAt,
				Breed = new PetBreedDto
				{
					Id = p.Breed.Id,
					Title =
						p.Breed.Localizations.Where(l => l.AppLocale.Code == currentCulture || l.AppLocale.IsDefault)
							.OrderByDescending(l => l.AppLocale.Code == currentCulture)
							.Select(l => l.Title)
							.FirstOrDefault() ?? "",
					CategoryId = p.Breed.Category.Id,
				},
				CityName = p.City.Name,
				CityId = p.City.Id,
				CategoryTitle =
					p.Breed.Category.Localizations.Where(l => l.AppLocale.Code == currentCulture || l.AppLocale.IsDefault)
						.OrderByDescending(l => l.AppLocale.Code == currentCulture)
						.Select(l => l.Title)
						.FirstOrDefault() ?? "",
				Owner =
					p.User != null
						? new PetAdOwnerDto
						{
							Id = p.User.Id,
							FullName = p.User.FirstName + " " + p.User.LastName,
							ProfilePictureUrl = p.User.ProfilePictureUrl,
							MemberSince = p.User.CreatedAt,
							ContactEmail = p.User.Email,
							ContactPhoneNumber = p.User.PhoneNumber,
						}
						: null,
				Images = p
					.Images.OrderBy(i => i.Id)
					.Select(i => new PetAdImageDto
					{
						Id = i.Id,
						Url = "/" + i.FilePath,
						IsPrimary = i.IsPrimary,
					})
					.ToList(),
				Questions = p
					.Questions.Where(q => !q.IsDeleted)
					.OrderByDescending(q => q.CreatedAt)
					.Select(q => new PetAdQuestionDto
					{
						Id = q.Id,
						Question = q.Question,
						Answer = q.Answer,
						QuestionerName = q.User.FirstName + " " + q.User.LastName,
						AskedAt = q.CreatedAt,
						AnsweredAt = q.AnsweredAt,
					})
					.ToList(),
			})
			.FirstOrDefaultAsync(ct);

		if (dto == null)
			return Result<PetAdDetailsDto>.Failure(L(LocalizationKeys.PetAd.NotFound), 404);

		// Convert relative image URLs to absolute URLs
		foreach (var image in dto.Images)
		{
			image.Url = urlService.ToAbsoluteUrl(image.Url);
		}

		// Convert owner's profile picture URL to absolute URL
		if (dto.Owner != null)
		{
			dto.Owner.ProfilePictureUrl = urlService.ToAbsoluteUrl(dto.Owner.ProfilePictureUrl);
		}

		// Increment view count without triggering UpdatedAt via interceptor
		await dbContext
			.PetAds.Where(p => p.Id == request.Id)
			.ExecuteUpdateAsync(setters => setters.SetProperty(p => p.ViewCount, p => p.ViewCount + 1), ct);

		dto.ViewCount++;

		return Result<PetAdDetailsDto>.Success(dto);
	}
}
