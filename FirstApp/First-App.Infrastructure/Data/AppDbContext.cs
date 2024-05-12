using System.Reflection;
using First_App.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace First_App.Infrastructure.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Board> Boards { get; set; }

    public DbSet<Card> Cards { get; set; }

    public DbSet<GroupList> GroupLists { get; set; }

    public DbSet<Priority> Priorities { get; set; }

    public DbSet<Change> Changes { get; set; }

    public DbSet<ChangeType> ChangeTypes { get; set; }

    public DbSet<ChangeParameter> ChangeParameters { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        base.OnModelCreating(modelBuilder);
    }
}
