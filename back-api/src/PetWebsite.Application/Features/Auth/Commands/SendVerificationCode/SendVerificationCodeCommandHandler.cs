using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Auth.Commands.SendVerificationCode;

public class SendVerificationCodeCommandHandler(ISmsVerificationService smsVerificationService, IStringLocalizer localizer)
	: BaseHandler(localizer),
		ICommandHandler<SendVerificationCodeCommand, Result>
{
	private readonly ISmsVerificationService _smsVerificationService = smsVerificationService;

	public async Task<Result> Handle(SendVerificationCodeCommand request, CancellationToken cancellationToken)
	{
		return await _smsVerificationService.SendVerificationCodeAsync(request.PhoneNumber, request.Purpose, cancellationToken);
	}
}
