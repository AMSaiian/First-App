using Ardalis.Result;
using First_App.Application.Common.Utils.CardChangeWithTracker;
using First_App.Infrastructure.Data;
using MediatR;

namespace First_App.Application.Commands.Card.Delete;

public record DeleteCardCommand(int Id) : IRequest<Result>;

public class DeleteCardHandler(AppDbContext context, ICardChangeWithTracker cardChanger)
    : IRequestHandler<DeleteCardCommand, Result>
{
    private readonly AppDbContext _context = context;
    private readonly ICardChangeWithTracker _cardChanger = cardChanger;

    public async Task<Result> Handle(DeleteCardCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Cards
            .FindAsync(request.Id, cancellationToken);

        if (entity is null)
            return Result.NotFound(nameof(entity));

        await _cardChanger.Delete(entity, cancellationToken);
        _context.Cards.Remove(entity);

        await _context.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }
}
