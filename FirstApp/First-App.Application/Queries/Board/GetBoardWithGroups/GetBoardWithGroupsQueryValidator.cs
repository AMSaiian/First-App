using First_App.Application.Common.Dtos.Pagination;
using FluentValidation;

namespace First_App.Application.Queries.Board.GetBoardWithGroups;

public class GetBoardWithGroupsQueryValidator
    : AbstractValidator<GetBoardWithGroupsQuery>
{
    public GetBoardWithGroupsQueryValidator(IValidator<PaginationContext> paginationContextValidator)
    {
        RuleFor(query => query.Id)
            .NotEmpty();

        RuleFor(query => query.PaginationContext)
            .SetValidator(paginationContextValidator)
            .When(query => query.PaginationContext is not null);
    }
}
