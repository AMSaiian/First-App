using First_App.Core.Abstractions;

namespace First_App.Core.Entities;

public class ActionParameter : BaseEntity
{
    public string Name { get; set; } = default!;

    public string Value { get; set; } = default!;

    public int ActionId { get; set; }

    public Action? Action { get; set; }
}
