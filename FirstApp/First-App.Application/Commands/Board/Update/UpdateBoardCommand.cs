using Ardalis.Result;
using First_App.Application.Common.Errors;
using First_App.Infrastructure.Data;
using MediatR;

namespace First_App.Application.Commands.Board.Update;

public record UpdateBoardCommand(int Id, string Name) : IRequest<Result>;

public class UpdateBoardHandler(AppDbContext context) : IRequestHandler<UpdateBoardCommand, Result>
{
    private readonly AppDbContext _context = context;

    public async Task<Result> Handle(UpdateBoardCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Boards
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
