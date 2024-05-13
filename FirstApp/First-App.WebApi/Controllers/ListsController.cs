using Ardalis.Result;
using Ardalis.Result.AspNetCore;
using First_App.Application.Commands.GroupList.Create;
using First_App.Application.Commands.GroupList.Delete;
using First_App.Application.Commands.GroupList.Update;
using First_App.Application.Common.Dtos;
using First_App.Application.Common.Dtos.Pagination;
using First_App.Application.Queries.GroupList.GetGroupCards;
using First_App.WebApi.Responses;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace First_App.WebApi.Controllers;

[ApiController]
[Route("[controller]")]
[TranslateResultToActionResult]
public class ListsController(IMediator mediator) : ControllerBase
{
    private readonly IMediator _mediator = mediator;

    [HttpPost]
    public async Task<Result<int>> Create([FromBody] CreateGroupListCommand command,
                                          CancellationToken cancellationToken)
    {
        Result<int> result = await _mediator.Send(command, cancellationToken);

        return result;
    }

    [HttpPut("{id}")]
    public async Task<Result> Update(int id,
                                     [FromBody] UpdateGroupListCommand command,
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
        Result result = await _mediator.Send(new DeleteGroupListCommand(id), cancellationToken);

        return result;
    }

    [HttpGet("{id}/cards")]
    public async Task<Result<Paginated<CardDto>>> GetCards(int id,
                                                          [FromQuery] PaginationContext paginationContext,
                                                          CancellationToken cancellationToken)
    {
        paginationContext = paginationContext.PageNum == default
                         || paginationContext.PageSize == default
            ? null
            : paginationContext;

        Result<Paginated<CardDto>> result =
            await _mediator.Send(new GetGroupCardsQuery(id, paginationContext),
                                 cancellationToken);

        return result;
    }
}
