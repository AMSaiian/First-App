using First_App.Application.Common.Dtos.Pagination;
using FluentValidation;

namespace First_App.Application.Queries.GroupList.GetGroupCards;

public class GetGroupCardsQueryValidator : AbstractValidator<GetGroupCardsQuery>
{
    public GetGroupCardsQueryValidator(IValidator<PaginationContext> paginationContextValidator)
    {
        RuleFor(query => query.GroupId)
            .NotEmpty();

        RuleFor(query => query.PaginationContext)
            .SetValidator(paginationContextValidator)
            .When(query => query.PaginationContext is not null);
    }
}
