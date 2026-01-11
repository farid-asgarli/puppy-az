# Common.Repository

A comprehensive data management library for Entity Framework Core featuring the Unit of Work pattern, generic repository with specification pattern, dynamic filtering, query builder, and advanced LINQ expression building capabilities.

## Features

-  **Unit of Work Pattern** - Manage transactions and coordinate multiple repositories
-  **Generic Repository** - CRUD operations with specification pattern support
-  **Dynamic Filtering** - JSON-based filter specifications for complex queries
-  **Query Builder** - Fluent API for building complex LINQ queries
-  **Bulk Operations** - Efficient bulk update and delete operations (EF Core 7+)
-  **Transaction Support** - Built-in transaction management with rollback capabilities
-  **Thread-Safe** - Optimized for concurrent operations with caching

## Installation

```bash
dotnet add package Common.Repository
```

## Quick Start

### 1. Register Services

In your `Program.cs`, register the UnitOfWork with your DbContext:

```csharp
using Common.Repository;

var builder = WebApplication.CreateBuilder(args);

// Register your DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register UnitOfWork - This is the only method you need to call
builder.Services.AddUnitOfWork<AppDbContext>();

var app = builder.Build();
```

That's it! The `AddUnitOfWork<TContext>()` method registers:

- `IUnitOfWork` - Unit of Work implementation
- `IRepository<T>` - Generic repository for all entities
- `IGenericFiltering` - Dynamic filtering service (Singleton)
- `IDynamicQueryRepository` - Query builder service (Singleton)

> **Note:** `DynamicQueryRepository` and `GenericFiltering` can also be used standalone without DI. You can instantiate them directly and pass them to queries. See the [Standalone Usage](#standalone-usage-without-di) section below.

### 2. Define Your Entities

```csharp
public class Product
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Category { get; set; }
    public decimal Price { get; set; }
    public int StockQuantity { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Product> Products => Set<Product>();
}
```

### 3. Use in Your Services

```csharp
public class ProductService
{
    private readonly IUnitOfWork _unitOfWork;

    public ProductService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    // Create operation
    public async Task<Product> CreateProductAsync(Product product, CancellationToken ct = default)
    {
        _unitOfWork.Repository<Product>().Add(product);
        await _unitOfWork.SaveChangesAsync(ct);
        return product;
    }

    // Read operation with filtering
    public async Task<Product?> GetProductByIdAsync(int id, CancellationToken ct = default)
    {
        return await _unitOfWork.Repository<Product>()
            .FindOneAsync(p => p.Id == id, ct: ct);
    }

    // Query with pagination and filtering
    public async Task<(IReadOnlyList<Product> items, int totalCount)> ListProductsAsync(
        FilterSpecification filters,
        PaginationSpecification pagination,
        CancellationToken ct = default)
    {
        return await _unitOfWork.Repository<Product>()
            .QueryNoTracking()
            .ApplyFilters(filters)
            .OrderBy(p => p.Name)
            .ApplyPagination(pagination)
            .ToListWithCountAsync(ct);
    }
}
```

## Usage Examples

### Write Operation - Create a Product

```csharp
public async Task<Product> CreateProductAsync(string name, string category, decimal price)
{
    var product = new Product
    {
        Name = name,
        Category = category,
        Price = price,
        IsActive = true,
        CreatedAt = DateTime.UtcNow
    };

    _unitOfWork.Repository<Product>().Add(product);
    await _unitOfWork.SaveChangesAsync();

    return product;
}
```

### Filtering Operations

#### Example 1: Query with Filters

```csharp
public async Task<(IReadOnlyList<Product> items, int totalCount)> SearchProductsAsync(
    FilterSpecification filterSpec,
    PaginationSpecification pagination,
    CancellationToken ct = default)
{
    var result = await _unitOfWork
        .Repository<Product>()
        .QueryNoTracking()
        .ApplyFilters(filterSpec)
        .ApplyPagination(pagination)
        .ToListWithCountAsync(ct);

    return result;
}
```

#### Example 2: Query with Filters and Ordering

```csharp
public async Task<(IReadOnlyList<Customer> items, int totalCount)> GetFilteredCustomersAsync(
    FilterSpecification filterSpec,
    PaginationSpecification pagination,
    CancellationToken ct = default)
{
    var result = await _unitOfWork
        .Repository<Customer>()
        .QueryNoTracking()
        .ApplyFilters(filterSpec)
        .OrderByDescending(c => c.RegistrationDate)
        .ApplyPagination(pagination)
        .ToListWithCountAsync(ct);

    return result;
}
```

## API Endpoints with JSON Request Bodies

### POST Request Structure

For list/filter operations, use POST requests with JSON body for better readability and maintainability:

```csharp
// Request DTO
public record ProductListRequest(
    FilterSpecification Filters,
    PaginationSpecification Pagination
);

// Minimal API endpoint
app.MapPost("/api/products/list", async (
    ProductListRequest request,
    IUnitOfWork unitOfWork,
    CancellationToken ct) =>
{
    var (items, totalCount) = await unitOfWork
        .Repository<Product>()
        .QueryNoTracking()
        .ApplyFilters(request.Filters)
        .OrderBy(p => p.Name)
        .ApplyPagination(request.Pagination)
        .ToListWithCountAsync(ct);

    return Results.Ok(new
    {
        items,
        pagination = new
        {
            number = request.Pagination.Number,
            size = request.Pagination.Size,
            totalCount,
            totalPages = (int)Math.Ceiling(totalCount / (double)request.Pagination.Size)
        }
    });
});
```

## JSON Request Body Examples

### Example 1: Simple Filter

**Endpoint:** `POST /api/products/list`

**Request Body:**

```json
{
  "filters": {
    "entries": [
      {
        "key": "category",
        "value": "Electronics",
        "equation": 0
      }
    ],
    "logicalOperator": 0
  },
  "pagination": {
    "number": 1,
    "size": 10
  }
}
```

### Example 2: Complex Filter with Multiple AND Conditions

Filter products where:

- `category = "Electronics"`
- `price >= 100`
- `price <= 500`
- `name CONTAINS "Phone"`
- `isActive = true`

**Request Body:**

```json
{
  "filters": {
    "entries": [
      {
        "key": "category",
        "value": "Electronics",
        "equation": 0
      },
      {
        "key": "price",
        "value": 100,
        "equation": 4
      },
      {
        "key": "price",
        "value": 500,
        "equation": 6
      },
      {
        "key": "name",
        "value": "Phone",
        "equation": 1
      },
      {
        "key": "isActive",
        "value": true,
        "equation": 0
      }
    ],
    "logicalOperator": 0
  },
  "pagination": {
    "number": 1,
    "size": 20
  }
}
```

### Example 3: OR Filter

Filter products in multiple categories:

**Request Body:**

```json
{
  "filters": {
    "entries": [
      {
        "key": "category",
        "value": "Electronics",
        "equation": 0
      },
      {
        "key": "category",
        "value": "Computers",
        "equation": 0
      },
      {
        "key": "category",
        "value": "Accessories",
        "equation": 0
      }
    ],
    "logicalOperator": 1
  },
  "pagination": {
    "number": 1,
    "size": 50
  }
}
```

### Example 4: Date Range Filter

Filter customers registered within a date range:

**Request Body:**

```json
{
  "filters": {
    "entries": [
      {
        "key": "registrationDate",
        "value": "2024-01-01T00:00:00Z",
        "equation": 4
      },
      {
        "key": "registrationDate",
        "value": "2024-12-31T23:59:59Z",
        "equation": 6
      },
      {
        "key": "city",
        "value": "New York",
        "equation": 0
      }
    ],
    "logicalOperator": 0
  },
  "pagination": {
    "number": 1,
    "size": 100
  }
}
```

### Example 5: String Operations

Filter with string operations (starts with, ends with):

**Request Body:**

```json
{
  "filters": {
    "entries": [
      {
        "key": "name",
        "value": "Apple",
        "equation": 2
      },
      {
        "key": "category",
        "value": "phones",
        "equation": 3
      }
    ],
    "logicalOperator": 0
  },
  "pagination": {
    "number": 1,
    "size": 25
  }
}
```

### Example 6: Fetch All (No Filter)

**Request Body:**

```json
{
  "filters": {
    "entries": [],
    "logicalOperator": 0
  },
  "pagination": {
    "number": 1,
    "size": 20
  }
}
```

## Filter Equations Reference

| Equation         | Value | Description           | Example                       |
| ---------------- | ----- | --------------------- | ----------------------------- |
| `EQUALS`         | `0`   | Exact match           | `price = 100`                 |
| `CONTAINS`       | `1`   | String contains       | `name CONTAINS "Phone"`       |
| `STARTS_WITH`    | `2`   | String starts with    | `name STARTS_WITH "Apple"`    |
| `ENDS_WITH`      | `3`   | String ends with      | `category ENDS_WITH "phones"` |
| `BIGGER_EQUALS`  | `4`   | Greater than or equal | `price >= 100`                |
| `BIGGER`         | `5`   | Greater than          | `price > 100`                 |
| `SMALLER_EQUALS` | `6`   | Less than or equal    | `price <= 500`                |
| `SMALLER`        | `7`   | Less than             | `price < 500`                 |
| `NOT_EQUALS`     | `8`   | Not equal             | `status != 1`                 |
| `EMPTY`          | `9`   | Empty string or Guid  | `name IS EMPTY`               |
| `NOT_EMPTY`      | `10`  | Not empty             | `name IS NOT EMPTY`           |

## Logical Operators

| Operator   | Value | Description                                     |
| ---------- | ----- | ----------------------------------------------- |
| `AND_ALSO` | `0`   | AND (&&) - All conditions must be true          |
| `OR_ELSE`  | `1`   | OR (\|\|) - At least one condition must be true |

## Transaction Support

```csharp
public async Task<Order> CreateOrderWithTransactionAsync(
    int customerId,
    List<OrderItem> items,
    CancellationToken ct = default)
{
    // Begin transaction
    await _unitOfWork.BeginTransactionAsync(ct);

    try
    {
        var order = new Order
        {
            CustomerId = customerId,
            OrderDate = DateTime.UtcNow,
            TotalAmount = items.Sum(i => i.UnitPrice * i.Quantity)
        };

        _unitOfWork.Repository<Order>().Add(order);
        await _unitOfWork.SaveChangesAsync(ct); // Get order ID

        // Add order items
        foreach (var item in items)
        {
            item.OrderId = order.Id;
            _unitOfWork.Repository<OrderItem>().Add(item);
        }

        // SaveChanges automatically commits the transaction
        await _unitOfWork.SaveChangesAsync(ct);

        return order;
    }
    catch
    {
        // Rollback on error
        await _unitOfWork.RollbackAsync(ct);
        throw;
    }
}
```

## Bulk Operations

### Bulk Update

```csharp
// Update all products in a category
public async Task<int> UpdateCategoryPricesAsync(
    string category,
    decimal priceMultiplier,
    CancellationToken ct = default)
{
    return await _unitOfWork.Repository<Product>()
        .BulkUpdatePropertyAsync(
            propertySelector: p => p.Price,
            valueFactory: p => p.Price * priceMultiplier,
            criteria: p => p.Category == category,
            ct: ct
        );
}
```

### Bulk Delete

```csharp
// Deactivate out-of-stock products
public async Task<int> DeactivateOutOfStockAsync(CancellationToken ct = default)
{
    return await _unitOfWork.Repository<Product>()
        .BulkUpdateAsync(
            setPropertyCalls: x => x.SetProperty(p => p.IsActive, false),
            criteria: p => p.StockQuantity == 0,
            ct: ct
        );
}
```

## Complete Program.cs Example

```csharp
using Microsoft.EntityFrameworkCore;
using Common.Repository;
using YourNamespace;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register UnitOfWork - Single method call!
builder.Services.AddUnitOfWork<AppDbContext>();

// Register your application services
builder.Services.AddScoped<ProductService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

// POST: List products with filters
app.MapPost("/api/products/list", async (
    ProductListRequest request,
    IUnitOfWork unitOfWork,
    CancellationToken ct) =>
{
    var (items, totalCount) = await unitOfWork
        .Repository<Product>()
        .QueryNoTracking()
        .ApplyFilters(request.Filters)
        .OrderBy(p => p.Name)
        .ApplyPagination(request.Pagination)
        .ToListWithCountAsync(ct);

    return Results.Ok(new
    {
        items,
        pagination = new
        {
            number = request.Pagination.Number,
            size = request.Pagination.Size,
            totalCount,
            totalPages = (int)Math.Ceiling(totalCount / (double)request.Pagination.Size)
        }
    });
});

app.Run();
```

## Standalone Usage Without DI

You can use `DynamicQueryRepository` and `GenericFiltering` without dependency injection by creating instances directly:

### Example 1: Direct Instantiation

```csharp
// Create instances
var filtering = new GenericFiltering();
var dynamicQueryRepo = new DynamicQueryRepository(filtering);

// Use with any IQueryable
public async Task<(IReadOnlyList<Product> items, int totalCount)> QueryProductsAsync(
    IQueryable<Product> query,
    FilterSpecification filterSpec,
    PaginationSpecification pagination,
    CancellationToken ct = default)
{
    var result = await dynamicQueryRepo
        .WithQuery(query)
        .ApplyFilters(filterSpec)
        .ApplyPagination(pagination)
        .ToListWithCountAsync(ct);

    return result;
}
```

### Example 2: Use with DbContext Directly

```csharp
public class ProductRepository
{
    private readonly AppDbContext _context;
    private readonly IDynamicQueryRepository _queryRepo;

    public ProductRepository(AppDbContext context)
    {
        _context = context;

        // Create instances without DI
        var filtering = new GenericFiltering();
        _queryRepo = new DynamicQueryRepository(filtering);
    }

    public async Task<(IReadOnlyList<Product> items, int totalCount)> SearchAsync(
        FilterSpecification filters,
        PaginationSpecification pagination,
        CancellationToken ct = default)
    {
        // Get query from DbContext
        var query = _context.Products.AsNoTracking();

        // Apply filters using standalone instance
        return await _queryRepo
            .WithQuery(query)
            .ApplyFilters(filters)
            .OrderBy(p => p.Name)
            .ApplyPagination(pagination)
            .ToListWithCountAsync(ct);
    }
}
```

### Example 3: Ad-hoc Query Building

```csharp
public async Task<List<Product>> GetFilteredProductsAsync()
{
    using var context = new AppDbContext(options);

    // Create filter specification
    var filterSpec = new FilterSpecification
    {
        Entries = new[]
        {
            new FilterEntryDetails
            {
                Key = "category",
                Value = JsonSerializer.SerializeToElement("Electronics"),
                Equation = FilterEquations.EQUALS
            },
            new FilterEntryDetails
            {
                Key = "price",
                Value = JsonSerializer.SerializeToElement(100),
                Equation = FilterEquations.BIGGER_EQUALS
            }
        },
        LogicalOperator = LogicalOperators.AND_ALSO
    };

    // Create instances and use immediately
    var filtering = new GenericFiltering();
    var queryRepo = new DynamicQueryRepository(filtering);

    return await queryRepo
        .WithQuery(context.Products.AsNoTracking())
        .ApplyFilters(filterSpec)
        .ToListAsync();
}
```

### Why Use Standalone?

**Benefits of standalone usage:**

- ✅ No need to configure DI
- ✅ Works in console apps, scripts, or utilities
- ✅ Useful for one-off queries or migrations
- ✅ Can be used with any `IQueryable<T>` source
- ✅ Easy to test without setting up service container

**When to use DI instead:**

- For full application architecture with UnitOfWork pattern
- When you need transaction management
- For repositories that coordinate multiple entities
- In ASP.NET Core applications with service lifetime management

## Advanced Features

### Specification Pattern

```csharp
public async Task<IReadOnlyList<Product>> GetActiveProductsAsync(CancellationToken ct = default)
{
    return await _unitOfWork.Repository<Product>()
        .FindAllAsync(
            criteria: p => p.IsActive,
            spec: s => s
                .Include(p => p.Category)
                .OrderBy(p => p.Name)
                .Take(50),
            ct: ct
        );
}
```

### Query Builder

```csharp
public async Task<IReadOnlyList<Product>> SearchAsync(string searchTerm, CancellationToken ct = default)
{
    return await _unitOfWork.Repository<Product>()
        .QueryNoTracking()
        .Where(p => p.IsActive)
        .Where(p => p.Name.Contains(searchTerm) || p.Category.Contains(searchTerm))
        .OrderBy(p => p.Name)
        .ToListAsync(ct);
}
```

### Single Property Update

```csharp
// Update a single property efficiently without loading the entire entity
public async Task<bool> UpdatePriceAsync(int productId, decimal newPrice, CancellationToken ct = default)
{
    var updated = await _unitOfWork.Repository<Product>()
        .UpdatePropertyAsync(
            id: productId,
            propertySelector: p => p.Price,
            newValue: newPrice,
            ct: ct
        );

    if (updated)
    {
        await _unitOfWork.SaveChangesAsync(ct);
    }

    return updated;
}
```

## API Response Structure

Typical response from list endpoints:

```json
{
  "items": [
    {
      "id": 1,
      "name": "iPhone 15",
      "category": "Electronics",
      "price": 999.99,
      "stockQuantity": 50,
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00Z"
    },
    {
      "id": 2,
      "name": "Samsung Galaxy",
      "category": "Electronics",
      "price": 899.99,
      "stockQuantity": 30,
      "isActive": true,
      "createdAt": "2024-01-16T14:20:00Z"
    }
  ],
  "pagination": {
    "number": 1,
    "size": 10,
    "totalCount": 2,
    "totalPages": 1
  }
}
```

## Requirements

- .NET 8.0 or higher
- Entity Framework Core 8.0 or higher
- SQL Server, PostgreSQL, MySQL, or any EF Core supported database

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues, questions, or feature requests, please open an issue on the GitHub repository.

---

**Author:** Farid Asgarli
**Company:** PASHA Life
**Version:** 1.0.0
