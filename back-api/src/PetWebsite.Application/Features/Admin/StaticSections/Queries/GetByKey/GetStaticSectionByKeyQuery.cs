using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.StaticSections.Queries.GetByKey;

public record GetStaticSectionByKeyQuery(string Key) : IQuery<Result<StaticSectionDto>>;
