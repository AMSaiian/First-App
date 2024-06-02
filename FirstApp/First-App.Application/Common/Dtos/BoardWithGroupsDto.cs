namespace First_App.Application.Common.Dtos;

public record BoardWithGroupsDto(int Id = default!,
                                 string Name = default!,
                                 List<GroupListWithCardsDto> GroupLists = default!);
