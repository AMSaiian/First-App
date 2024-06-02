using First_App.Infrastructure.Data;
using FluentValidation;

namespace First_App.Application.Commands.Board.Create;

public class CreateBoardCommandValidator: AbstractValidator<CreateBoardCommand>
{
    public CreateBoardCommandValidator()
    {
        RuleFor(command => command.Name)
            .NotEmpty()
            .MaximumLength(DataSchemeConstants.MaxNameLength);
    }
}
