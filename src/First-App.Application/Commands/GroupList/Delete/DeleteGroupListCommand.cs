using Ardalis.Result;
using First_App.Application.Common.Utils.CardChangeWithTracker;
using First_App.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace First_App.Application.Commands.GroupList.Delete;

public record DeleteGroupListCommand(int Id) : IRequest<Result>;

public class DeleteGroupListHandler(AppDbContext context,
                                    ICardChangeWithTracker cardChanger)
    : IRequestHandler<DeleteGroupListCommand, Result>
{
    private readonly AppDbContext _context = context;
    private readonly ICardChangeWithTracker _cardChanger = cardChanger;

    public async Task<Result> Handle(DeleteGroupListCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.GroupLists
            .Include(gl => gl.Cards)
            .FirstOrDefaultAsync(gl => gl.Id == request.Id,
                                 cancellationToken);

        if (entity is null)
            return Result.NotFound(nameof(entity));

        foreach (var card in entity.Cards)
            await _cardChanger.Delete(card, cancellationToken);

        _context.Cards.RemoveRange(entity.Cards);
        _context.GroupLists.Remove(entity);

        await _context.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }
}
