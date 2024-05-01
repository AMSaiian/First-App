using First_App.Core.Abstractions;

namespace First_App.Core.Entities;

public class Action : BaseEntity
{
    public DateTime Time { get; set; }

    public int TypeId { get; set; }

    public int CardId { get; set; }

    public Card? AffectedCard { get; set; }

    public ActionType? Type { get; set; }

    public List<ActionParameter> Parameters { get; set; } = [];
}
