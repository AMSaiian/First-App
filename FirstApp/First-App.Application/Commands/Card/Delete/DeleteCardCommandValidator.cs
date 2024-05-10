using FluentValidation;

namespace First_App.Application.Commands.Card.Delete;

public class DeleteCardCommandValidator : AbstractValidator<DeleteCardCommand>
{
    public DeleteCardCommandValidator()
    {
        RuleFor(command => command.Id)
            .NotEmpty();
    }
}
