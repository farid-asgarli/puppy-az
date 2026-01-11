# PetWebsite Backend - AI Coding Assistant Instructions

## Architecture Overview

This is a **Clean Architecture ASP.NET Core 8.0 Web API** for a pet advertisement platform using **PostgreSQL** and Entity Framework Core. The solution follows vertical slice organization within layers.

### Layer Dependencies (Strict)

- **Domain** → No dependencies (pure business entities)
- **Application** → Depends on Domain (business logic, CQRS handlers, DTOs)
- **Infrastructure** → Depends on Application + Domain (EF Core, external services, persistence)
- **API** → Depends on all layers (controllers, middleware, entry point)
- **Common.Repository** → Standalone reusable library for dynamic querying and Unit of Work pattern

### Key Architectural Patterns

**CQRS with MediatR**: All business operations use custom marker interfaces (`ICommand<T>`, `IQuery<T>`) wrapping MediatR's `IRequest<T>`. Handlers implement `ICommandHandler<TCommand, TResponse>` or `IQueryHandler<TQuery, TResponse>`.

**Dual Identity System**: The application manages two separate user types:

- `AdminUser` (table: `Admins`) - Uses full ASP.NET Core Identity with roles, claims, tokens
- `User` (table: `RegularUsers`) - Lightweight identity, separate authentication, no Identity framework features
- Both use `UserManager<T>` but only `AdminUser` integrates with Identity tables to avoid FK conflicts
- **Primary Keys**: Both user types use `Guid` as their primary key (inherited from `IdentityUser<Guid>`)

**Result Pattern**: All handlers return `Result<T>` or `Result` from `PetWebsite.Application.Common.Models`. Controllers call `.ToActionResult()` extension method for automatic HTTP status code mapping.

## Development Workflows

### Running the Application

```powershell
# Start PostgreSQL (required first)
docker-compose up -d

# Run the API (launches Swagger at https://localhost:7058/swagger)
cd src/PetWebsite.API
dotnet run
```

**Default connection**: `Host=localhost;Port=5432;Database=PetWebsiteDb;Username=petwebsite_user;Password=petwebsite_pass_2024`

### Database Migrations

```powershell
# Add migration (run from solution root)
dotnet ef migrations add MigrationName --project src/PetWebsite.Infrastructure --startup-project src/PetWebsite.API

# Apply migrations (automatic on app startup via DatabaseSeeder.SeedAsync in Program.cs)
dotnet ef database update --project src/PetWebsite.Infrastructure --startup-project src/PetWebsite.API
```

**Important**: Migrations assembly is `PetWebsite.Infrastructure`. The `AuditableEntityInterceptor` automatically sets `CreatedAt`, `UpdatedAt`, `CreatedBy` (Guid?), `UpdatedBy` (Guid?) on save.

## Project-Specific Conventions

### Routing

- All controllers use **kebab-case** routes via `KebabCaseRouteConvention`
- Example: `FilesController` → `/api/files`, `UserProfileController` → `/api/user-profile`
- Admin endpoints: `/api/admin/[controller]` (e.g., `/api/admin/users`)

### Feature Organization (Vertical Slices)

```
PetWebsite.Application/Features/{FeatureName}/
  ├── Commands/{CommandName}/
  │   ├── {CommandName}Command.cs       # Implements ICommand<Result<T>>
  │   ├── {CommandName}CommandHandler.cs
  │   └── {CommandName}CommandValidator.cs  # FluentValidation
  ├── Queries/{QueryName}/
  │   ├── {QueryName}Query.cs           # Implements IQuery<Result<T>>
  │   └── {QueryName}QueryHandler.cs
  └── {Feature}MappingProfile.cs        # AutoMapper profile
```

### Entity Base Classes

- `BaseEntity<TKey>` - Just `Id` property
- `AuditableEntity<TKey>` - Adds `CreatedAt`, `UpdatedAt`, `CreatedBy` (Guid?), `UpdatedBy` (Guid?) (auto-populated by interceptor)
- `SoftDeletableEntity<TKey>` - Adds `IsDeleted`, `DeletedAt`, `DeletedBy` (Guid?) with `.SoftDelete(Guid?)` and `.Restore()` methods
- Global query filter automatically excludes soft-deleted entities

### Controller Patterns

```csharp
[Authorize]  // Most endpoints require auth
public class MyController(IMediator mediator, IStringLocalizer<MyController> localizer)
    : BaseApiController(mediator, localizer)
{
    [HttpPost]
    public async Task<IActionResult> CreateSomething(CreateCommand command, CancellationToken ct)
    {
        var result = await Mediator.Send(command, ct);
        return result.ToActionResult();  // Automatic status code mapping
    }

    // Access current user via helper methods:
    // GetUserId() → Guid?
    // GetUserEmail() → string?
    // GetUserName() → string?
}
```

**Admin controllers**: Inherit from `AdminBaseController` with route prefix `/api/admin/[controller]`

### Validation & Error Handling

- FluentValidation runs automatically via `ValidationBehavior<TRequest, TResponse>` pipeline
- `ExceptionHandlingMiddleware` catches exceptions:
  - `ValidationException` → 400 with field-level errors
  - `UnauthorizedAccessException` → 401
  - `KeyNotFoundException` → 404
  - `ArgumentException`/`InvalidOperationException` → 400
  - Others → 500 with localized message

### Localization

- JSON resource files in `src/PetWebsite.API/Resources/` (e.g., `az.json`, `en.json`)
- Inject `IStringLocalizer<T>` into controllers
- Use `Localizer[LocalizationKeys.PetAd.CreateSuccess]` for typed keys
- Request-based culture from `Accept-Language` header

## Common Repository Usage

The `Common.Repository` library provides dynamic filtering and querying. It's registered in `DependencyInjection.cs`:

```csharp
services.AddScoped<IGenericFiltering, GenericFiltering>();
services.AddScoped<IDynamicQueryRepository, DynamicQueryRepository>();
```

**Dynamic filtering** (see `Common.Repository/README.md` for full docs):

```csharp
// In handler - inject IApplicationDbContext
var filterSpec = new FilterSpecification
{
    Filters = new[] { new FilterModel { Field = "IsActive", Operator = "eq", Value = "true" } },
    OrderBy = "CreatedAt desc",
    PageNumber = 1,
    PageSize = 20
};

var query = _context.PetAds.AsQueryable();
query = _genericFiltering.ApplyFilters(query, filterSpec);
var results = await query.ToListAsync(ct);
```

## Authentication & Authorization

**JWT Configuration**: `appsettings.json` → `JwtSettings` section

- Token lifetime, issuer, audience configured there
- Tokens blacklisted on logout via `BlacklistedTokens` table checked by `TokenBlacklistMiddleware`

**Authorization Policies** (see `AuthorizationConstants.cs`):

- `RequireSuperAdminRole`, `RequireAdminRole`, `RequireAnyAdminRole`, `RequireUserRole`
- Use `[Authorize(Roles = AuthorizationConstants.Roles.Admin)]` or `[Authorize(Policy = AuthorizationConstants.Policies.RequireAdminRole)]`

## File Handling

**File uploads** go through `IFileService` with built-in validation and security:

```csharp
// In FilesController - direct injection (not through MediatR)
await using var stream = file.OpenReadStream();
var metadata = await _fileService.SaveFileAsync(stream, file.FileName, subfolder, ct);
// Returns FileMetadata with: Id, FileName, RelativePath, ContentType, Size, Checksum
```

**Configuration** in `appsettings.json` → `FileStorage` section:

- `RootPath`: Upload directory (default: `uploads`)
- `MaxFileSize`: Bytes limit (default: 10MB)
- `AllowedExtensions`: Whitelist of file types
- `ChecksumAlgorithm`: SHA256/SHA512 for integrity verification

**Security**: Files auto-renamed with GUID prefix to prevent conflicts. Path traversal attacks blocked by `SanitizeFileName()`.

## SMS Verification Pattern

**Two-step verification flow**:

1. `SendVerificationCodeCommand` → Generates 6-digit code, stores in `SmsVerificationCodes` table, sends via `ISmsService`
2. `VerifyCodeCommand` → Validates code, marks as verified, proceeds with registration/login

**Rate limiting**: Prevents spam by checking last send time (1-minute cooldown). Auto-cleans expired codes older than 24 hours.

**Configuration** in `appsettings.json` → `SmsSettings` section with provider credentials.

## Handler Patterns

**Localization in handlers**: Extend `BaseHandler` for easy localization access:

```csharp
public class MyCommandHandler(IApplicationDbContext context, IStringLocalizer localizer)
    : BaseHandler(localizer), ICommandHandler<MyCommand, Result>
{
    public async Task<Result> Handle(MyCommand request, CancellationToken ct)
    {
        // Use L() helper for localized messages
        return Result.Failure(L(LocalizationKeys.User.NotFound), 404);
    }
}
```

**Current user access**: Inject `ICurrentUserService` in handlers (not just controllers):

```csharp
var userId = _currentUserService.UserId;  // int?
var tokenId = _currentUserService.GetTokenId();  // string?
var tokenExpiration = _currentUserService.GetTokenExpiration();  // DateTime?
```

## Configuration Sections

Key sections in `appsettings.json`:

- `ConnectionStrings:DefaultConnection` - PostgreSQL connection string
- `JwtSettings` - Token configuration (SecretKey, Issuer, Audience, expiration times)
- `FileStorage` - Upload constraints and checksum algorithm
- `SmsSettings` - SMS provider credentials and endpoints

All bound to strongly-typed option classes via `IOptions<T>` pattern.

## Localization Keys

Use typed constants from `LocalizationKeys` class:

- `LocalizationKeys.Auth.*` - Authentication messages
- `LocalizationKeys.User.*` - User operations
- `LocalizationKeys.PetAd.*` - Pet advertisement operations
- `LocalizationKeys.File.*` - File operations
- `LocalizationKeys.Sms.*` - SMS verification messages

Never use magic strings for user-facing messages.

## Important Notes

- **Soft deletes are default**: Use `.SoftDelete()` method, not `.Remove()`, for entities inheriting `SoftDeletableEntity`
- **Localization is multilingual**: Always use `IStringLocalizer` for user-facing messages
- **Static files**: Served from `wwwroot/`, configured in `WebApplicationExtensions.ConfigureMiddleware()`
- **No direct DbContext.SaveChanges()**: Inject `IApplicationDbContext` for queries, changes tracked automatically
- **Swagger only in Development**: Custom CSS/JS in `wwwroot/swagger-*.{css,js}`
- **File operations bypass MediatR**: Directly inject `IFileService` in controllers for uploads/downloads
- **AutoMapper profiles**: One per feature, auto-registered from Application assembly

And please, do not generate documentation file about what you have done.

You can update this file as needed to reflect any changes in architecture or conventions.
