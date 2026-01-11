using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Auth.Commands.LoginWithMobile;

/// <summary>
/// Command to login with phone number and SMS verification code.
/// </summary>
public record LoginWithMobileCommand(string PhoneNumber, string VerificationCode) : ICommand<Result<AuthenticationResponse>>;
