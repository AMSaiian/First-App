using First_App.Infrastructure.Data;
using FluentValidation;

namespace First_App.Application.Commands.GroupList.Update;

public class UpdateGroupListCommandValidator : AbstractValidator<UpdateGroupListCommand>
{
    public UpdateGroupListCommandValidator()
    {
        RuleFor(command => command.Id)
            .NotEmpty();

        RuleFor(command => command.Name)
            .NotEmpty()
            .MaximumLength(DataSchemeConstants.MaxNameLength);
    }
}
