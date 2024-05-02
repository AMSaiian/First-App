using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace First_App.Infrastructure.Data;

public static class ApplicationExtensions
{
    public static IServiceCollection AddAppDbContext(this IServiceCollection services, string connectionString)
    {
        services.AddDbContext<AppDbContext>(options => options.UseNpgsql(connectionString));

        return services;
    }
}
