using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Auth.Commands.SendVerificationCode;

/// <summary>
/// Command to send an SMS verification code to a phone number.
/// </summary>
public record SendVerificationCodeCommand(string PhoneNumber, string Purpose = "Registration") : ICommand<Result>;
