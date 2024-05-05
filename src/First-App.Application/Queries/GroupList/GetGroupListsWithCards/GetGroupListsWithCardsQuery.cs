using Ardalis.Result;
using AutoMapper;
using First_App.Application.Common.Dtos;
using First_App.Application.Common.Dtos.Pagination;
using First_App.Application.Common.HandlerBase;
using First_App.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace First_App.Application.Queries.GroupList.GetGroupListsWithCards;

public record GetGroupListsWithCardsQuery(PaginationContext? PaginationContext)
    : IRequest<Result<List<GroupListWithCardsDto>>>;

public class GetGroupListsWithCardsHandler(AppDbContext context, IMapper mapper)
    : PaginatedQueryHandlerBase,
      IRequestHandler<GetGroupListsWithCardsQuery, Result<List<GroupListWithCardsDto>>>
{
    private readonly AppDbContext _context = context;
    private readonly IMapper _mapper = mapper;

    public async Task<Result<List<GroupListWithCardsDto>>> Handle(GetGroupListsWithCardsQuery request,
                                                                  CancellationToken cancellationToken)
    {
        List<Core.Entities.GroupList> entities = await _context.GroupLists
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        List<GroupListWithCardsDto> groupListWithCardDtos = [];

        foreach (var entity in entities)
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
                paginatedCards.PagedInfo) ;

            var groupListWithCardDto = _mapper.Map<GroupListWithCardsDto>(entity);
            _mapper.Map(cardDtosWithPagination, groupListWithCardDto);
            groupListWithCardDtos.Add(groupListWithCardDto);
        }

        return Result.Success(groupListWithCardDtos);
    }
}
