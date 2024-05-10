using First_App.Application.Common.Dtos.Pagination;
using FluentValidation;

namespace First_App.Application.Queries.Card.GetCardChanges;

public class GetCardChangesQueryValidator : AbstractValidator<GetCardChangesQuery>
{
    public GetCardChangesQueryValidator(IValidator<PaginationContext> paginationContextValidator)
    {
        RuleFor(query => query.CardId)
            .NotEmpty();

        RuleFor(query => query.PaginationContext)
            .SetValidator(paginationContextValidator!)
            .When(command => command.PaginationContext is not null);
    }
}
