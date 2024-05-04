using Ardalis.Result;
using Ardalis.Result.AspNetCore;
using First_App.Application.Commands.Card.Create;
using First_App.Application.Commands.Card.Update;
using First_App.Core.Entities;
using First_App.Shared;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace First_App.WebApi.Controllers;

[ApiController]
[Route("[controller]")]
public class CardController(IMediator mediator) : ControllerBase
{
    private readonly IMediator _mediator = mediator;

    [HttpPost]
    [TranslateResultToActionResult]
    public async Task<Result<int>> CreateCard([FromBody] CreateCardCommand command,
                                              CancellationToken cancellationToken)
    {
        Result<int> result = await _mediator.Send(command, cancellationToken);

        return result;
    }

    [HttpPut]
    [TranslateResultToActionResult]
    public async Task<Result> UpdateCard([FromBody] UpdateCardCommand command,
                                         CancellationToken cancellationToken)
    {
        Result result = await _mediator.Send(command, cancellationToken);

        return result;
    }
}
