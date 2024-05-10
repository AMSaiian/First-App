namespace First_App.Application.Common.Dtos;

public record CardDto(int Id = default, 
                      string Name  = default!,
                      string Description  = default!,
                      DateOnly DueDate = default,
                      int PriorityId = default,
                      int GroupId = default);
