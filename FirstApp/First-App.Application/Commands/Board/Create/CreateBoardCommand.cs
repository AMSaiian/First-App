using Ardalis.Result;
using AutoMapper;
using First_App.Infrastructure.Data;
using MediatR;

namespace First_App.Application.Commands.Board.Create;

public record CreateBoardCommand(string Name) : IRequest<Result<int>>;

public class CreateBoardHandler(AppDbContext context, IMapper mapper)
    : IRequestHandler<CreateBoardCommand, Result<int>>
{
    private readonly AppDbContext _context = context;
    private readonly IMapper _mapper = mapper;

    public async Task<Result<int>> Handle(CreateBoardCommand request,
                                          CancellationToken cancellationToken)
    {
        var newEntity = _mapper.Map<Core.Entities.Board>(request);

        await _context.AddAsync(newEntity, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        return Result<int>.Success(newEntity.Id);
    }
}
