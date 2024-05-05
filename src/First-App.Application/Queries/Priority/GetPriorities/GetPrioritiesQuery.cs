using Ardalis.Result;
using AutoMapper;
using First_App.Application.Common.Dtos;
using First_App.Infrastructure.Data;
using First_App.Shared;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace First_App.Application.Queries.Priority.GetPriorities;

public record GetPrioritiesQuery : IRequest<Result<List<PriorityDto>>>;

public class GetPrioritiesHandler(AppDbContext context, IMapper mapper) 
    : IRequestHandler<GetPrioritiesQuery, Result<List<PriorityDto>>>
{
    private readonly AppDbContext _context = context;
    private readonly IMapper _mapper = mapper;
    
    public async Task<Result<List<PriorityDto>>> Handle(GetPrioritiesQuery request, 
                                                        CancellationToken cancellationToken)
    {
        List<Core.Entities.Priority> entities = await _context.Priorities
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        if (entities.Count == 0)
            throw new RequiredDataNotFoundException(nameof(Core.Entities.Priority));

        List<PriorityDto> dtos = _mapper.Map<List<PriorityDto>>(entities);
        
        return Result.Success(dtos);
    }
}
