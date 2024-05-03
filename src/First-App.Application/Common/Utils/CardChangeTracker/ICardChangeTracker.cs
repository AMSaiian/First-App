using Ardalis.Result;
using First_App.Core.Entities;

namespace First_App.Application.Common.Utils.CardChangeTracker;

public interface ICardChangeTracker
{
    public Task TrackCreate(Card entity, CancellationToken cancellationToken);

    public Task<Result> TrackUpdate(Card entity, ICardUpdater updateEntity, CancellationToken cancellationToken);

    public Task TrackDelete(Card entity, CancellationToken cancellationToken);
}
