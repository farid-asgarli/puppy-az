using MediatR;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Sms.Queries.CheckSmsBalance;

/// <summary>
/// Query to check SMS balance from the provider.
/// </summary>
public record CheckSmsBalanceQuery : IRequest<Result<decimal>>;
