using First_App.Core.Abstractions;

namespace First_App.Core.Entities;

public class Board : BaseEntity
{
    public string Name { get; set; } = default!;

    public List<GroupList> GroupLists { get; set; } = [];

    public List<Change> Changes { get; set; } = [];
}
