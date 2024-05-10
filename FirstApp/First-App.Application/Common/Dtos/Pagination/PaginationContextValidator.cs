using FluentValidation;

namespace First_App.Application.Common.Dtos.Pagination;

public class PaginationContextValidator : AbstractValidator<PaginationContext>
{
    public PaginationContextValidator()
    {
        RuleFor(context => context.PageNum)
            .GreaterThan(0);

        RuleFor(context => context.PageSize)
            .GreaterThan(0);
    }
}
