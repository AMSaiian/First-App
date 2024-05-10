using FluentValidation;

namespace First_App.Application.Queries.Card.GetCard;

public class GetCardQueryValidator : AbstractValidator<GetCardQuery>
{
    public GetCardQueryValidator()
    {
        RuleFor(query => query.Id)
            .NotEmpty();
    }
}
