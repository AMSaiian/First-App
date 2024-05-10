using System.Globalization;
using Ardalis.Result;
using First_App.Application.Common.Errors;
using First_App.Core;
using First_App.Core.Entities;
using First_App.Infrastructure.Data;
using First_App.Shared;
using Microsoft.EntityFrameworkCore;

namespace First_App.Application.Common.Utils.CardChangeWithTracker;

public class CardChangeWithTracker(AppDbContext context) : ICardChangeWithTracker
{
    private readonly AppDbContext _context = context;

    public async Task<Result> Create(Card entity, CancellationToken cancellationToken)
    {
        List<string> conflictErrorList = [];

        Priority? priorityEntity = await _context.Priorities
            .FindAsync(entity.PriorityId,
                       cancellationToken);
        if (priorityEntity is null)
            conflictErrorList.Add(nameof(Priority));

        GroupList? groupEntity = await _context.GroupLists
            .FindAsync(entity.GroupId,
                       cancellationToken);
        if (groupEntity is null)
            conflictErrorList.Add(nameof(GroupList));

        if (conflictErrorList.Count > 0)
            return Result.Conflict(conflictErrorList.ToArray());

        ChangeParameter[] changeParameters =
        [
            new()
            {
                Name = ChangeCardParametersNames.MainEntityName,
                Value = entity.Name
            },
            new()
            {
                Name = ChangeCardParametersNames.RelatedEntityName,
                Value = groupEntity!.Name
            }
        ];

        entity.ChangeHistory
            .Add(await BuildChange(
                     ChangeCardConstants.CreateCard,
                     cancellationToken,
                     changeParameters)
            );

        return Result.Success();
    }

    public async Task<Result> Update(Card entity,
                                     ICardUpdater updateEntity,
                                     CancellationToken cancellationToken)
    {
        bool isChanged = false;
        List<string> conflictErrorList = [];

        if (updateEntity.Name is not null
         && entity.Name != updateEntity.Name)
        {
            await ChangeName(entity, updateEntity.Name, cancellationToken);
            isChanged = true;
        }

        if (updateEntity.Description is not null
         && entity.Description != updateEntity.Description)
        {
            await ChangeDescription(entity, updateEntity.Description, cancellationToken);
            isChanged = true;
        }

        if (updateEntity.DueDate is not null
         && entity.DueDate != updateEntity.DueDate)
        {
            await ChangeDueDate(entity, updateEntity.DueDate.Value, cancellationToken);
            isChanged = true;
        }

        if (updateEntity.PriorityId is not null
         && entity.PriorityId != updateEntity.PriorityId)
        {
            Result intermediateResult =
                await ChangePriority(entity, updateEntity.PriorityId.Value, cancellationToken);

            if (!intermediateResult.IsSuccess)
                conflictErrorList.AddRange(intermediateResult.Errors);

            isChanged = true;
        }

        if (updateEntity.GroupId is not null
         && entity.GroupId != updateEntity.GroupId)
        {
            Result intermediateResult =
                await ChangeGroup(entity, updateEntity.GroupId.Value, cancellationToken);

            if (!intermediateResult.IsSuccess)
                conflictErrorList.AddRange(intermediateResult.Errors);

            isChanged = true;
        }

        if (conflictErrorList.Count > 0)
            return Result.Conflict(conflictErrorList.ToArray());
        else if (!isChanged)
            return Result.Error(ErrorIdentifiers.NoChangesProvided);
        else 
            return Result.Success();
    }

    public async Task Delete(Card entity, CancellationToken cancellationToken)
    {
        GroupList? groupEntity = await _context.GroupLists
            .FindAsync(entity.GroupId,
                       cancellationToken);
        if (groupEntity is null)
            throw new InconsistentStateException();

        ChangeParameter[] changeParameters =
        [
            new()
            {
                Name = ChangeCardParametersNames.MainEntityName,
                Value = entity.Name
            },
            new()
            {
                Name = ChangeCardParametersNames.RelatedEntityName,
                Value = groupEntity.Name
            }
        ];

        entity.ChangeHistory
            .Add(await BuildChange(
                     ChangeCardConstants.DeleteCard,
                     cancellationToken,
                     changeParameters)
            );
    }

    private async Task<Change> BuildChange(string changeTypeName,
                                           CancellationToken cancellationToken,
                                           params ChangeParameter[] parameters)
    {
        ChangeType? changeType = await _context.ChangeTypes
            .FirstOrDefaultAsync(type => type.Name == changeTypeName,
                                 cancellationToken);
        if (changeType is null)
            throw new RequiredDataNotFoundException(
                $"Type {nameof(ChangeType)} : value: {changeTypeName}");

        Change updateChange = new()
        {
            Time = DateTime.Now.ToUniversalTime(),
            Type = changeType,
        };

        updateChange.Parameters.AddRange(parameters);

        return updateChange;
    }

    private async Task ChangeName(Card entity,
                                  string newName,
                                  CancellationToken cancellationToken)
    {
        ChangeParameter[] changeParameters =
        [
            new() { Name = ChangeCardParametersNames.PreviousValue, Value = entity.Name },
            new() { Name = ChangeCardParametersNames.NewValue, Value = newName }
        ];

        entity.ChangeHistory.Add(await BuildChange(
                                     ChangeCardConstants.UpdateName,
                                     cancellationToken,
                                     changeParameters)
        );

        entity.Name = newName;
    }

    private async Task ChangeDescription(Card entity,
                                         string newDescription,
                                         CancellationToken cancellationToken)
    {
        ChangeParameter[] changeParameters =
        [
            new() { Name = ChangeCardParametersNames.PreviousValue, Value = entity.Description },
            new() { Name = ChangeCardParametersNames.NewValue, Value = newDescription }
        ];

        entity.ChangeHistory.Add(await BuildChange(
                                     ChangeCardConstants.UpdateDescription,
                                     cancellationToken,
                                     changeParameters));

        entity.Description = newDescription;
    }

    private async Task ChangeDueDate(Card entity,
                                     DateOnly newDueDate,
                                     CancellationToken cancellationToken)
    {
        ChangeParameter[] changeParameters =
        [
            new()
            {
                Name = ChangeCardParametersNames.PreviousValue,
                Value = entity.DueDate.ToString(CultureInfo.InvariantCulture)
            },
            new()
            {
                Name = ChangeCardParametersNames.NewValue,
                Value = newDueDate.ToString(CultureInfo.InvariantCulture)!
            }
        ];

        entity.ChangeHistory.Add(await BuildChange(
                                     ChangeCardConstants.UpdateDueDate,
                                     cancellationToken,
                                     changeParameters)
        );

        entity.DueDate = newDueDate;
    }

    private async Task<Result> ChangePriority(Card entity,
                                              int newPriorityId,
                                              CancellationToken cancellationToken)
    {
        Priority? newPriorityEntity = await _context.Priorities
            .FindAsync(newPriorityId,
                       cancellationToken);

        if (newPriorityEntity is null)
            return Result.Conflict(nameof(Priority));

        await _context.Cards
            .Entry(entity)
            .Reference(c => c.Priority)
            .LoadAsync(cancellationToken);

        ChangeParameter[] changeParameters =
        [
            new()
            {
                Name = ChangeCardParametersNames.MainEntityName,
                Value = entity.Name
            },
            new()
            {
                Name = ChangeCardParametersNames.PreviousValue,
                Value = entity.Priority!.Title
            },
            new()
            {
                Name = ChangeCardParametersNames.NewValue,
                Value = newPriorityEntity.Title
            }
        ];

        entity.ChangeHistory.Add(await BuildChange(
                                     ChangeCardConstants.UpdatePriority,
                                     cancellationToken,
                                     changeParameters)
        );

        entity.PriorityId = newPriorityId;

        return Result.Success();
    }

    private async Task<Result> ChangeGroup(Card entity,
                                           int newGroupId,
                                           CancellationToken cancellationToken)
    {
        GroupList? newGroupListEntity = await _context.GroupLists
            .FindAsync(newGroupId,
                       cancellationToken);

        if (newGroupListEntity is null)
            return Result.Conflict(nameof(GroupList));

        await _context.Cards
            .Entry(entity)
            .Reference(c => c.Group)
            .LoadAsync(cancellationToken);

        ChangeParameter[] changeParameters =
        [
            new()
            {
                Name = ChangeCardParametersNames.MainEntityName,
                Value = entity.Name
            },
            new()
            {
                Name = ChangeCardParametersNames.PreviousValue,
                Value = entity.Group!.Name
            },
            new()
            {
                Name = ChangeCardParametersNames.NewValue,
                Value = newGroupListEntity.Name
            }
        ];

        entity.ChangeHistory.Add(await BuildChange(
                                     ChangeCardConstants.UpdateGroup,
                                     cancellationToken,
                                     changeParameters)
        );

        entity.GroupId = newGroupId;

        return Result.Success();
    }
}
