using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Exceptions;

namespace PetWebsite.Application.Features.Sms.Commands.SendSms;

public class SendSmsCommandHandler(ISmsService smsService, IStringLocalizer localizer)
	: BaseHandler(localizer),
		ICommandHandler<SendSmsCommand, Result>
{
	private readonly ISmsService _smsService = smsService;

	public async Task<Result> Handle(SendSmsCommand request, CancellationToken cancellationToken)
	{
		try
		{
			var options = new SendSmsOptions { Msisdn = request.PhoneNumber, Body = request.Message };

			await _smsService.SendSmsAsync(options, cancellationToken);

			return Result.Success();
		}
		catch (SmsException ex)
		{
			return Result.Failure(ex.Message, 400);
		}
	}
}
