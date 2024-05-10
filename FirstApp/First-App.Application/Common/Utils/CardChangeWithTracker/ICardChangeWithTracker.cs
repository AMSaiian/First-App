using Ardalis.Result;
using First_App.Core.Entities;

namespace First_App.Application.Common.Utils.CardChangeWithTracker;

public interface ICardChangeWithTracker
{
    public Task<Result> Create(Card entity, CancellationToken cancellationToken);

    public Task<Result> Update(Card entity, ICardUpdater updateEntity, CancellationToken cancellationToken);

    public Task Delete(Card entity, CancellationToken cancellationToken);
}
