using First_App.WebApi.Responses;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace First_App.WebApi.Middlewares;

public class GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger) : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger = logger;

    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext,
                                                Exception exception,
                                                CancellationToken cancellationToken)
    {
        _logger.LogError(exception.ToString());

        ProblemDetails details = new()
        {
            Status = StatusCodes.Status500InternalServerError,
            Title = ErrorTitles.ExceptionTitle,
            Type = exception.GetType().Name,
            Detail = exception.Message
        };

        httpContext.Response.StatusCode = details.Status.Value;

        await httpContext.Response
            .WriteAsJsonAsync(details, cancellationToken);

        return true;
    }
}
