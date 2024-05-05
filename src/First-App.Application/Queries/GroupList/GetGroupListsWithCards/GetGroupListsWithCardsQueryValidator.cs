using First_App.Application.Common.Dtos.Pagination;
using FluentValidation;

namespace First_App.Application.Queries.GroupList.GetGroupListsWithCards;

public class GetGroupListsWithCardsQueryValidator
    : AbstractValidator<GetGroupListsWithCardsQuery>
{
    public GetGroupListsWithCardsQueryValidator(IValidator<PaginationContext> paginationContextValidator)
    {
        RuleFor(query => query.PaginationContext)
            .SetValidator(paginationContextValidator)
            .When(query => query.PaginationContext is not null);
    }
}
