using FluentValidation;

namespace PetWebsite.Application.Features.Admin.RegularUsers.Commands.CreateRegularUser;

/// <summary>
/// Validator for CreateRegularUserCommand.
/// </summary>
public class CreateRegularUserCommandValidator : AbstractValidator<CreateRegularUserCommand>
{
	public CreateRegularUserCommandValidator()
	{
		RuleFor(x => x.PhoneNumber)
			.NotEmpty()
			.WithMessage("Phone number is required")
			.Matches(@"^\+?[1-9]\d{1,14}$")
			.WithMessage("Phone number must be in valid international format");

		RuleFor(x => x.FirstName)
			.MaximumLength(100)
			.WithMessage("First name must not exceed 100 characters")
			.When(x => !string.IsNullOrWhiteSpace(x.FirstName));

		RuleFor(x => x.LastName)
			.MaximumLength(100)
			.WithMessage("Last name must not exceed 100 characters")
			.When(x => !string.IsNullOrWhiteSpace(x.LastName));
	}
}
