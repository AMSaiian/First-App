using Ardalis.Result;
using AutoMapper;
using First_App.Application.Common.Dtos;
using First_App.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace First_App.Application.Queries.Board.GetBoards;

public record GetBoardsQuery : IRequest<Result<List<BoardDto>>>;

public class GetBoardsHandler(AppDbContext context, IMapper mapper)
    : IRequestHandler<GetBoardsQuery, Result<List<BoardDto>>>
{
    private readonly AppDbContext _context = context;
    private readonly IMapper _mapper = mapper;

    public async Task<Result<List<BoardDto>>> Handle(GetBoardsQuery request, CancellationToken cancellationToken)
    {
        List<Core.Entities.Board> entities = await _context.Boards
            .AsNoTracking()
            .OrderBy(board => board.Id)
            .ToListAsync(cancellationToken);

        var boardDtos = _mapper.Map<List<BoardDto>>(entities);

        return Result<List<BoardDto>>.Success(boardDtos);
    }
}
