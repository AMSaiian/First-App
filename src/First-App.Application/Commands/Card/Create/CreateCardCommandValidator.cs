using First_App.Infrastructure.Data;
using FluentValidation;

namespace First_App.Application.Commands.Card.Create;

public class CreateCardCommandValidator : AbstractValidator<CreateCardCommand>
{
    public CreateCardCommandValidator()
    {
        RuleFor(command => command.Name)
            .NotEmpty()
            .MaximumLength(DataSchemeConstants.MaxNameLength);

        RuleFor(command => command.Description)
            .NotNull()
            .MaximumLength(DataSchemeConstants.MaxDescriptionLength);

        RuleFor(command => command.DueDate)
            .NotEmpty();

        RuleFor(command => command.GroupId)
            .NotEmpty();

        RuleFor(command => command.PriorityId)
            .NotEmpty();
    }
}
