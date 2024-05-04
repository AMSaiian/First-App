using Ardalis.Result;
using Ardalis.Result.FluentValidation;
using FluentValidation;
using FluentValidation.Results;
using MediatR;

namespace First_App.Application.Common.Behaviour;

public class ValidationBehaviour<TRequest, TResponse>(IEnumerable<IValidator<TRequest>> validators)
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private static readonly Type GenericResultType = typeof(Result<>);
    private static readonly Type GenericPagedResultType = typeof(PagedResult<>);
    private static readonly Type NonGenericResultType = typeof(Result);
    private static readonly Type ValidationErrorListType = typeof(List<ValidationError>);
    private static readonly Type PagedInfoType = typeof(PagedInfo);

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
        Type? responseTypeGenericDefinition = responseType.IsGenericType
            ? responseType.GetGenericTypeDefinition()
            : default;

        if (responseTypeGenericDefinition == GenericResultType
         || responseTypeGenericDefinition == GenericPagedResultType)
        {
            Type responseTypeGenericArgument = responseType.GetGenericArguments()[0];

            var resolvedGenericType = GenericResultType
                .MakeGenericType(responseTypeGenericArgument);

            var invalidMethod = resolvedGenericType
                .GetMethod(nameof(Result<object>.Invalid), [ValidationErrorListType]);

            var responseObject = invalidMethod!
                .Invoke(null, [validationResult.SelectMany(vr => vr.AsErrors()).ToList()])!;

            if (responseTypeGenericDefinition == GenericPagedResultType)
            {
                var toPagedMethod = resolvedGenericType
                    .GetMethod(nameof(Result<object>.ToPagedResult), [PagedInfoType]);

                responseObject = toPagedMethod!
                    .Invoke(responseObject, [new PagedInfo(default, default, default, default)]);
            }

            return (TResponse)responseObject!;
        }
        else if (responseType == NonGenericResultType)
        {
            return (TResponse)(object)Result.Invalid(validationResult.SelectMany(vr => vr.AsErrors()).ToList());
        }
        else
        {
            throw new ValidationException(validationResult.SelectMany(vr => vr.Errors));
        }
    }
}
