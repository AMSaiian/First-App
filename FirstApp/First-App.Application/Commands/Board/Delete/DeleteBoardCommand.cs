using Ardalis.Result;
using First_App.Application.Common.Utils.CardChangeWithTracker;
using First_App.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace First_App.Application.Commands.Board.Delete;

public record DeleteBoardCommand(int Id) : IRequest<Result>;

public class DeleteBoardHandler(AppDbContext context,
                                ICardChangeWithTracker cardChanger)
    : IRequestHandler<DeleteBoardCommand, Result>
{
    private readonly AppDbContext _context = context;
    private readonly ICardChangeWithTracker _cardChanger = cardChanger;

    public async Task<Result> Handle(DeleteBoardCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Boards
            .Include(board => board.GroupLists)
            .ThenInclude(groupList => groupList.Cards)
            .FirstOrDefaultAsync(board => board.Id == request.Id, cancellationToken);

        if (entity is null)
            return Result.NotFound(nameof(Board));

        var cardsToDelete = entity.GroupLists
            .SelectMany(groupLists => groupLists.Cards)
            .ToList();

        foreach (var card in cardsToDelete)
        {
            await _cardChanger.Delete(card, cancellationToken);
        }

        _context.Cards.RemoveRange(cardsToDelete);
        _context.Boards.Remove(entity);

        await _context.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }
}
