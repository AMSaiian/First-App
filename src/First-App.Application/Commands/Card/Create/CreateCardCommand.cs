using Ardalis.Result;
using AutoMapper;
using First_App.Application.Common.Utils.CardChangeWithTracker;
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
                               ICardChangeWithTracker cardChanger,
                               IMapper mapper)
    : IRequestHandler<CreateCardCommand, Result<int>>
{
    private readonly AppDbContext _context = context;
    private readonly ICardChangeWithTracker _cardChanger = cardChanger;
    private readonly IMapper _mapper = mapper;

    public async Task<Result<int>> Handle(CreateCardCommand request, CancellationToken cancellationToken)
    {
        var newEntity = _mapper.Map<Core.Entities.Card>(request);
        var createResult = await _cardChanger.Create(newEntity, cancellationToken);

        if (!createResult.IsSuccess)
            return createResult;

        await _context.AddAsync(newEntity, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
        return Result.Success(newEntity.Id);
    }
}
