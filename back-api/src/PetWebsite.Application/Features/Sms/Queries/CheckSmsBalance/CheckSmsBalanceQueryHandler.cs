using MediatR;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Exceptions;

namespace PetWebsite.Application.Features.Sms.Queries.CheckSmsBalance;

/// <summary>
/// Handler for checking SMS balance.
/// </summary>
public class CheckSmsBalanceQueryHandler(ISmsService smsService)
    : IRequestHandler<CheckSmsBalanceQuery, Result<decimal>>
{
    private readonly ISmsService _smsService = smsService;

    public async Task<Result<decimal>> Handle(CheckSmsBalanceQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var balance = await _smsService.CheckSmsBalanceAsync(cancellationToken);
            return Result<decimal>.Success(balance);
        }
        catch (SmsException ex)
        {
            return Result<decimal>.Failure(ex.Message, 400);
        }
    }
}
