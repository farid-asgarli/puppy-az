using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.Admin.StaticSections.Queries.GetById;

public class GetStaticSectionByIdQueryHandler(
	IApplicationDbContext dbContext,
	IMapper mapper,
	IStringLocalizer localizer
) : BaseHandler(localizer), IQueryHandler<GetStaticSectionByIdQuery, Result<StaticSectionDto>>
{
	public async Task<Result<StaticSectionDto>> Handle(
		GetStaticSectionByIdQuery request,
		CancellationToken ct
	)
	{
		var section = await dbContext
			.StaticSections.Include(s => s.Localizations)
			.ThenInclude(l => l.AppLocale)
			.Where(s => s.Id == request.Id)
			.ProjectTo<StaticSectionDto>(mapper.ConfigurationProvider)
			.FirstOrDefaultAsync(ct);

		return section is null
			? Result<StaticSectionDto>.Failure(L(LocalizationKeys.StaticSection.NotFound), 404)
			: Result<StaticSectionDto>.Success(section);
	}
}
