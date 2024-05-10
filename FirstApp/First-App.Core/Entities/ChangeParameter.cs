using First_App.Core.Abstractions;

namespace First_App.Core.Entities;

public class ChangeParameter : BaseEntity
{
    public string Name { get; set; } = default!;

    public string Value { get; set; } = default!;

    public int ChangeId { get; set; }

    public Change? Change { get; set; }
}
