using Ardalis.Result;
using AutoMapper;
using First_App.Application.Common.Dtos;
using First_App.Application.Common.Dtos.Pagination;
using First_App.Application.Common.HandlerBase;
using First_App.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace First_App.Application.Queries.GroupList.GetGroupCards;

public record GetGroupCardsQuery(int GroupId, PaginationContext? PaginationContext)
    : IRequest<Result<Paginated<CardDto>>>;


public class GetGroupCardsHandler(AppDbContext context, IMapper mapper)
    : PaginatedQueryHandlerBase,
      IRequestHandler<GetGroupCardsQuery, Result<Paginated<CardDto>>>
{
    private readonly AppDbContext _context = context;
    private readonly IMapper _mapper = mapper;


    public async Task<Result<Paginated<CardDto>>> Handle(GetGroupCardsQuery request,
                                                         CancellationToken cancellationToken)
    {
        var groupListEntity = await _context.GroupLists
            .AsNoTracking()
            .FirstOrDefaultAsync(groupList => groupList.Id == request.GroupId,
                                 cancellationToken);

        if (groupListEntity is null)
            return Result.NotFound(nameof(Core.Entities.GroupList));

        var cardsQuery = _context.GroupLists
            .Entry(groupListEntity)
            .Collection(entry => entry.Cards)
            .Query()
            .AsNoTracking();

        var paginatedEntities = await ProcessPagination(cardsQuery,
                                                        card => card.DueDate,
                                                        request.PaginationContext);

        var dtos = _mapper.Map<List<CardDto>>(paginatedEntities.Entities);

        return Result<Paginated<CardDto>>
            .Success(new(dtos, paginatedEntities.PagedInfo));
    }
}
