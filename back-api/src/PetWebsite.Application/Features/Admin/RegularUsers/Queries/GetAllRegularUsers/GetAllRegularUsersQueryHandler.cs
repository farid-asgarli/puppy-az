using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Enums;

namespace PetWebsite.Application.Features.Admin.RegularUsers.Queries.GetAllRegularUsers;

/// <summary>
/// Handler for getting all regular users with pagination.
/// </summary>
public class GetAllRegularUsersQueryHandler(
    IApplicationDbContext dbContext,
    IStringLocalizer localizer
) : BaseHandler(localizer), IQueryHandler<GetAllRegularUsersQuery, Result<PaginatedResult<RegularUserDto>>>
{
    public async Task<Result<PaginatedResult<RegularUserDto>>> Handle(
        GetAllRegularUsersQuery request, 
        CancellationToken cancellationToken)
    {
        var query = dbContext.RegularUsers.AsQueryable();

        // Apply search filter
        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var searchLower = request.Search.ToLower();
            query = query.Where(u => 
                (u.FirstName != null && u.FirstName.ToLower().Contains(searchLower)) ||
                (u.LastName != null && u.LastName.ToLower().Contains(searchLower)) ||
                (u.Email != null && u.Email.ToLower().Contains(searchLower)) ||
                (u.PhoneNumber != null && u.PhoneNumber.Contains(searchLower))
            );
        }

        var totalCount = await query.CountAsync(cancellationToken);

        var users = await query
            .OrderByDescending(u => u.CreatedAt)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(u => new RegularUserDto
            {
                Id = u.Id,
                UserName = u.UserName,
                Email = u.Email,
                FirstName = u.FirstName,
                LastName = u.LastName,
                PhoneNumber = u.PhoneNumber,
                ProfilePictureUrl = u.ProfilePictureUrl,
                IsActive = u.IsActive,
                IsCreatedByAdmin = u.IsCreatedByAdmin,
                CreatedAt = u.CreatedAt,
                LastLoginAt = u.LastLoginAt,
                TotalAds = u.PetAds.Count(a => !a.IsDeleted),
                ActiveAds = u.PetAds.Count(a => !a.IsDeleted && a.Status == PetAdStatus.Published)
            })
            .ToListAsync(cancellationToken);

        var result = new PaginatedResult<RegularUserDto>
        {
            Items = users,
            TotalCount = totalCount,
            PageNumber = request.Page,
            PageSize = request.PageSize
        };

        return Result<PaginatedResult<RegularUserDto>>.Success(result);
    }
}
