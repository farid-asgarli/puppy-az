using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Extensions;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Features.PetAds.Queries.GetMyPetAdById;

public class GetMyPetAdByIdQueryHandler(
	IApplicationDbContext dbContext,
	ICurrentUserService currentUserService,
	IUrlService urlService,
	IStringLocalizer localizer
) : BaseHandler(localizer), IQueryHandler<GetMyPetAdByIdQuery, Result<MyPetAdDetailsDto>>
{
	public async Task<Result<MyPetAdDetailsDto>> Handle(GetMyPetAdByIdQuery request, CancellationToken ct)
	{
		// Get current user ID
		var userId = currentUserService.UserId;
		if (userId is null)
			return Result<MyPetAdDetailsDto>.Failure(L(LocalizationKeys.Error.Unauthorized), 401);

		var currentCulture = currentUserService.CurrentCulture;

		// Query the ad - must belong to current user
		var dto = await dbContext
			.PetAds.WhereNotDeleted<PetAd, int>()
			.AsNoTracking()
			.Where(p => p.Id == request.Id && p.UserId == userId.Value)
			.Select(p => new MyPetAdDetailsDto
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
				CreatedAt = p.CreatedAt,
				UpdatedAt = p.UpdatedAt,
				PublishedAt = p.PublishedAt,
				ExpiresAt = p.ExpiresAt,
				Status = p.Status,
				RejectionReason = p.RejectionReason,
				IsAvailable = p.IsAvailable,
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
				CityName = currentCulture == "ru" ? p.City.NameRu : currentCulture == "en" ? p.City.NameEn : p.City.NameAz,
				CityId = p.City.Id,
				CategoryTitle =
					p.Breed.Category.Localizations.Where(l => l.AppLocale.Code == currentCulture || l.AppLocale.IsDefault)
						.OrderByDescending(l => l.AppLocale.Code == currentCulture)
						.Select(l => l.Title)
						.FirstOrDefault() ?? "",
				Images = p
					.Images.OrderBy(i => i.Id)
					.Select(i => new PetAdImageDto
					{
						Id = i.Id,
						Url = i.FilePath.StartsWith("/") ? i.FilePath : "/" + i.FilePath,
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
						Replies = q.Replies
							.Where(r => !r.IsDeleted)
							.OrderBy(r => r.CreatedAt)
							.Select(r => new PetAdQuestionReplyDto
							{
								Id = r.Id,
								Text = r.Text,
								UserName = r.User.FirstName + " " + r.User.LastName,
								IsOwnerReply = r.IsOwnerReply,
								CreatedAt = r.CreatedAt,
							})
							.ToList(),
					})
					.ToList(),
				TotalQuestions = p.Questions.Count(q => !q.IsDeleted),
				UnansweredQuestions = p.Questions.Count(q => !q.IsDeleted && q.Answer == null),
			})
			.FirstOrDefaultAsync(ct);

		if (dto == null)
			return Result<MyPetAdDetailsDto>.Failure(L(LocalizationKeys.PetAd.NotFound), 404);

		// Convert relative image URLs to absolute URLs
		foreach (var image in dto.Images)
		{
			image.Url = urlService.ToAbsoluteUrl(image.Url);
		}

		return Result<MyPetAdDetailsDto>.Success(dto);
	}
}
