using Ardalis.Result;
using Ardalis.Result.AspNetCore;
using First_App.Application.Commands.Card.Create;
using First_App.Application.Commands.Card.Delete;
using First_App.Application.Commands.Card.Update;
using First_App.Application.Common.Dtos;
using First_App.Application.Common.Dtos.Pagination;
using First_App.Application.Queries.Card.GetCard;
using First_App.Application.Queries.Card.GetCardChanges;
using First_App.WebApi.Responses;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace First_App.WebApi.Controllers;

[ApiController]
[Route("[controller]")]
[TranslateResultToActionResult]
public class CardsController(IMediator mediator) : ControllerBase
{
    private readonly IMediator _mediator = mediator;

    [HttpGet("{id}")]
    public async Task<Result<CardDto>> Get(int id,
                                           CancellationToken cancellationToken)
    {
        Result<CardDto> result = await _mediator.Send(new GetCardQuery(id), cancellationToken);

        return result;
    }

    [HttpPost]
    public async Task<Result<int>> Create([FromBody] CreateCardCommand command,
                                          CancellationToken cancellationToken)
    {
        Result<int> result = await _mediator.Send(command, cancellationToken);

        return result;
    }

    [HttpPut("{id}")]
    public async Task<Result> Update(int id,
                                     [FromBody] UpdateCardCommand command,
                                     CancellationToken cancellationToken)
    {
        if (id != command.Id)
            return Result.Invalid(new PutIdMismatchError());

        Result result = await _mediator.Send(command, cancellationToken);

        return result;
    }

    [HttpDelete]
    public async Task<Result> Delete(int id,
                                     CancellationToken cancellationToken)
    {
        Result result = await _mediator.Send(new DeleteCardCommand(id), cancellationToken);

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

        Result<Paginated<ChangeDto>> result =
            await _mediator.Send(new GetCardChangesQuery(id, paginationContext), cancellationToken);

        return result;
    }
}
