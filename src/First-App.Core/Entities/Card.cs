using First_App.Core.Abstractions;

namespace First_App.Core.Entities;

public class Card : BaseEntity,
                    ISoftDeleted
{
    public string Name { get; set; } = default!;

    public string Description { get; set; } = default!;

    public DateOnly DueDate { get; set; }

    public bool IsDeleted { get; set; } = false;

    public int? GroupId { get; set; }

    public int PriorityId { get; set; }

    public GroupList? Group { get; set; }

    public Priority? Priority { get; set; }

    public List<Change> ChangeHistory { get; set; } = [];
}
