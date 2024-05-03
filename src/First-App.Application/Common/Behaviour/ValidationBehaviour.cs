using Ardalis.Result;
using Ardalis.Result.FluentValidation;
using FluentValidation;
using FluentValidation.Results;
using MediatR;
using ValidationException = System.ComponentModel.DataAnnotations.ValidationException;

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
                return GetValidationResultObject(validationResult);
            }
        }

        return await next();
    }

    private TResponse GetValidationResultObject(IEnumerable<ValidationResult> validationResult)
    {
        Type responseType = typeof(TResponse);

        if (responseType.IsGenericType
         && responseType.GetGenericTypeDefinition() == typeof(Result<>))
        {
            var invalidMethod = responseType
                .GetMethod("Invalid", [typeof(List<ValidationError>)]);

            return (TResponse)invalidMethod!.Invoke(null, [validationResult.SelectMany(vr => vr.AsErrors()).ToList()])!;
        }
        else if (responseType == typeof(Result))
        {
            return (TResponse)(object)Result.Invalid(validationResult.SelectMany(vr => vr.AsErrors()).ToList());
        }
        else
        {
            throw new FluentValidation.ValidationException(validationResult.SelectMany(vr => vr.Errors));
        }
    }
}
