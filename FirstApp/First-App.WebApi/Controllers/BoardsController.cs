using Ardalis.Result;
using Ardalis.Result.AspNetCore;
using First_App.Application.Commands.Board.Create;
using First_App.Application.Commands.Board.Delete;
using First_App.Application.Commands.Board.Update;
using First_App.Application.Common.Dtos;
using First_App.Application.Common.Dtos.Pagination;
using First_App.Application.Queries.Board.GetBoards;
using First_App.Application.Queries.Board.GetBoardWithGroups;
using First_App.Application.Queries.Change.GetChanges;
using First_App.WebApi.Responses;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace First_App.WebApi.Controllers;

[ApiController]
[Route("[controller]")]
[TranslateResultToActionResult]
public class BoardsController(IMediator mediator) : ControllerBase
{
    private readonly IMediator _mediator = mediator;

    [HttpPost]
    public async Task<Result<int>> Create([FromBody] CreateBoardCommand command,
                                          CancellationToken cancellationToken)
    {
        Result<int> result = await _mediator.Send(command, cancellationToken);

        return result;
    }

    [HttpPut("{id}")]
    public async Task<Result> Update(int id,
                                     [FromBody] UpdateBoardCommand command,
                                     CancellationToken cancellationToken)
    {
        if (id != command.Id)
            return Result.Invalid(new PutIdMismatchError());

        Result result = await _mediator.Send(command, cancellationToken);

        return result;
    }

    [HttpDelete("{id}")]
    public async Task<Result> Delete(int id,
                                     CancellationToken cancellationToken)
    {
        Result result = await _mediator.Send(new DeleteBoardCommand(id), cancellationToken);

        return result;
    }

    [HttpGet]
    public async Task<Result<List<BoardDto>>> GetBoards(CancellationToken cancellationToken)
    {
        Result<List<BoardDto>> result = await _mediator.Send(new GetBoardsQuery(),
                                                             cancellationToken);

        return result;
    }

    [HttpGet("{id}")]
    public async Task<Result<BoardWithGroupsDto>> GetBoardWithLists(int id,
                                                            [FromQuery] PaginationContext paginationContext,
                                                            CancellationToken cancellationToken)
    {
        paginationContext = paginationContext.PageNum == default
                         || paginationContext.PageSize == default
            ? null
            : paginationContext;

        Result<BoardWithGroupsDto> result =
            await _mediator.Send(new GetBoardWithGroupsQuery(id, paginationContext),
                                 cancellationToken);

        return result;
    }

    [HttpGet("{id}/changes")]
    public async Task<Result<Paginated<ChangeDto>>> GetChanges(int id,
                                                               [FromQuery] PaginationContext paginationContext,
                                                               CancellationToken cancellationToken)
    {
        paginationContext = paginationContext.PageNum == default
                         || paginationContext.PageSize == default
            ? null
            : paginationContext;

        var result =
            await _mediator.Send(new GetChangesQuery(id, paginationContext),
                                 cancellationToken);

        return result;
    }
}
