using First_App.Infrastructure.Data.Interceptors;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.DependencyInjection;

namespace First_App.Infrastructure.Data;

public static class ApplicationExtensions
{
    public static IServiceCollection AddAppDbContext(this IServiceCollection services,
                                                     string connectionString)
    {
        services.AddScoped<SaveChangesInterceptor, SoftDeleteInterceptor>();

        services.AddDbContext<AppDbContext>((provider, options) =>
        {
            options
                .UseNpgsql(connectionString)
                .AddInterceptors(provider.GetRequiredService<SaveChangesInterceptor>());
        });

        return services;
    }
}
