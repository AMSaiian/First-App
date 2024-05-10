using First_App.Core.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace First_App.Infrastructure.Data.Configurations;

public class CardConfiguration : BaseEntityConfiguration<Card>
{
    public override void Configure(EntityTypeBuilder<Card> builder)
    {
        base.Configure(builder);

        builder.HasQueryFilter(card => !card.IsDeleted);

        builder.Property(card => card.Name)
            .HasMaxLength(DataSchemeConstants.MaxNameLength);

        builder.Property(card => card.Description)
            .HasMaxLength(DataSchemeConstants.MaxDescriptionLength);

        builder.HasMany(card => card.ChangeHistory)
            .WithOne(change => change.AffectedCard)
            .HasForeignKey(change => change.AffectedCardId)
            .IsRequired(true);
    }
}
