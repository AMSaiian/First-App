using Ardalis.Result;
using AutoMapper;
using First_App.Application.Common.Utils.CardChangeTracker;
using First_App.Core.Entities;
using First_App.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace First_App.Application.Commands.Card.Create;

public record CreateCardCommand(string Name,
                                string Description,
                                DateOnly DueDate,
                                int GroupId,
                                int PriorityId)
    : IRequest<Result<int>>;

public class CreateCardHandler(AppDbContext context,
                               ICardChangeTracker tracker,
                               IMapper mapper)
    : IRequestHandler<CreateCardCommand, Result<int>>
{
    private readonly AppDbContext _context = context;
    private readonly ICardChangeTracker _tracker = tracker;
    private readonly IMapper _mapper = mapper;

    public async Task<Result<int>> Handle(CreateCardCommand request, CancellationToken cancellationToken)
    {
        bool isPriorityExist = await _context.Priorities
            .AnyAsync(p => p.Id == request.PriorityId,
                      cancellationToken);
        if (!isPriorityExist)
            return Result<int>.Conflict(nameof(Priority));

        bool isGroupExist = await _context.GroupLists
            .AnyAsync(gl => gl.Id == request.GroupId,
                      cancellationToken);
        if (!isGroupExist)
            return Result<int>.Conflict(nameof(GroupList));

        var newEntity = _mapper.Map<Core.Entities.Card>(request);
        await _tracker.TrackCreate(newEntity, cancellationToken);
        await _context.AddAsync(newEntity, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        return Result.Success(newEntity.Id);
    }
}
