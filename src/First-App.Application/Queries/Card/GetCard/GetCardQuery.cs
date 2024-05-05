using Ardalis.Result;
using AutoMapper;
using First_App.Application.Common.Dtos;
using First_App.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace First_App.Application.Queries.Card.GetCard;

public record GetCardQuery(int Id) : IRequest<Result<CardDto>>;

public class GetCardHandler(AppDbContext context, IMapper mapper)
    : IRequestHandler<GetCardQuery, Result<CardDto>>
{
    private readonly AppDbContext _context = context;
    private readonly IMapper _mapper = mapper;

    public async Task<Result<CardDto>> Handle(GetCardQuery request, CancellationToken cancellationToken)
    {
        Core.Entities.Card? entity = await _context.Cards
            .AsNoTracking()
            .FirstOrDefaultAsync(entity => entity.Id == request.Id,
                                 cancellationToken);

        if (entity is null)
            return Result.NotFound(nameof(Card));

        var dto = _mapper.Map<CardDto>(entity);

        return Result.Success(dto);
    }
}
