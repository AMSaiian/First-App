using Ardalis.Result;
using Ardalis.Result.AspNetCore;
using First_App.Application.Common.Dtos;
using First_App.Application.Common.Dtos.Pagination;
using First_App.Application.Queries.Change.GetChanges;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace First_App.WebApi.Controllers;

[ApiController]
[Route("[controller]")]
[TranslateResultToActionResult]
public class ChangesController(IMediator mediator) : ControllerBase
{
    private readonly IMediator _mediator = mediator;

    [HttpGet]
    public async Task<Result<Paginated<ChangeDto>>> Get([FromQuery] PaginationContext paginationContext,
                                                        CancellationToken cancellationToken)
    {
        paginationContext = paginationContext.PageNum == default
                         || paginationContext.PageSize == default
            ? null
            : paginationContext;

        var result =
            await _mediator.Send(new GetChangesQuery(paginationContext),
                                 cancellationToken);

        return result;
    }
}
