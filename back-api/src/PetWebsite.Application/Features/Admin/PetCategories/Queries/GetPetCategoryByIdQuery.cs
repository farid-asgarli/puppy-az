using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.Admin.PetCategories.Queries;

public record GetPetCategoryByIdQuery(int Id) : IQuery<Result<PetCategoryDto>>;

public class GetPetCategoryByIdQueryHandler(
	IApplicationDbContext dbContext,
	ICurrentUserService currentUserService,
	IStringLocalizer localizer,
	IMapper mapper
) : BaseHandler(localizer), IQueryHandler<GetPetCategoryByIdQuery, Result<PetCategoryDto>>
{
	public async Task<Result<PetCategoryDto>> Handle(GetPetCategoryByIdQuery request, CancellationToken ct)
	{
		var currentCulture = currentUserService.CurrentCulture;

		var category = await dbContext
			.PetCategories.Include(c => c.Localizations)
			.ThenInclude(l => l.AppLocale)
			.AsNoTracking()
			.FirstOrDefaultAsync(c => c.Id == request.Id, ct);

		if (category == null)
			return Result<PetCategoryDto>.NotFound(L(LocalizationKeys.PetCategory.NotFound));

		var currentLocalization =
			category.Localizations.FirstOrDefault(l => l.AppLocale.Code == currentCulture)
			?? category.Localizations.FirstOrDefault(l => l.AppLocale.IsDefault);

		// Map using AutoMapper with current localization in context
		var dto = mapper.Map<PetCategoryDto>(
			category,
			opts =>
			{
				opts.Items["CurrentLocalization"] = currentLocalization;
			}
		);

		return Result<PetCategoryDto>.Success(dto);
	}
}
