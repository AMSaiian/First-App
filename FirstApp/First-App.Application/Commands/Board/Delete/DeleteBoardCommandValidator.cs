using FluentValidation;

namespace First_App.Application.Commands.Board.Delete;

public class DeleteBoardCommandValidator : AbstractValidator<DeleteBoardCommand>
{
    public DeleteBoardCommandValidator()
    {
        RuleFor(command => command.Id)
            .NotEmpty();
    }
}
