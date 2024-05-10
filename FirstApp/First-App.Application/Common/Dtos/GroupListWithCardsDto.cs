using First_App.Application.Common.Dtos.Pagination;

namespace First_App.Application.Common.Dtos;

public record GroupListWithCardsDto(int Id = default,
                                    string Name = default!,
                                    Paginated<CardDto> Cards = default!);
