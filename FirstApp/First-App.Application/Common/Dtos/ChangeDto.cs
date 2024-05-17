namespace First_App.Application.Common.Dtos;

public record ChangeDto(int Id = default!,
                        string TypeName = default!,
                        DateTime Time = default!,
                        int AffectedBoardId = default!,
                        List<ChangeParameterDto> Parameters = default!);

public record ChangeParameterDto(string Name = default!,
                                 string Value = default!);
