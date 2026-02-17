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
		var currentUserId = currentUserService.UserId;

		// Build query - if user is viewing their own ad, don't filter by status
		var query = dbContext
			.PetAds.WhereNotDeleted<PetAd, int>()
			.Include(p => p.Questions)
				.ThenInclude(q => q.User)
			.Include(p => p.Questions)
				.ThenInclude(q => q.Replies)
					.ThenInclude(r => r.User)
			.AsNoTracking()
			.Where(p => p.Id == request.Id);

		// Only filter by Published status if user is NOT the owner
		if (currentUserId.HasValue)
		{
			query = query.Where(p => p.Status == PetAdStatus.Published || p.UserId == currentUserId);
		}
		else
		{
			query = query.Where(p => p.Status == PetAdStatus.Published);
		}

		var dto = await query
			.Select(p => new PetAdDetailsDto
			{
				Id = p.Id,
				Status = p.Status,
				RejectionReason = p.RejectionReason,
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
				Breed = p.Breed != null ? new PetBreedDto
				{
					Id = p.Breed.Id,
					Title =
						p.Breed.Localizations.Where(l => l.AppLocale.Code == currentCulture || l.AppLocale.IsDefault)
							.OrderByDescending(l => l.AppLocale.Code == currentCulture)
							.Select(l => l.Title)
							.FirstOrDefault() ?? "",
					CategoryId = p.Breed.Category.Id,
				} : null,
				CityName = currentCulture == "ru" ? p.City.NameRu : currentCulture == "en" ? p.City.NameEn : p.City.NameAz,
				CityId = p.City.Id,
				DistrictId = p.DistrictId,
				DistrictName = p.District != null
					? (currentCulture == "ru" ? p.District.NameRu : currentCulture == "en" ? p.District.NameEn : p.District.NameAz)
					: null,
				CustomDistrictName = p.CustomDistrictName,
				CategoryTitle = p.Breed != null
					? p.Breed.Category.Localizations.Where(l => l.AppLocale.Code == currentCulture || l.AppLocale.IsDefault)
						.OrderByDescending(l => l.AppLocale.Code == currentCulture)
						.Select(l => l.Title)
						.FirstOrDefault() ?? ""
					: "",
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
						Url = i.FilePath.StartsWith("http://") || i.FilePath.StartsWith("https://") 
							? i.FilePath 
							: (i.FilePath.StartsWith("/") ? i.FilePath : "/" + i.FilePath),
						IsPrimary = i.IsPrimary,
					})
					.ToList(),
				Questions = p
					.Questions.Where(q => !q.IsDeleted)
					.OrderByDescending(q => q.CreatedAt)
					.Select(q => new PetAdQuestionDto
					{
						Id = q.Id,
						UserId = q.UserId,
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
								UserId = r.UserId,
								Text = r.Text,
								UserName = r.User.FirstName + " " + r.User.LastName,
								IsOwnerReply = r.IsOwnerReply,
								CreatedAt = r.CreatedAt
							})
							.ToList()
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

		return Result<PetAdDetailsDto>.Success(dto);
	}
}
