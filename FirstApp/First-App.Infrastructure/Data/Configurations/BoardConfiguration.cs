using First_App.Core.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace First_App.Infrastructure.Data.Configurations;

public class BoardConfiguration : BaseEntityConfiguration<Board>
{
    public override void Configure(EntityTypeBuilder<Board> builder)
    {
        base.Configure(builder);

        builder.Property(board => board.Name)
            .HasMaxLength(DataSchemeConstants.MaxNameLength);

        builder.HasMany(board => board.GroupLists)
            .WithOne(groupList => groupList.Board)
            .HasForeignKey(groupList => groupList.BoardId)
            .IsRequired(true);

        builder.HasMany(board => board.Changes)
            .WithOne(change => change.AffectedBoard)
            .HasForeignKey(change => change.AffectedBoardId)
            .IsRequired(true);
    }
}
