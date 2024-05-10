using First_App.Infrastructure.Data;
using FluentValidation;

namespace First_App.Application.Commands.GroupList.Create;

public class CreateGroupListCommandValidator : AbstractValidator<CreateGroupListCommand>
{
    public CreateGroupListCommandValidator()
    {
        RuleFor(command => command.Name)
            .NotEmpty()
            .MaximumLength(DataSchemeConstants.MaxNameLength);
    }
}
