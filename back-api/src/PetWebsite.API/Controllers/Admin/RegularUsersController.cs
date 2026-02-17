using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using PetWebsite.API.Constants;
using PetWebsite.API.Controllers.Base;
using PetWebsite.API.Extensions;
using PetWebsite.Application.Features.Admin.RegularUsers.Commands.CreateRegularUser;
using PetWebsite.Application.Features.Admin.RegularUsers.Queries.GetAllRegularUsers;

namespace PetWebsite.API.Controllers.Admin;

/// <summary>
/// Controller for managing regular users (consumers) from admin panel.
/// </summary>
[Route("api/admin/regular-users")]
[Authorize(Roles = $"{AuthorizationConstants.Roles.SuperAdmin},{AuthorizationConstants.Roles.Admin}")]
public class RegularUsersController(IMediator mediator, IStringLocalizer<RegularUsersController> localizer)
    : AdminBaseController(mediator, localizer)
{
    /// <summary>
    /// Get all regular users with pagination.
    /// </summary>
    /// <param name="page">Page number (default: 1)</param>
    /// <param name="pageSize">Page size (default: 10)</param>
    /// <param name="search">Search term for filtering</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Paginated list of regular users</returns>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetAllRegularUsers(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? search = null,
        CancellationToken cancellationToken = default)
    {
        var query = new GetAllRegularUsersQuery(page, pageSize, search);
        var result = await Mediator.Send(query, cancellationToken);
        return result.ToActionResult();
    }

    /// <summary>
    /// Create a new regular user (consumer) by admin.
    /// </summary>
    /// <param name="command">User creation details</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Created user ID</returns>
    /// <response code="201">User created successfully</response>
    /// <response code="400">Invalid request or user already exists</response>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateRegularUser(
        CreateRegularUserCommand command,
        CancellationToken cancellationToken)
    {
        var result = await Mediator.Send(command, cancellationToken);

        if (result.IsSuccess)
            return CreatedAtAction(nameof(GetAllRegularUsers), new { }, new { id = result.Data });

        return result.ToActionResult();
    }
}
