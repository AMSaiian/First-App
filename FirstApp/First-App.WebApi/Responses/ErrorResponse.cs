namespace First_App.WebApi.Responses;

public record ErrorResponse(string Title, int StatusCode, List<string> Errors);
