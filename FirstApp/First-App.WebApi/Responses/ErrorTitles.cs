namespace First_App.WebApi.Responses;

public static class ErrorTitles
{
    public static readonly string ConflictTitle = "Related entity(s) not found";
    public static readonly string ErrorTitle = "Provided data which violate business rules";
    public static readonly string NotFoundTitle = "Requested entity not found";

    public static readonly string ExceptionTitle = "Unhandled exception occured";
}
