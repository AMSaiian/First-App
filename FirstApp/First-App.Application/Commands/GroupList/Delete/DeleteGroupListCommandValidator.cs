using FluentValidation;

namespace First_App.Application.Commands.GroupList.Delete;

public class DeleteGroupListCommandValidator : AbstractValidator<DeleteGroupListCommand>
{
    public DeleteGroupListCommandValidator()
    {
        RuleFor(command => command.Id)
            .NotEmpty();
    }
}
