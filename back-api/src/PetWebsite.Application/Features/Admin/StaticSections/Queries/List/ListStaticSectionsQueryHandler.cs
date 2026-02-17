using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;

namespace PetWebsite.Application.Features.Admin.StaticSections.Queries.List;

public class ListStaticSectionsQueryHandler(
	IApplicationDbContext dbContext,
	IMapper mapper,
	IStringLocalizer localizer
) : BaseHandler(localizer), IQueryHandler<ListStaticSectionsQuery, List<StaticSectionListItemDto>>
{
	public async Task<List<StaticSectionListItemDto>> Handle(
		ListStaticSectionsQuery request,
		CancellationToken ct
	)
	{
		return await dbContext
			.StaticSections.Include(s => s.Localizations)
			.ThenInclude(l => l.AppLocale)
			.OrderBy(s => s.Key)
			.ProjectTo<StaticSectionListItemDto>(mapper.ConfigurationProvider)
			.ToListAsync(ct);
	}
}
