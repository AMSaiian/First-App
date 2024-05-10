using First_App.Core.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace First_App.Infrastructure.Data.Configurations;

public class ChangeTypeConfiguration : BaseEntityConfiguration<ChangeType>
{
    public override void Configure(EntityTypeBuilder<ChangeType> builder)
    {
        base.Configure(builder);

        builder.Property(ct => ct.Name)
            .HasMaxLength(DataSchemeConstants.MaxNameLength);

        builder.HasIndex(ct => ct.Name)
            .IsUnique(true);

        builder.HasMany(ct => ct.Changes)
            .WithOne(c => c.Type)
            .HasForeignKey(c => c.TypeId)
            .IsRequired(true);
    }
}
