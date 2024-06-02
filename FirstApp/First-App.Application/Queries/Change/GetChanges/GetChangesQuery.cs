using Ardalis.Result;
using AutoMapper;
using First_App.Application.Common.Dtos;
using First_App.Application.Common.Dtos.Pagination;
using First_App.Application.Common.HandlerBase;
using First_App.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace First_App.Application.Queries.Change.GetChanges;

public record GetChangesQuery(int BoardId, PaginationContext? PaginationContext)
    : IRequest<Result<Paginated<ChangeDto>>>;

public class GetChangesHandler(AppDbContext context, IMapper mapper)
    : PaginatedQueryHandlerBase,
      IRequestHandler<GetChangesQuery, Result<Paginated<ChangeDto>>>
{
    private readonly AppDbContext _context = context;
    private readonly IMapper _mapper = mapper;


    public async Task<Result<Paginated<ChangeDto>>> Handle(GetChangesQuery request,
                                                           CancellationToken cancellationToken)
    {
        bool isBoardExists = await _context.Boards
            .AnyAsync(board => board.Id == request.BoardId,
                      cancellationToken);

        if (!isBoardExists)
            return Result<Paginated<ChangeDto>>.Conflict(nameof(Board));

        var changesQuery = _context.Changes
            .Where(c => c.AffectedBoardId == request.BoardId)
            .Include(c => c.Type)
            .Include(c => c.Parameters)
            .AsNoTracking();

        var paginatedEntities = await ProcessPagination(changesQuery,
                                                        change => change.Time,
                                                        request.PaginationContext);

        List<ChangeDto> dtos = _mapper.Map<List<ChangeDto>>(paginatedEntities.Entities);

        return Result<Paginated<ChangeDto>>
            .Success(new(dtos, paginatedEntities.PagedInfo));
    }
}
