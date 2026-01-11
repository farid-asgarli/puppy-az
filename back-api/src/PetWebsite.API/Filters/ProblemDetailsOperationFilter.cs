using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace PetWebsite.API.Filters;

/// <summary>
/// Swagger operation filter to automatically add ProblemDetails response documentation.
/// </summary>
public class ProblemDetailsOperationFilter : IOperationFilter
{
	public void Apply(OpenApiOperation operation, OperationFilterContext context)
	{
		// Define common ProblemDetails response
		// var problemDetailsSchema = context.SchemaGenerator.GenerateSchema(typeof(ProblemDetails), context.SchemaRepository);

		// // Add standard error responses if not already documented
		// AddResponseIfNotExists(operation, "400", "Bad Request - Validation error or invalid input", problemDetailsSchema);
		// AddResponseIfNotExists(operation, "401", "Unauthorized - Authentication required", problemDetailsSchema);
		// AddResponseIfNotExists(operation, "403", "Forbidden - Insufficient permissions", problemDetailsSchema);
		// AddResponseIfNotExists(operation, "404", "Not Found - Resource not found", problemDetailsSchema);
		// AddResponseIfNotExists(operation, "500", "Internal Server Error - Unexpected error", problemDetailsSchema);
	}

	private static void AddResponseIfNotExists(OpenApiOperation operation, string statusCode, string description, OpenApiSchema schema)
	{
		if (!operation.Responses.ContainsKey(statusCode))
		{
			operation.Responses.Add(
				statusCode,
				new OpenApiResponse
				{
					Description = description,
					Content = new Dictionary<string, OpenApiMediaType>
					{
						["application/problem+json"] = new OpenApiMediaType { Schema = schema },
					},
				}
			);
		}
	}
}
