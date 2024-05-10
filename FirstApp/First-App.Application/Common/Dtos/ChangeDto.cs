namespace First_App.Application.Common.Dtos;

public record ChangeDto(string TypeName = default!,
                        DateTime Time = default!,
                        List<ChangeParameterDto> Parameters = default!);

public record ChangeParameterDto(string Name = default!,
                                 string Value = default!);
