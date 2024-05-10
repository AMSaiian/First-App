using Ardalis.Result;

namespace First_App.WebApi.Responses;

public class PutIdMismatchError()
    : ValidationError("id",
                      "Route and body id mismatches",
                      "",
                      ValidationSeverity.Error);
