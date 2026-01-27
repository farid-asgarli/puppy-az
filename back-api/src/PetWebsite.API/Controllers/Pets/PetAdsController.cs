using Common.Repository.Filtering;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using PetWebsite.API.Controllers.Base;
using PetWebsite.API.Extensions;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Features.PetAds;
using PetWebsite.Application.Features.PetAds.Commands.AnswerQuestion;
using PetWebsite.Application.Features.PetAds.Commands.AskQuestion;
using PetWebsite.Application.Features.PetAds.Commands.ClosePetAd;
using PetWebsite.Application.Features.PetAds.Commands.DeleteQuestion;
using PetWebsite.Application.Features.PetAds.Commands.IncrementViewCount;
using PetWebsite.Application.Features.PetAds.Commands.RecordPetAdView;
using PetWebsite.Application.Features.PetAds.Commands.ReplyToQuestion;
using PetWebsite.Application.Features.PetAds.Commands.SubmitPetAd;
using PetWebsite.Application.Features.PetAds.Commands.UpdatePetAd;
using PetWebsite.Application.Features.PetAds.Queries.GetPetAdById;
using PetWebsite.Application.Features.PetAds.Queries.GetPetAdQuestions;
using PetWebsite.Application.Features.PetAds.Queries.GetPetAds;
using PetWebsite.Application.Features.PetAds.Queries.GetPetBreeds;
using PetWebsite.Application.Features.PetAds.Queries.GetPetCategories;
using PetWebsite.Application.Features.PetAds.Queries.GetPetCategoriesDetailed;
using PetWebsite.Application.Features.PetAds.Queries.GetPetColors;
using PetWebsite.Application.Features.PetAds.Queries.GetPremiumPetAds;
using PetWebsite.Application.Features.PetAds.Queries.GetRelatedPetAds;
using PetWebsite.Application.Features.PetAds.Queries.GetTopCategoriesWithAds;
using PetWebsite.Domain.Constants;

namespace PetWebsite.API.Controllers.Pets;

/// <summary>
/// Controller for pet advertisement operations.
/// </summary>
[Authorize]
public class PetAdsController(
	IMediator mediator, 
	IStringLocalizer<PetAdsController> localizer,
	ILogger<PetAdsController> logger) : BaseApiController(mediator, localizer)
{
	/// <summary>
	/// Submit a new pet advertisement for review.
	/// </summary>
	/// <param name="command">Pet ad submission details</param>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>The ID of the created pet ad</returns>
	/// <response code="201">Pet ad submitted successfully and is pending review</response>
	/// <response code="400">Invalid request data</response>
	/// <response code="401">User is not authenticated</response>
	/// <response code="404">Pet breed not found or inactive</response>
	[HttpPost]
	[ProducesResponseType(typeof(int), StatusCodes.Status201Created)]
	[ProducesResponseType(StatusCodes.Status400BadRequest)]
	[ProducesResponseType(StatusCodes.Status401Unauthorized)]
	[ProducesResponseType(StatusCodes.Status404NotFound)]
	public async Task<IActionResult> SubmitPetAd(SubmitPetAdCommand command, CancellationToken cancellationToken)
	{
		var result = await Mediator.Send(command, cancellationToken);

		if (result.IsSuccess)
		{
			return CreatedAtAction(
				nameof(GetPetAd),
				new { id = result.Data },
				new { id = result.Data, message = Localizer[LocalizationKeys.PetAd.CreateSuccess] }
			);
		}

		return result.ToActionResult();
	}

	/// <summary>
	/// Get all pet categories.
	/// </summary>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>List of pet categories</returns>
	/// <response code="200">Returns the list of categories</response>
	[HttpGet("categories")]
	[AllowAnonymous]
	[ProducesResponseType(typeof(List<PetCategoryDto>), StatusCodes.Status200OK)]
	public async Task<IActionResult> GetPetCategories(CancellationToken cancellationToken)
	{
		var result = await Mediator.Send(new GetPetCategoriesQuery(), cancellationToken);

		if (result.IsSuccess)
			return Ok(result.Data);

		return result.ToActionResult();
	}

	/// <summary>
	/// Get all pet categories with ad counts.
	/// </summary>
	/// <param name="localeCode">Optional locale code (az, en, ru). If not provided, uses Accept-Language header</param>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>List of detailed pet categories</returns>
	/// <response code="200">Returns the list of categories</response>
	[HttpGet("categories/detailed")]
	[AllowAnonymous]
	[ProducesResponseType(typeof(List<PetCategoryDetailedDto>), StatusCodes.Status200OK)]
	public async Task<IActionResult> GetPetCategoriesDetailed(string? localeCode = null, CancellationToken cancellationToken = default)
	{
		logger.LogDebug("[API] GetPetCategoriesDetailed called. LocaleCode: {LocaleCode}, AcceptLanguage: {AcceptLanguage}", 
			localeCode ?? "null", 
			Request.Headers["Accept-Language"].ToString());
		
		try
		{
			var result = await Mediator.Send(new GetPetCategoriesDetailedQuery(localeCode), cancellationToken);

			logger.LogDebug("[API] GetPetCategoriesDetailed result - IsSuccess: {IsSuccess}, Count: {Count}", 
				result.IsSuccess, 
				result.Data?.Count ?? 0);

			if (result.IsSuccess)
				return Ok(result.Data);

			return result.ToActionResult();
		}
		catch (Exception ex)
		{
			logger.LogError(ex, "[API] GetPetCategoriesDetailed FAILED with exception");
			throw;
		}
	}

	/// <summary>
	/// Get top 10 categories (ordered by pet ads count descending) with their published pet ads.
	/// </summary>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>List of top categories with their pet ads</returns>
	/// <response code="200">Returns the top 10 categories with pet ads</response>
	[HttpGet("categories/top-with-ads")]
	[AllowAnonymous]
	[ProducesResponseType(typeof(List<CategoryWithAdsDto>), StatusCodes.Status200OK)]
	public async Task<IActionResult> GetTopCategoriesWithAds(CancellationToken cancellationToken)
	{
		var result = await Mediator.Send(new GetTopCategoriesWithAdsQuery(), cancellationToken);

		if (result.IsSuccess)
			return Ok(result.Data);

		return result.ToActionResult();
	}

	/// <summary>
	/// Get all pet breeds, optionally filtered by category.
	/// </summary>
	/// <param name="categoryId">Optional pet category ID to filter breeds</param>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>List of pet breeds</returns>
	/// <response code="200">Returns the list of breeds</response>
	[HttpGet("breeds")]
	[AllowAnonymous]
	[ProducesResponseType(typeof(List<PetBreedDto>), StatusCodes.Status200OK)]
	public async Task<IActionResult> GetPetBreeds([FromQuery] int? categoryId, CancellationToken cancellationToken)
	{
		var result = await Mediator.Send(new GetPetBreedsQuery(categoryId), cancellationToken);

		if (result.IsSuccess)
			return Ok(result.Data);

		return result.ToActionResult();
	}

	/// <summary>
	/// Get all pet colors.
	/// </summary>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>List of pet colors with styling information</returns>
	/// <response code="200">Returns the list of colors</response>
	[HttpGet("colors")]
	[AllowAnonymous]
	[ProducesResponseType(typeof(List<PetColorDto>), StatusCodes.Status200OK)]
	public async Task<IActionResult> GetPetColors(CancellationToken cancellationToken)
	{
		var result = await Mediator.Send(new GetPetColorsQuery(), cancellationToken);

		if (result.IsSuccess)
			return Ok(result.Data);

		return result.ToActionResult();
	}

	/// <summary>
	/// Get a paginated and filtered list of pet advertisements.
	/// </summary>
	/// <param name="categoryId">Optional pet category ID to filter by</param>
	/// <param name="breedId">Optional pet breed ID to filter by</param>
	/// <param name="cityId">Optional city ID to filter by</param>
	/// <param name="pageNumber">Page number (default: 1)</param>
	/// <param name="pageSize">Page size (default: 20)</param>
	/// <param name="filter">Optional dynamic filter specification</param>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>Paginated list of pet ads</returns>
	/// <response code="200">Returns the paginated list of pet ads</response>
	[HttpPost("search")]
	[AllowAnonymous]
	[ProducesResponseType(typeof(PaginatedResult<PetAdListItemDto>), StatusCodes.Status200OK)]
	public async Task<IActionResult> GetPetAds([FromBody] GetPetAdsQuery querySpec, CancellationToken cancellationToken = default)
	{
		var result = await Mediator.Send(querySpec, cancellationToken);

		if (result.IsSuccess)
			return Ok(result.Data);

		return result.ToActionResult();
	}

	/// <summary>
	/// Get a paginated and filtered list of premium pet advertisements only.
	/// </summary>
	/// <param name="querySpec">Query specification with filter and pagination options</param>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>Paginated list of premium pet ads</returns>
	/// <response code="200">Returns the paginated list of premium pet ads</response>
	[HttpPost("premium")]
	[AllowAnonymous]
	[ProducesResponseType(typeof(PaginatedResult<PetAdListItemDto>), StatusCodes.Status200OK)]
	public async Task<IActionResult> GetPremiumPetAds(
		[FromBody] GetPremiumPetAdsQuery querySpec,
		CancellationToken cancellationToken = default
	)
	{
		var result = await Mediator.Send(querySpec, cancellationToken);

		if (result.IsSuccess)
			return Ok(result.Data);

		return result.ToActionResult();
	}

	/// <summary>
	/// Get pet advertisement details by ID.
	/// </summary>
	/// <param name="id">Pet ad ID</param>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>Pet ad details</returns>
	/// <response code="200">Returns the pet ad details</response>
	/// <response code="404">Pet ad not found or not published</response>
	[HttpGet("{id:int}")]
	[AllowAnonymous]
	[ProducesResponseType(typeof(PetAdDetailsDto), StatusCodes.Status200OK)]
	[ProducesResponseType(StatusCodes.Status404NotFound)]
	public async Task<IActionResult> GetPetAd(int id, CancellationToken cancellationToken)
	{
		var result = await Mediator.Send(new GetPetAdByIdQuery(id), cancellationToken);

		if (result.IsSuccess)
			return Ok(result.Data);

		return result.ToActionResult();
	}

	/// <summary>
	/// Record that the authenticated user viewed a pet advertisement.
	/// </summary>
	/// <param name="id">Pet ad ID</param>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>Success result</returns>
	/// <response code="200">View recorded successfully</response>
	/// <response code="401">User is not authenticated</response>
	/// <response code="404">Pet ad not found</response>
	[HttpPost("{id:int}/view")]
	[Authorize]
	[ProducesResponseType(StatusCodes.Status200OK)]
	[ProducesResponseType(StatusCodes.Status401Unauthorized)]
	[ProducesResponseType(StatusCodes.Status404NotFound)]
	public async Task<IActionResult> RecordView(int id, CancellationToken cancellationToken)
	{
		var result = await Mediator.Send(new RecordPetAdViewCommand(id), cancellationToken);

		if (result.IsSuccess)
			return Ok(new { message = "View recorded successfully" });

		return result.ToActionResult();
	}

	/// <summary>
	/// Increment view count for a pet advertisement (anonymous access allowed).
	/// </summary>
	/// <param name="id">Pet ad ID</param>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>Success result</returns>
	/// <response code="200">View count incremented successfully</response>
	/// <response code="404">Pet ad not found</response>
	[HttpPost("{id:int}/increment-view")]
	[AllowAnonymous]
	[ProducesResponseType(StatusCodes.Status200OK)]
	[ProducesResponseType(StatusCodes.Status404NotFound)]
	public async Task<IActionResult> IncrementViewCount(int id, CancellationToken cancellationToken)
	{
		var result = await Mediator.Send(new IncrementViewCountCommand(id), cancellationToken);

		if (result.IsSuccess)
			return Ok(new { message = "View count incremented successfully" });

		return result.ToActionResult();
	}

	/// <summary>
	/// Get related pet advertisements based on breed/category.
	/// </summary>
	/// <param name="id">Pet ad ID</param>
	/// <param name="pageNumber">Page number (default: 1)</param>
	/// <param name="pageSize">Page size (default: 10, max: 100)</param>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>Paginated list of related pet ads</returns>
	/// <response code="200">Returns the list of related pet ads</response>
	/// <response code="404">Pet ad not found</response>
	[HttpPost("related")]
	[AllowAnonymous]
	[ProducesResponseType(typeof(PaginatedResult<PetAdListItemDto>), StatusCodes.Status200OK)]
	[ProducesResponseType(StatusCodes.Status404NotFound)]
	public async Task<IActionResult> GetRelatedPetAds([FromBody] GetRelatedPetAdsQuery query, CancellationToken cancellationToken = default)
	{
		var result = await Mediator.Send(query, cancellationToken);

		if (result.IsSuccess)
			return Ok(result.Data);

		return result.ToActionResult();
	}

	/// <summary>
	/// Update an existing pet advertisement (only for rejected or draft ads).
	/// </summary>
	/// <param name="id">Pet ad ID</param>
	/// <param name="command">Updated pet ad details</param>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>No content on success</returns>
	/// <response code="204">Pet ad updated successfully and is pending review</response>
	/// <response code="400">Invalid request data or ad cannot be edited</response>
	/// <response code="401">User is not authenticated</response>
	/// <response code="403">User does not own this ad</response>
	/// <response code="404">Pet ad, breed, or city not found</response>
	[HttpPut("{id:int}")]
	[ProducesResponseType(StatusCodes.Status204NoContent)]
	[ProducesResponseType(StatusCodes.Status400BadRequest)]
	[ProducesResponseType(StatusCodes.Status401Unauthorized)]
	[ProducesResponseType(StatusCodes.Status403Forbidden)]
	[ProducesResponseType(StatusCodes.Status404NotFound)]
	public async Task<IActionResult> UpdatePetAd(int id, UpdatePetAdCommand command, CancellationToken cancellationToken)
	{
		if (id != command.Id)
			return BadRequest("ID mismatch");

		var result = await Mediator.Send(command, cancellationToken);

		if (result.IsSuccess)
			return NoContent();

		return result.ToActionResult();
	}

	/// <summary>
	/// Close a pet advertisement (mark as sold/adopted).
	/// </summary>
	/// <param name="id">Pet ad ID</param>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>No content on success</returns>
	/// <response code="204">Pet ad closed successfully</response>
	/// <response code="400">Ad cannot be closed (must be published)</response>
	/// <response code="401">User is not authenticated</response>
	/// <response code="403">User does not own this ad</response>
	/// <response code="404">Pet ad not found</response>
	[HttpPost("{id:int}/close")]
	[ProducesResponseType(StatusCodes.Status204NoContent)]
	[ProducesResponseType(StatusCodes.Status400BadRequest)]
	[ProducesResponseType(StatusCodes.Status401Unauthorized)]
	[ProducesResponseType(StatusCodes.Status403Forbidden)]
	[ProducesResponseType(StatusCodes.Status404NotFound)]
	public async Task<IActionResult> ClosePetAd(int id, CancellationToken cancellationToken)
	{
		var result = await Mediator.Send(new ClosePetAdCommand(id), cancellationToken);

		if (result.IsSuccess)
			return NoContent();

		return result.ToActionResult();
	}

	/// <summary>
	/// Get all questions and answers for a specific pet advertisement.
	/// </summary>
	/// <param name="id">Pet ad ID</param>
	/// <param name="pagination">Pagination parameters</param>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>List of questions and answers</returns>
	/// <response code="200">Returns the list of Q&amp;A</response>
	/// <response code="404">Pet ad not found</response>
	[HttpGet("{id:int}/questions")]
	[AllowAnonymous]
	[ProducesResponseType(typeof(PaginatedResult<PetAdQuestionDto>), StatusCodes.Status200OK)]
	[ProducesResponseType(StatusCodes.Status404NotFound)]
	public async Task<IActionResult> GetPetAdQuestions(
		int id,
		[FromQuery] PaginationSpecification? pagination,
		CancellationToken cancellationToken
	)
	{
		var result = await Mediator.Send(new GetPetAdQuestionsQuery { PetAdId = id, Pagination = pagination }, cancellationToken);

		if (result.IsSuccess)
			return Ok(result.Data);

		return result.ToActionResult();
	}

	/// <summary>
	/// Ask a question on a pet advertisement.
	/// </summary>
	/// <param name="id">Pet ad ID</param>
	/// <param name="command">Question details</param>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>Success or failure result</returns>
	/// <response code="201">Question posted successfully</response>
	/// <response code="400">Invalid request or cannot ask question on this ad</response>
	/// <response code="401">User is not authenticated</response>
	/// <response code="404">Pet ad not found</response>
	[HttpPost("{id:int}/questions")]
	[ProducesResponseType(StatusCodes.Status201Created)]
	[ProducesResponseType(StatusCodes.Status400BadRequest)]
	[ProducesResponseType(StatusCodes.Status401Unauthorized)]
	[ProducesResponseType(StatusCodes.Status404NotFound)]
	public async Task<IActionResult> AskQuestion(int id, AskQuestionCommand command, CancellationToken cancellationToken)
	{
		// Override the PetAdId from route
		var questionCommand = command with
		{
			PetAdId = id,
		};
		var result = await Mediator.Send(questionCommand, cancellationToken);

		if (result.IsSuccess)
			return CreatedAtAction(
				nameof(GetPetAdQuestions),
				new { id },
				new { message = Localizer[LocalizationKeys.PetAd.QuestionAskedSuccess] }
			);

		return result.ToActionResult();
	}

	/// <summary>
	/// Answer a question on your pet advertisement.
	/// </summary>
	/// <param name="questionId">Question ID</param>
	/// <param name="command">Answer details</param>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>Success or failure result</returns>
	/// <response code="200">Question answered successfully</response>
	/// <response code="400">Question already answered</response>
	/// <response code="401">User is not authenticated</response>
	/// <response code="403">Only the ad owner can answer questions</response>
	/// <response code="404">Question not found</response>
	[HttpPut("questions/{questionId:int}/answer")]
	[ProducesResponseType(StatusCodes.Status200OK)]
	[ProducesResponseType(StatusCodes.Status400BadRequest)]
	[ProducesResponseType(StatusCodes.Status401Unauthorized)]
	[ProducesResponseType(StatusCodes.Status403Forbidden)]
	[ProducesResponseType(StatusCodes.Status404NotFound)]
	public async Task<IActionResult> AnswerQuestion(int questionId, AnswerQuestionCommand command, CancellationToken cancellationToken)
	{
		// Override the QuestionId from route
		var answerCommand = command with
		{
			QuestionId = questionId,
		};
		var result = await Mediator.Send(answerCommand, cancellationToken);

		if (result.IsSuccess)
			return Ok(new { message = Localizer[LocalizationKeys.PetAd.QuestionAnsweredSuccess] });

		return result.ToActionResult();
	}

	/// <summary>
	/// Reply to a question on a pet advertisement (Facebook-style comment system).
	/// Any authenticated user can reply to questions.
	/// </summary>
	/// <param name="questionId">Question ID</param>
	/// <param name="command">Reply command with text</param>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>Success or failure result</returns>
	/// <response code="200">Reply added successfully</response>
	/// <response code="401">User is not authenticated</response>
	/// <response code="404">Question not found</response>
	[HttpPost("questions/{questionId:int}/replies")]
	[ProducesResponseType(StatusCodes.Status200OK)]
	[ProducesResponseType(StatusCodes.Status401Unauthorized)]
	[ProducesResponseType(StatusCodes.Status404NotFound)]
	public async Task<IActionResult> ReplyToQuestion(int questionId, ReplyToQuestionCommand command, CancellationToken cancellationToken)
	{
		var replyCommand = command with { QuestionId = questionId };
		var result = await Mediator.Send(replyCommand, cancellationToken);

		if (result.IsSuccess)
			return Ok(new { message = Localizer[LocalizationKeys.PetAd.ReplyAddedSuccess] });

		return result.ToActionResult();
	}

	/// <summary>
	/// Delete an inappropriate question on your pet advertisement.
	/// </summary>
	/// <param name="questionId">Question ID</param>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>Success or failure result</returns>
	/// <response code="204">Question deleted successfully</response>
	/// <response code="401">User is not authenticated</response>
	/// <response code="403">Only the ad owner can delete questions</response>
	/// <response code="404">Question not found</response>
	[HttpDelete("questions/{questionId:int}")]
	[ProducesResponseType(StatusCodes.Status204NoContent)]
	[ProducesResponseType(StatusCodes.Status401Unauthorized)]
	[ProducesResponseType(StatusCodes.Status403Forbidden)]
	[ProducesResponseType(StatusCodes.Status404NotFound)]
	public async Task<IActionResult> DeleteQuestion(int questionId, CancellationToken cancellationToken)
	{
		var result = await Mediator.Send(new DeleteQuestionCommand { QuestionId = questionId }, cancellationToken);

		if (result.IsSuccess)
			return NoContent();

		return result.ToActionResult();
	}
}
