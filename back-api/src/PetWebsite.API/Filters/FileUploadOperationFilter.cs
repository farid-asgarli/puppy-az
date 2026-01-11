using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace PetWebsite.API.Filters;

public class FileUploadOperationFilter : IOperationFilter
{
	public void Apply(OpenApiOperation operation, OperationFilterContext context)
	{
		var fileParameters = context
			.ApiDescription.ParameterDescriptions.Where(p => p.ModelMetadata?.ModelType == typeof(IFormFile))
			.ToList();

		if (!fileParameters.Any())
			return;

		operation.RequestBody = new OpenApiRequestBody
		{
			Content = new Dictionary<string, OpenApiMediaType>
			{
				["multipart/form-data"] = new OpenApiMediaType
				{
					Schema = new OpenApiSchema
					{
						Type = "object",
						Properties = fileParameters.ToDictionary(
							p => p.Name,
							p => new OpenApiSchema { Type = "string", Format = "binary" }
						),
						Required = fileParameters.Where(p => p.IsRequired).Select(p => p.Name).ToHashSet(),
					},
				},
			},
		};

		// Remove the file parameter from parameters list
		foreach (var fileParam in fileParameters)
		{
			var param = operation.Parameters.FirstOrDefault(p => p.Name == fileParam.Name);
			if (param != null)
				operation.Parameters.Remove(param);
		}
	}
}
