using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.RegularUsers.Queries.GetAllRegularUsers;

/// <summary>
/// Query to get all regular users with pagination.
/// </summary>
public record GetAllRegularUsersQuery(int Page = 1, int PageSize = 10, string? Search = null) 
    : IQuery<Result<PaginatedResult<RegularUserDto>>>;
