using First_App.Core.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace First_App.Infrastructure.Data.Configurations;

public class ChangeConfiguration : BaseEntityConfiguration<Change>
{
    public override void Configure(EntityTypeBuilder<Change> builder)
    {
        base.Configure(builder);

        builder.HasMany(c => c.Parameters)
            .WithOne(cp => cp.Change)
            .HasForeignKey(cp => cp.ChangeId)
            .IsRequired(true);
    }
}
