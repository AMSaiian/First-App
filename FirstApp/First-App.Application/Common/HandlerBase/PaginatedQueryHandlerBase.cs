using System.Linq.Expressions;
using Ardalis.Result;
using First_App.Application.Common.Dtos.Pagination;
using Microsoft.EntityFrameworkCore;

namespace First_App.Application.Common.HandlerBase;

public abstract class PaginatedQueryHandlerBase
{
    protected async Task<Paginated<TEntity>>
        ProcessPagination<TEntity, TKey>(IQueryable<TEntity> query,
                                         Expression<Func<TEntity, TKey>> sortExpression,
                                         PaginationContext? paginationInfo,
                                         bool isDescending = true)
    {
        long totalElements = await query.CountAsync();
        long totalPages = paginationInfo is not null
            ? (int)Math.Ceiling((decimal)totalElements / paginationInfo.PageSize)
            : 1;

        query = isDescending
            ? query.OrderByDescending(sortExpression)
            : query.OrderBy(sortExpression);

        if (paginationInfo is not null)
        {
            int skipAmount = (paginationInfo.PageNum - 1) * paginationInfo.PageSize;

            query = query
                .Skip(skipAmount)
                .Take(paginationInfo.PageSize);
        }

        List<TEntity> entities = await query.ToListAsync();

        PagedInfo pagedInfo = new PagedInfo(
            totalRecords: totalElements,
            totalPages: totalPages,
            pageNumber: paginationInfo?.PageNum ?? 1,
            pageSize: paginationInfo?.PageSize ?? long.MaxValue);

        return new(entities, pagedInfo);
    }
}
