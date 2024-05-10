using Ardalis.Result;
using First_App.Application.Common.Errors;
using First_App.Infrastructure.Data;
using MediatR;

namespace First_App.Application.Commands.GroupList.Update;

public record UpdateGroupListCommand(int Id, string Name) : IRequest<Result>;

public class UpdateGroupListHandler(AppDbContext context) : IRequestHandler<UpdateGroupListCommand, Result>
{
    private readonly AppDbContext _context = context;

    public async Task<Result> Handle(UpdateGroupListCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.GroupLists
            .FindAsync(request.Id, cancellationToken);

        if (entity is null)
            return Result.NotFound(nameof(entity));

        if (entity.Name == request.Name)
            return Result.Error(ErrorIdentifiers.NoChangesProvided);

        entity.Name = request.Name;

        await _context.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }
}
