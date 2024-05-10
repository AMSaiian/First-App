using First_App.Core.Abstractions;

namespace First_App.Core.Entities;

public class GroupList : BaseEntity
{
    public string Name { get; set; } = default!;

    public List<Card> Cards { get; set; } = [];
}
