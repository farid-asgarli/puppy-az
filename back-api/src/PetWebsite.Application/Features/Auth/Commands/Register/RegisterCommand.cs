using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Auth.Commands.Register;

public record RegisterCommand(string Email, string Password, string FirstName, string LastName, string PhoneNumber, string VerificationCode)
	: ICommand<Result<AuthenticationResponse>>;
