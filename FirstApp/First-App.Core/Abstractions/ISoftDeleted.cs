namespace First_App.Core.Abstractions;

public interface ISoftDeleted
{
    public bool IsDeleted { get; set; }
}
