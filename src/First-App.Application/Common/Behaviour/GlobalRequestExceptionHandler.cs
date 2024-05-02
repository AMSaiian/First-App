using MediatR;
using MediatR.Pipeline;
using Microsoft.Extensions.Logging;

namespace First_App.Application.Common.Behaviour;

public class GlobalRequestExceptionHandler<TRequest, TResponse, TException>(
    ILogger<GlobalRequestExceptionHandler<TRequest, TResponse, TException>> logger)
    : IRequestExceptionHandler<TRequest, TResponse, TException>
    where TRequest : IRequest<TResponse>
    where TException : Exception
{
    private readonly ILogger<GlobalRequestExceptionHandler<TRequest, TResponse, TException>> _logger = logger;

    public Task Handle(TRequest request,
                       TException exception,
                       RequestExceptionHandlerState<TResponse> state,
                       CancellationToken cancellationToken)
    {
        _logger.LogError(exception, "Raised exception during processing request");

        state.SetHandled(default!);

        return Task.CompletedTask;
    }
}
