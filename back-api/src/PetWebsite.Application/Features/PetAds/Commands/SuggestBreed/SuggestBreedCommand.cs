using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.PetAds.Commands.SuggestBreed;

public record SuggestBreedCommand(
	string Name,
	int PetCategoryId
) : ICommand<Result<int>>;
