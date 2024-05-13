using First_App.Core.Abstractions;

namespace First_App.Core.Entities;

public class GroupList : BaseEntity
{
    public string Name { get; set; } = default!;

    public int BoardId { get; set; }

    public Board? Board { get; set; }

    public List<Card> Cards { get; set; } = [];
}
