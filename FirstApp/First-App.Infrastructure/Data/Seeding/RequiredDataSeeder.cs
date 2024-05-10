using First_App.Core;
using First_App.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace First_App.Infrastructure.Data.Seeding;

public static class RequiredDataSeeder
{
    private static readonly List<Priority> Priorities =
    [
        new() { Title = "To Do" },
        new() { Title = "In Progress" },
        new() { Title = "Done" }
    ];

    private static readonly List<ChangeType> ChangeTypes =
    [
        new() { Name = ChangeCardConstants.CreateCard },
        new() { Name = ChangeCardConstants.DeleteCard },
        new() { Name = ChangeCardConstants.UpdateName },
        new() { Name = ChangeCardConstants.UpdateDescription },
        new() { Name = ChangeCardConstants.UpdateGroup },
        new() { Name = ChangeCardConstants.UpdatePriority },
        new() { Name = ChangeCardConstants.UpdateDueDate }
    ];

    public static async Task PopulateDbContext(AppDbContext dbContext)
    {
        await dbContext.Database.EnsureCreatedAsync();

        if (await dbContext.Priorities.CountAsync() == 0)
            await dbContext.Priorities.AddRangeAsync(Priorities);

        if (await dbContext.ChangeTypes.CountAsync() == 0)
            await dbContext.ChangeTypes.AddRangeAsync(ChangeTypes);

        await dbContext.SaveChangesAsync();
    }
}
