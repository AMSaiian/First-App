using Ardalis.Result;

namespace First_App.Application.Common.Dtos.Pagination;

public record Paginated<T>(List<T> Entities, PagedInfo PagedInfo);
