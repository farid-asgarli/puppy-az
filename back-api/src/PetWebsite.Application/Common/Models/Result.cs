namespace PetWebsite.Application.Common.Models;

/// <summary>
/// Represents the result of an operation with success/failure state and optional data.
/// </summary>
/// <typeparam name="T">The type of the data returned on success.</typeparam>
public class Result<T>
{
    public bool IsSuccess { get; }
    public T? Data { get; }
    public string? Error { get; }
    public IEnumerable<string>? Errors { get; }
    public int StatusCode { get; }

    protected Result(
        bool isSuccess,
        T? data,
        string? error,
        IEnumerable<string>? errors,
        int statusCode
    )
    {
        IsSuccess = isSuccess;
        Data = data;
        Error = error;
        Errors = errors;
        StatusCode = statusCode;
    }

    /// <summary>
    /// Creates a successful result with data.
    /// </summary>
    public static Result<T> Success(T data, int statusCode = 200)
    {
        return new Result<T>(true, data, null, null, statusCode);
    }

    /// <summary>
    /// Creates a failed result with a single error message.
    /// </summary>
    public static Result<T> Failure(string error, int statusCode = 400)
    {
        return new Result<T>(false, default, error, null, statusCode);
    }

    /// <summary>
    /// Creates a failed result with multiple error messages.
    /// </summary>
    public static Result<T> Failure(IEnumerable<string> errors, int statusCode = 400)
    {
        return new Result<T>(false, default, null, errors, statusCode);
    }

    /// <summary>
    /// Creates a not found result.
    /// </summary>
    public static Result<T> NotFound(string message = "Resource not found")
    {
        return new Result<T>(false, default, message, null, 404);
    }
}

/// <summary>
/// Represents the result of an operation without return data.
/// </summary>
public class Result
{
    public bool IsSuccess { get; }
    public string? Error { get; }
    public IEnumerable<string>? Errors { get; }
    public int StatusCode { get; }

    protected Result(bool isSuccess, string? error, IEnumerable<string>? errors, int statusCode)
    {
        IsSuccess = isSuccess;
        Error = error;
        Errors = errors;
        StatusCode = statusCode;
    }

    /// <summary>
    /// Creates a successful result.
    /// </summary>
    public static Result Success(int statusCode = 200)
    {
        return new Result(true, null, null, statusCode);
    }

    /// <summary>
    /// Creates a failed result with a single error message.
    /// </summary>
    public static Result Failure(string error, int statusCode = 400)
    {
        return new Result(false, error, null, statusCode);
    }

    /// <summary>
    /// Creates a failed result with multiple error messages.
    /// </summary>
    public static Result Failure(IEnumerable<string> errors, int statusCode = 400)
    {
        return new Result(false, null, errors, statusCode);
    }

    /// <summary>
    /// Creates a not found result.
    /// </summary>
    public static Result NotFound(string message = "Resource not found")
    {
        return new Result(false, message, null, 404);
    }
}
