using First_App.Core.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace First_App.Infrastructure.Data.Configurations;

public class ChangeParameterConfiguration : BaseEntityConfiguration<ChangeParameter>
{
    public override void Configure(EntityTypeBuilder<ChangeParameter> builder)
    {
        base.Configure(builder);

        builder.Property(cp => cp.Name)
            .HasMaxLength(DataSchemeConstants.MaxNameLength);

        builder.Property(cp => cp.Value)
            .HasMaxLength(DataSchemeConstants.MaxNameLength);

        builder.HasIndex(cp => new { cp.Name, cp.ChangeId })
            .IsUnique(true);
    }
}
