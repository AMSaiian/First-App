using First_App.Infrastructure.Data;
using FluentValidation;

namespace First_App.Application.Commands.Card.Update;

public class UpdateCardCommandValidator : AbstractValidator<UpdateCardCommand>
{
    public UpdateCardCommandValidator()
    {
        RuleFor(command => command)
            .Must(command => command.Name is not null
                          || command.Description is not null
                          || command.DueDate is not null
                          || command.PriorityId is not null
                          || command.GroupId is not null)
            .DependentRules(() =>
            {
                RuleFor(command => command.Id)
                    .NotEmpty();

                RuleFor(command => command.Name)
                    .NotEmpty()
                    .When(command => command.Name is not null)
                    .MaximumLength(DataSchemeConstants.MaxNameLength);

                RuleFor(command => command.Description)
                    .MaximumLength(DataSchemeConstants.MaxDescriptionLength)
                    .When(command => command.Description is not null);

                RuleFor(command => command.DueDate)
                    .NotEmpty()
                    .When(command => command.DueDate is not null);
            });
    }
}
