﻿using First_App.Core.Abstractions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace First_App.Infrastructure.Data.Interceptors;

public class SoftDeleteInterceptor : SaveChangesInterceptor
{
    public override InterceptionResult<int> SavingChanges(
        DbContextEventData eventData,
        InterceptionResult<int> result)
    {
        if (eventData.Context is null)
            return base.SavingChanges(eventData, result);

        HandleSoftDelete(eventData);

        return base.SavingChanges(eventData, result);
    }

    public override ValueTask<InterceptionResult<int>> SavingChangesAsync(
        DbContextEventData eventData,
        InterceptionResult<int> result,
        CancellationToken cancellationToken = new CancellationToken())
    {
        if (eventData.Context is null)
            return base.SavingChangesAsync(eventData, result, cancellationToken);

        HandleSoftDelete(eventData);

        return base.SavingChangesAsync(eventData, result, cancellationToken);
    }

    private void HandleSoftDelete(DbContextEventData eventData)
    {
        IEnumerable<EntityEntry<ISoftDeleted>> entries = eventData.Context!.ChangeTracker
            .Entries<ISoftDeleted>()
            .Where(e => e.State is EntityState.Deleted);

        foreach (var entry in entries)
        {
            entry.Entity.IsDeleted = true;
            entry.State = EntityState.Modified;
        }
    }
}
