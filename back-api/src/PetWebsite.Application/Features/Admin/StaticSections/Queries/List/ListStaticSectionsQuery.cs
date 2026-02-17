using PetWebsite.Application.Common.Interfaces;

namespace PetWebsite.Application.Features.Admin.StaticSections.Queries.List;

public record ListStaticSectionsQuery() : IQuery<List<StaticSectionListItemDto>>;
