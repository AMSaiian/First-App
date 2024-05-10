using System.Net;
using Ardalis.Result;
using Ardalis.Result.AspNetCore;
using First_App.WebApi.Responses;

namespace First_App.WebApi;

public static class ApplicationExtensions
{
    public static IServiceCollection AddControllerWithResultMapping(this IServiceCollection services)
    {
        services
            .AddRouting(options =>
            {
                options.LowercaseUrls = true;
                options.LowercaseQueryStrings = true;
            })
            .AddControllers(mvcOptions =>
            {
                mvcOptions.AddResultConvention(resultStatusMap =>
                {
                    resultStatusMap.AddDefaultMap()
                        .For(ResultStatus.Error, HttpStatusCode.UnprocessableEntity,
                             resultStatusOptions =>
                             {
                                 resultStatusOptions.With(
                                     (_, result) =>
                                         new ErrorResponse(
                                             ErrorTitles.ErrorTitle,
                                             (int)HttpStatusCode.UnprocessableEntity,
                                             result.Errors.ToList())
                                 );
                             }
                        )
                        .For(ResultStatus.Conflict, HttpStatusCode.Conflict,
                             resultStatusOptions =>
                             {
                                 resultStatusOptions.With(
                                     (_, result) =>
                                         new ErrorResponse(
                                             ErrorTitles.ConflictTitle,
                                             (int)HttpStatusCode.Conflict,
                                             result.Errors.ToList())
                                 );
                             }
                        )
                        .For(ResultStatus.NotFound, HttpStatusCode.NotFound,
                             resultStatusOptions =>
                             {
                                 resultStatusOptions.With(
                                     (_, result) =>
                                         new ErrorResponse(
                                             ErrorTitles.NotFoundTitle,
                                             (int)HttpStatusCode.NotFound,
                                             result.Errors.ToList())
                                 );
                             }
                        );
                });
            });

        return services;
    }
}
