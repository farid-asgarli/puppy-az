using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc.ApplicationModels;

namespace PetWebsite.API.Conventions;

/// <summary>
/// Convention that transforms controller names to kebab-case for routing.
/// Example: FilesController -> files, UserProfileController -> user-profile
/// </summary>
public partial class KebabCaseRouteConvention : IControllerModelConvention
{
	public void Apply(ControllerModel controller)
	{
		// Replace the [controller] token with kebab-case version
		foreach (var selector in controller.Selectors)
		{
			if (selector.AttributeRouteModel != null)
			{
				var template = selector.AttributeRouteModel.Template;
				if (template?.Contains("[controller]") == true)
				{
					var controllerName = controller.ControllerName;
					var kebabCaseName = ToKebabCase(controllerName);
					selector.AttributeRouteModel.Template = template.Replace("[controller]", kebabCaseName);
				}
			}
		}

		// Also update action selectors
		foreach (var action in controller.Actions)
		{
			foreach (var selector in action.Selectors)
			{
				if (selector.AttributeRouteModel != null)
				{
					var template = selector.AttributeRouteModel.Template;
					if (template?.Contains("[controller]") == true)
					{
						var controllerName = controller.ControllerName;
						var kebabCaseName = ToKebabCase(controllerName);
						selector.AttributeRouteModel.Template = template.Replace("[controller]", kebabCaseName);
					}
				}
			}
		}
	}

	private static string ToKebabCase(string value)
	{
		if (string.IsNullOrEmpty(value))
			return value;

		// Insert a hyphen before each uppercase letter (except the first one) and convert to lowercase
		return KebabCaseRegex().Replace(value, "-$1").ToLowerInvariant();
	}

	[GeneratedRegex("(?<!^)([A-Z])")]
	private static partial Regex KebabCaseRegex();
}
