using First_App.Core.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace First_App.Infrastructure.Data.Configurations;

public class PriorityConfiguration : BaseEntityConfiguration<Priority>
{
    public override void Configure(EntityTypeBuilder<Priority> builder)
    {
        base.Configure(builder);

        builder.Property(p => p.Title)
            .HasMaxLength(DataSchemeConstants.MaxNameLength);

        builder.HasIndex(p => p.Title)
            .IsUnique(true);

        builder.HasMany(p => p.Cards)
            .WithOne(c => c.Priority)
            .HasForeignKey(c => c.PriorityId)
            .IsRequired(true);
    }
}
