using First_App.Core.Abstractions;

namespace First_App.Core.Entities;

public class Priority : BaseEntity
{
    public string Title { get; set; } = default!;

    public List<Card> Cards { get; set; } = [];
}
