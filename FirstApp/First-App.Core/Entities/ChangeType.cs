using First_App.Core.Abstractions;

namespace First_App.Core.Entities;

public class ChangeType : BaseEntity
{
    public string Name { get; set; } = default!;

    public List<Change> Changes { get; set; } = [];
}
