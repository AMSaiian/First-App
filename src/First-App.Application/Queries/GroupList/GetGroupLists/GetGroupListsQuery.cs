using Ardalis.Result;
using AutoMapper;
using First_App.Application.Common.Dtos;
using First_App.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace First_App.Application.Queries.GroupList.GetGroupLists;

public record GetGroupListsQuery : IRequest<Result<List<GroupListDto>>>;

public class GetGroupListsHandler(AppDbContext context, IMapper mapper)
    : IRequestHandler<GetGroupListsQuery, Result<List<GroupListDto>>>
{
    private readonly AppDbContext _context = context;
    private readonly IMapper _mapper = mapper;

    public async Task<Result<List<GroupListDto>>> Handle(GetGroupListsQuery request,
                                                         CancellationToken cancellationToken)
    {
        List<Core.Entities.GroupList> entities = await _context.GroupLists
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        List<GroupListDto> dtos = _mapper.Map<List<GroupListDto>>(entities);

        return Result.Success(dtos);
    }
}
