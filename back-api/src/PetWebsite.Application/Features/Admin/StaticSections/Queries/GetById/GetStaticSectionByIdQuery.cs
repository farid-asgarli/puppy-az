using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.StaticSections.Queries.GetById;

public record GetStaticSectionByIdQuery(int Id) : IQuery<Result<StaticSectionDto>>;
