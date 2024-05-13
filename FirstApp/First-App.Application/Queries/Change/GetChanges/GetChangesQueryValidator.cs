using First_App.Application.Common.Dtos.Pagination;
using FluentValidation;

namespace First_App.Application.Queries.Change.GetChanges;

public class GetChangesQueryValidator : AbstractValidator<GetChangesQuery>
{
    public GetChangesQueryValidator(IValidator<PaginationContext> paginationContextValidator)
    {
        RuleFor(query => query.BoardId)
            .NotEmpty();

        RuleFor(query => query.PaginationContext)
            .SetValidator(paginationContextValidator)
            .When(query => query.PaginationContext is not null);
    }
}
