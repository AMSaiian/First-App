using Ardalis.Result;
using Ardalis.Result.AspNetCore;
using First_App.Application.Common.Dtos;
using First_App.Application.Queries.Priority.GetPriorities;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace First_App.WebApi.Controllers;

[ApiController]
[Route("[controller]")]
[TranslateResultToActionResult]
public class PrioritiesController(IMediator mediator) : ControllerBase
{
    private readonly IMediator _mediator = mediator;

    [HttpGet]
    public async Task<Result<List<PriorityDto>>> Get()
    {
        Result<List<PriorityDto>> result = await _mediator.Send(new GetPrioritiesQuery());

        return result;
    }
}
