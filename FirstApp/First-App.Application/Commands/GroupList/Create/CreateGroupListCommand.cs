using Ardalis.Result;
using AutoMapper;
using First_App.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace First_App.Application.Commands.GroupList.Create;

public record CreateGroupListCommand(string Name, int BoardId) : IRequest<Result<int>>;

public class CreateGroupListHandler(AppDbContext context, IMapper mapper)
    : IRequestHandler<CreateGroupListCommand, Result<int>>
{
    private readonly AppDbContext _context = context;
    private readonly IMapper _mapper = mapper;

    public async Task<Result<int>> Handle(CreateGroupListCommand request, CancellationToken cancellationToken)
    {
        bool isBoardExist = await _context.Boards
            .AnyAsync(board => board.Id == request.BoardId, cancellationToken);

        if (!isBoardExist)
            return Result<int>.Conflict(nameof(Core.Entities.Board));

        var newEntity = _mapper.Map<Core.Entities.GroupList>(request);

        await _context.AddAsync(newEntity, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        return Result<int>.Success(newEntity.Id);
    }
}
