using AutoMapper;
using Microsoft.EntityFrameworkCore;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.PetBreeds.Queries.GetPetBreedById;

public class GetPetBreedByIdQueryHandler(IApplicationDbContext dbContext, ICurrentUserService currentUserService, IMapper mapper)
	: IQueryHandler<GetPetBreedByIdQuery, Result<PetBreedDto>>
{
	public async Task<Result<PetBreedDto>> Handle(GetPetBreedByIdQuery request, CancellationToken ct)
	{
		var currentCulture = currentUserService.CurrentCulture;

		var breed = await dbContext
			.PetBreeds.Include(b => b.Localizations)
			.ThenInclude(l => l.AppLocale)
			.Include(b => b.Category)
			.ThenInclude(c => c.Localizations)
			.ThenInclude(l => l.AppLocale)
			.AsNoTracking()
			.FirstOrDefaultAsync(b => b.Id == request.Id, ct);

		if (breed == null)
			return Result<PetBreedDto>.NotFound("Pet breed not found");

		var breedLocalization =
			breed.Localizations.FirstOrDefault(l => l.AppLocale.Code == currentCulture)
			?? breed.Localizations.FirstOrDefault(l => l.AppLocale.IsDefault);

		var categoryLocalization =
			breed.Category.Localizations.FirstOrDefault(l => l.AppLocale.Code == currentCulture)
			?? breed.Category.Localizations.FirstOrDefault(l => l.AppLocale.IsDefault);

		// Map using AutoMapper with context
		var dto = mapper.Map<PetBreedDto>(
			breed,
			opts =>
			{
				opts.Items["CurrentLocalization"] = breedLocalization;
				opts.Items["CategoryTitle"] = categoryLocalization?.Title ?? "";
			}
		);

		return Result<PetBreedDto>.Success(dto);
	}
}
