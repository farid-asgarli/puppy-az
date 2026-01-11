using System.Reflection;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using PetWebsite.Application.Common.Behaviors;

namespace PetWebsite.Application;

public static class DependencyInjection
{
	public static IServiceCollection AddApplication(this IServiceCollection services)
	{
		var assembly = Assembly.GetExecutingAssembly();

		services.AddMediatR(cfg =>
		{
			cfg.RegisterServicesFromAssembly(assembly);
			cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(LoggingBehavior<,>));
			cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
		});

		services.AddValidatorsFromAssembly(assembly);

		// Register AutoMapper with all profiles from this assembly
		services.AddAutoMapper(assembly);

		return services;
	}
}
