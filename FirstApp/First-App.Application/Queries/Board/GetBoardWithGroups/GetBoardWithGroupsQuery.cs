using Ardalis.Result;
using AutoMapper;
using First_App.Application.Common.Dtos;
using First_App.Application.Common.Dtos.Pagination;
using First_App.Application.Common.HandlerBase;
using First_App.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace First_App.Application.Queries.Board.GetBoardWithGroups;

public record GetBoardWithGroupsQuery(int Id, PaginationContext? PaginationContext)
    : IRequest<Result<BoardWithGroupsDto>>;

public class GetBoardWithGroupsHandler(AppDbContext context, IMapper mapper)
    : PaginatedQueryHandlerBase,
      IRequestHandler<GetBoardWithGroupsQuery, Result<BoardWithGroupsDto>>
{
    private readonly AppDbContext _context = context;
    private readonly IMapper _mapper = mapper;

    public async Task<Result<BoardWithGroupsDto>> Handle(GetBoardWithGroupsQuery request,
                                                         CancellationToken cancellationToken)
    {
        Core.Entities.Board? board = await _context.Boards
            .AsNoTracking()
            .Include(board => board.GroupLists)
            .FirstOrDefaultAsync(board => board.Id == request.Id,
                                 cancellationToken);

        if (board is null)
            return Result<BoardWithGroupsDto>.NotFound(nameof(Core.Entities.Board));

        List<GroupListWithCardsDto> groupListWithCardDtos = [];

        foreach (var entity in board.GroupLists.OrderBy(groupList => groupList.Id))
        {
            var entityCardsQuery = _context.GroupLists
                .Entry(entity)
                .Collection(groupList => groupList.Cards)
                .Query()
                .AsNoTracking();

            var paginatedCards = await ProcessPagination(entityCardsQuery,
                                                         card => card.DueDate,
                                                         request.PaginationContext);

            var cardDtosWithPagination = new Paginated<CardDto>(
                _mapper.Map<List<CardDto>>(paginatedCards.Entities),
                paginatedCards.PagedInfo);

            var groupListWithCardDto =
                new GroupListWithCardsDto(entity.Id,
                                          entity.Name,
                                          cardDtosWithPagination);

            groupListWithCardDtos.Add(groupListWithCardDto);
        }

        BoardWithGroupsDto boardWithGroupsDto = new(board.Id,
                                board.Name,
                                groupListWithCardDtos);

        return Result.Success(boardWithGroupsDto);
    }
}
