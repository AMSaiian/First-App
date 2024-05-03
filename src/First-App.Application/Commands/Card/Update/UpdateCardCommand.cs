using Ardalis.Result;
using AutoMapper;
using First_App.Application.Common.Utils.CardChangeTracker;
using First_App.Infrastructure.Data;
using MediatR;

namespace First_App.Application.Commands.Card.Update;

public record UpdateCardCommand(int Id,
                                string? Name,
                                string? Description,
                                DateOnly? DueDate,
                                int? GroupId,
                                int? PriorityId)
    : IRequest<Result>,
      ICardUpdater;

public class UpdateCardHandler(AppDbContext context,
                               ICardChangeTracker tracker)
    : IRequestHandler<UpdateCardCommand, Result>
{
    private readonly AppDbContext _context = context;
    private readonly ICardChangeTracker _tracker = tracker;

    public async Task<Result> Handle(UpdateCardCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Cards
            .FindAsync(request.Id, cancellationToken);

        if (entity is null)
            return Result.NotFound(nameof(entity));

        Result updateResult = await _tracker
            .TrackUpdate(entity, request, cancellationToken);

        if (!updateResult.IsSuccess)
            return updateResult;

        await _context.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }
}

