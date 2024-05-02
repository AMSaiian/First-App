using Ardalis.Result;
using Ardalis.Result.FluentValidation;
using FluentValidation;
using MediatR;

namespace First_App.Application.Common.Behaviour;

public class ValidationBehaviour<TRequest, TResponse>(IEnumerable<IValidator<TRequest>> validators)
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private readonly IEnumerable<IValidator<TRequest>> _validators = validators;

    public async Task<TResponse> Handle(TRequest request,
                                        RequestHandlerDelegate<TResponse> next,
                                        CancellationToken cancellationToken)
    {
        if (_validators.Any())
        {
            var validationResult = _validators
                .Select(v => v.Validate(request))
                .ToList();

            if (validationResult.Exists(vr => !vr.IsValid))
            {
                var errors = validationResult
                    .SelectMany(vr => vr.AsErrors())
                    .ToList();

                return GetValidationResultObject(errors);
            }
        }

        return await next();
    }

    private TResponse GetValidationResultObject(List<ValidationError> errors)
    {
        return (TResponse)typeof(Result<>)
            .MakeGenericType(typeof(TResponse)
                                 .GetGenericArguments())
            .GetMethod("Invalid", [typeof(List<ValidationError>)])!
            .Invoke(null, [errors])!;
    }
}
