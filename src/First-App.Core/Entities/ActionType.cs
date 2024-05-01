using First_App.Core.Abstractions;

namespace First_App.Core.Entities;

public class ActionType : BaseEntity
{
    public string Name { get; set; } = default!;

    public List<Action> Actions { get; set; } = [];
}
