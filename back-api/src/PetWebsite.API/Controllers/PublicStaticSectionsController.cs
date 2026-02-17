using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using PetWebsite.API.Controllers.Base;
using PetWebsite.Application.Features.Admin.StaticSections;
using PetWebsite.Application.Features.Admin.StaticSections.Queries.GetByKey;

namespace PetWebsite.API.Controllers;

/// <summary>
/// Controller for retrieving static content sections from public website.
/// </summary>
[Route("api/static-sections")]
public class PublicStaticSectionsController(IMediator mediator, IStringLocalizer<PublicStaticSectionsController> localizer)
	: BaseApiController(mediator, localizer)
{
	/// <summary>
	/// Get a static section by key.
	/// </summary>
	[HttpGet("{key}")]
	[AllowAnonymous]
	[ProducesResponseType(typeof(StaticSectionDto), 200)]
	[ProducesResponseType(404)]
	public async Task<IActionResult> GetByKey(string key)
	{
		var result = await Mediator.Send(new GetStaticSectionByKeyQuery(key));

		if (!result.IsSuccess)
			return NotFound(result.Error);

		return Ok(result.Data);
	}
}
