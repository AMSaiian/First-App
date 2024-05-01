using First_App.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace First_App.Infrastructure.Data.Configurations;

public class GroupListConfiguration : BaseEntityConfiguration<GroupList>
{
    public override void Configure(EntityTypeBuilder<GroupList> builder)
    {
        base.Configure(builder);

        builder.Property(card => card.Name)
            .HasMaxLength(DataSchemeConstants.MaxNameLength);

        builder.HasMany(gl => gl.Cards)
            .WithOne(c => c.Group)
            .HasForeignKey(c => c.GroupId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
