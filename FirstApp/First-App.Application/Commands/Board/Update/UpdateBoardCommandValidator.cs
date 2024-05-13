using First_App.Infrastructure.Data;
using FluentValidation;

namespace First_App.Application.Commands.Board.Update;

public class UpdateBoardCommandValidator : AbstractValidator<UpdateBoardCommand>
{
    public UpdateBoardCommandValidator()
    {
        RuleFor(command => command.Id)
            .NotEmpty();

        RuleFor(command => command.Name)
            .NotEmpty()
            .MaximumLength(DataSchemeConstants.MaxNameLength);
    }
}
