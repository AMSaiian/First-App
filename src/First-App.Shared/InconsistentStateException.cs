namespace First_App.Shared;

public class InconsistentStateException : Exception
{
    public InconsistentStateException()
    {
    }

    public InconsistentStateException(string message)
        : base(message)
    {
    }

    public InconsistentStateException(string message, Exception inner)
        : base(message, inner)
    {
    }
}
