using Ardalis.Result;
using AutoMapper;
using First_App.Application.Common.Dtos;
using First_App.Application.Common.Dtos.Pagination;
using First_App.Application.Common.HandlerBase;
using First_App.Core.Entities;
using First_App.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace First_App.Application.Queries.Change;

public record GetCardChangesQuery(int CardId, PaginationContext? PaginationContext)
    : IRequest<Result<Paginated<ChangeDto>>>;

public class GetCardChangesHandler(AppDbContext context, IMapper mapper)
    : PaginatedQueryHandlerBase,
      IRequestHandler<GetCardChangesQuery, Result<Paginated<ChangeDto>>>
{
    private readonly AppDbContext _context = context;
    private readonly IMapper _mapper = mapper;

    public async Task<Result<Paginated<ChangeDto>>> Handle(GetCardChangesQuery request,
                                                           CancellationToken cancellationToken)
    {
        Card? cardEntity = await _context.Cards.FindAsync(request.CardId, cancellationToken);

        if (cardEntity is null)
        {
            return Result<Paginated<ChangeDto>>.NotFound(nameof(Card));
        }

        var changesQuery = _context
            .Entry(cardEntity)
            .Collection(entry => entry.ChangeHistory)
            .Query()
            .AsNoTracking()
            .Include(change => change.Type)
            .Include(change => change.Parameters);

        var paginatedEntities = await ProcessPagination(changesQuery,
                                                        change => change.Time,
                                                        request.PaginationContext);

        List<ChangeDto> dtos = _mapper.Map<List<ChangeDto>>(paginatedEntities.Entities);

        return Result<Paginated<ChangeDto>>
            .Success(new(dtos, paginatedEntities.PagedInfo));
    }
}
