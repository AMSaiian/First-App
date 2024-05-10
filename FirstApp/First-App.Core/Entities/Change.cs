using First_App.Core.Abstractions;

namespace First_App.Core.Entities;

public class Change : BaseEntity
{
    public DateTime Time { get; set; }

    public int TypeId { get; set; }

    public int AffectedCardId { get; set; }

    public Card? AffectedCard { get; set; }

    public ChangeType? Type { get; set; }

    public List<ChangeParameter> Parameters { get; set; } = [];
}
