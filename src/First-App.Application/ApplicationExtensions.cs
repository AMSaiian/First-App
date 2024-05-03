using System.Reflection;
using First_App.Application.Common.Behaviour;
using First_App.Application.Common.Utils.CardChangeTracker;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;

namespace First_App.Application;

public static class ApplicationExtensions
{
    public static IServiceCollection AddHandlersAndBehaviour(this IServiceCollection services)
    {
        services.AddMediatR(options =>
        {
            options.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly());
            options.AddOpenBehavior(typeof(LoggingBehaviour<,>));
            options.AddOpenBehavior(typeof(ValidationBehaviour<,>));
        });

        services.AddScoped<ICardChangeTracker, CardChangeTracker>();

        return services;
    }

    public static IServiceCollection AddFluentValidators(this IServiceCollection services)
    {
        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

        return services;
    }

    public static IServiceCollection AddMapping(this IServiceCollection services)
    {
        services.AddAutoMapper(configuration => configuration.AddMaps(Assembly.GetExecutingAssembly()));

        return services;
    }
}
