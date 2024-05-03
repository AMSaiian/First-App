using Ardalis.Result;
using MediatR;
using Microsoft.Extensions.Logging;

namespace First_App.Application.Common.Behaviour;

public class LoggingBehaviour<TRequest, TResponse>(ILogger<LoggingBehaviour<TRequest, TResponse>> logger)
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private readonly ILogger<LoggingBehaviour<TRequest, TResponse>> _logger = logger;

    public async Task<TResponse> Handle(TRequest request,
                                        RequestHandlerDelegate<TResponse> next,
                                        CancellationToken cancellationToken)
    {
        _logger.LogInformation("Processing request {@Parameters}",
                               request);

        TResponse response = await next();
        IResult result = (response as IResult)!;

        switch (result.Status)
        {
            case ResultStatus.Ok:
                _logger.LogInformation("Processed successfully {@Parameters}",
                                       request);
                break;

            case ResultStatus.Invalid:
                _logger.LogInformation("Processed {@Parameters} shortly with validation errors {@Errors}",
                                       request,
                                       result.ValidationErrors);
                break;

            case ResultStatus.NotFound:
            case ResultStatus.Conflict:
            case ResultStatus.Error:
                _logger.LogWarning("Processed {@Parameters} with business logic error: {@Errors}",
                                   request,
                                   result.Errors);
                break;
        }

        return response;
    }
}
