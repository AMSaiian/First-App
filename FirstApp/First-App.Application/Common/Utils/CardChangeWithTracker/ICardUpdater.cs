﻿namespace First_App.Application.Common.Utils.CardChangeWithTracker;

public interface ICardUpdater
{
    public string? Name { get; }

    public string? Description { get; }

    public DateOnly? DueDate { get; }

    public int? GroupId { get; }

    public int? PriorityId { get; }
}
