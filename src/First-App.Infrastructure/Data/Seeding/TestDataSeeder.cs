using First_App.Core;
using First_App.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace First_App.Infrastructure.Data.Seeding;

public static class TestDataSeeder
{
    private static readonly string CardDescription =
        """
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
        Aenean dapibus tortor nibh. Integer interdum interdum malesuada. 
        Curabitur commodo elementum justo sed scelerisque. 
        Pellentesque gravida felis sit amet blandit tempor. 
        Quisque vel nisl ac dolor dapibus interdum quis ut odio.
        """;

    private static readonly List<GroupList> GroupLists =
    [
        new() { Name = "List1" },
        new() { Name = "List2" },
        new() { Name = "List3" }
    ];

    private static readonly List<Card> Cards =
    [
        new()
        {
            Name = "List1Card1",
            DueDate = DateOnly.FromDateTime(DateTime.Now.AddDays(-1).ToUniversalTime()),
            Description = CardDescription,
            GroupId = 1, PriorityId = 1,
        },
        new()
        {
            Name = "List1Card2",
            DueDate = DateOnly.FromDateTime(DateTime.Now.AddDays(5).ToUniversalTime()),
            Description = CardDescription,
            GroupId = 1, PriorityId = 1,
            ChangeHistory =
            [
                new()
                {
                    Time = DateTime.Now.AddDays(5).ToUniversalTime(),
                    TypeId = 1,
                    Parameters =
                    [
                        new()
                        {
                            Name = ChangeCardParametersNames.MainEntityName,
                            Value = "List1Card2"
                        },
                        new()
                        {
                            Name = ChangeCardParametersNames.RelatedEntityName,
                            Value = "List1"
                        }
                    ]
                }
            ]
        },
        new()
        {
            Name = "List1Card3",
            DueDate = DateOnly.FromDateTime(DateTime.Now.AddDays(2).ToUniversalTime()),
            Description = CardDescription,
            GroupId = 1, PriorityId = 2,
            ChangeHistory =
            [
                new()
                {
                    Time = DateTime.Now.AddDays(2).ToUniversalTime(),
                    TypeId = 1,
                    Parameters =
                    [
                        new()
                        {
                            Name = ChangeCardParametersNames.MainEntityName,
                            Value = "List1Card3"
                        },
                        new()
                        {
                            Name = ChangeCardParametersNames.RelatedEntityName,
                            Value = "List1"
                        }
                    ]
                }
            ]
        },
        new()
        {
            Name = "List1Card4",
            DueDate = DateOnly.FromDateTime(DateTime.Now.AddDays(0).ToUniversalTime()),
            Description = CardDescription,
            GroupId = 1, PriorityId = 2,
            ChangeHistory =
            [
                new()
                {
                    Time = DateTime.Now.AddDays(0).ToUniversalTime(),
                    TypeId = 1,
                    Parameters =
                    [
                        new()
                        {
                            Name = ChangeCardParametersNames.MainEntityName,
                            Value = "List1Card4"
                        },
                        new()
                        {
                            Name = ChangeCardParametersNames.RelatedEntityName,
                            Value = "List1"
                        }
                    ]
                }
            ]
        },
        new()
        {
            Name = "List1Card5",
            DueDate = DateOnly.FromDateTime(DateTime.Now.AddDays(10).ToUniversalTime()),
            Description = CardDescription,
            GroupId = 1, PriorityId = 2,
            ChangeHistory =
            [
                new()
                {
                    Time = DateTime.Now.AddDays(10).ToUniversalTime(),
                    TypeId = 1,
                    Parameters =
                    [
                        new()
                        {
                            Name = ChangeCardParametersNames.MainEntityName,
                            Value = "List1Card5"
                        },
                        new()
                        {
                            Name = ChangeCardParametersNames.RelatedEntityName,
                            Value = "List1"
                        }
                    ]
                }
            ]
        },

        new()
        {
            Name = "List1Card6",
            DueDate = DateOnly.FromDateTime(DateTime.Now.AddDays(-1).ToUniversalTime()),
            Description = CardDescription,
            GroupId = 1, PriorityId = 1,
            ChangeHistory =
            [
                new()
                {
                    Time = DateTime.Now.AddDays(-1).ToUniversalTime(),
                    TypeId = 1,
                    Parameters =
                    [
                        new()
                        {
                            Name = ChangeCardParametersNames.MainEntityName,
                            Value = "List1Card6"
                        },
                        new()
                        {
                            Name = ChangeCardParametersNames.RelatedEntityName,
                            Value = "List1"
                        }
                    ]
                }
            ]
        },
        new()
        {
            Name = "List1Card7",
            DueDate = DateOnly.FromDateTime(DateTime.Now.AddDays(5).ToUniversalTime()),
            Description = CardDescription,
            GroupId = 1, PriorityId = 1,
            ChangeHistory =
            [
                new()
                {
                    Time = DateTime.Now.AddDays(5).ToUniversalTime(),
                    TypeId = 1,
                    Parameters =
                    [
                        new()
                        {
                            Name = ChangeCardParametersNames.MainEntityName,
                            Value = "List1Card7"
                        },
                        new()
                        {
                            Name = ChangeCardParametersNames.RelatedEntityName,
                            Value = "List1"
                        }
                    ]
                }
            ]
        },
        new()
        {
            Name = "List1Card8",
            DueDate = DateOnly.FromDateTime(DateTime.Now.AddDays(2).ToUniversalTime()),
            Description = CardDescription,
            GroupId = 1, PriorityId = 1,
            ChangeHistory =
            [
                new()
                {
                    Time = DateTime.Now.AddDays(2).ToUniversalTime(),
                    TypeId = 1,
                    Parameters =
                    [
                        new()
                        {
                            Name = ChangeCardParametersNames.MainEntityName,
                            Value = "List1Card8"
                        },
                        new()
                        {
                            Name = ChangeCardParametersNames.RelatedEntityName,
                            Value = "List1"
                        }
                    ]
                }
            ]
        },
        new()
        {
            Name = "List1Card9",
            DueDate = DateOnly.FromDateTime(DateTime.Now.AddDays(0).ToUniversalTime()),
            Description = CardDescription,
            GroupId = 1, PriorityId = 1,
            ChangeHistory =
            [
                new()
                {
                    Time = DateTime.Now.AddDays(0).ToUniversalTime(),
                    TypeId = 1,
                    Parameters =
                    [
                        new()
                        {
                            Name = ChangeCardParametersNames.MainEntityName,
                            Value = "List1Card9"
                        },
                        new()
                        {
                            Name = ChangeCardParametersNames.RelatedEntityName,
                            Value = "List1"
                        }
                    ]
                }
            ]
        },
        new()
        {
            Name = "List1Card10",
            DueDate = DateOnly.FromDateTime(DateTime.Now.AddDays(10).ToUniversalTime()),
            Description = CardDescription,
            GroupId = 1, PriorityId = 1,
            ChangeHistory =
            [
                new()
                {
                    Time = DateTime.Now.AddDays(10).ToUniversalTime(),
                    TypeId = 1,
                    Parameters =
                    [
                        new()
                        {
                            Name = ChangeCardParametersNames.MainEntityName,
                            Value = "List1Card10"
                        },
                        new()
                        {
                            Name = ChangeCardParametersNames.RelatedEntityName,
                            Value = "List1"
                        }
                    ]
                }
            ]
        },

        new()
        {
            Name = "List2Card1",
            DueDate = DateOnly.FromDateTime(DateTime.Now.AddDays(-1).ToUniversalTime()),
            Description = CardDescription,
            GroupId = 2, PriorityId = 1,
            ChangeHistory =
            [
                new()
                {
                    Time = DateTime.Now.AddDays(-1).ToUniversalTime(),
                    TypeId = 1,
                    Parameters =
                    [
                        new()
                        {
                            Name = ChangeCardParametersNames.MainEntityName,
                            Value = "List2Card1"
                        },
                        new()
                        {
                            Name = ChangeCardParametersNames.RelatedEntityName,
                            Value = "List2"
                        }
                    ]
                }
            ]
        },
        new()
        {
            Name = "List2Card2",
            DueDate = DateOnly.FromDateTime(DateTime.Now.AddDays(5).ToUniversalTime()),
            Description = CardDescription,
            GroupId = 2, PriorityId = 1,
            ChangeHistory =
            [
                new()
                {
                    Time = DateTime.Now.AddDays(5).ToUniversalTime(),
                    TypeId = 1,
                    Parameters =
                    [
                        new()
                        {
                            Name = ChangeCardParametersNames.MainEntityName,
                            Value = "List2Card2"
                        },
                        new()
                        {
                            Name = ChangeCardParametersNames.RelatedEntityName,
                            Value = "List2"
                        }
                    ]
                }
            ]
        },
        new()
        {
            Name = "List2Card3",
            DueDate = DateOnly.FromDateTime(DateTime.Now.AddDays(2).ToUniversalTime()),
            Description = CardDescription,
            GroupId = 2, PriorityId = 3,
            ChangeHistory =
            [
                new()
                {
                    Time = DateTime.Now.AddDays(2).ToUniversalTime(),
                    TypeId = 1,
                    Parameters =
                    [
                        new()
                        {
                            Name = ChangeCardParametersNames.MainEntityName,
                            Value = "List2Card3"
                        },
                        new()
                        {
                            Name = ChangeCardParametersNames.RelatedEntityName,
                            Value = "List2"
                        }
                    ]
                }
            ]
        },
        new()
        {
            Name = "List2Card4",
            DueDate = DateOnly.FromDateTime(DateTime.Now.AddDays(0).ToUniversalTime()),
            Description = CardDescription,
            GroupId = 2, PriorityId = 3,
            ChangeHistory =
            [
                new()
                {
                    Time = DateTime.Now.AddDays(0).ToUniversalTime(),
                    TypeId = 1,
                    Parameters =
                    [
                        new()
                        {
                            Name = ChangeCardParametersNames.MainEntityName,
                            Value = "List2Card4"
                        },
                        new()
                        {
                            Name = ChangeCardParametersNames.RelatedEntityName,
                            Value = "List2"
                        }
                    ]
                }
            ]
        },
        new()
        {
            Name = "List2Card5",
            DueDate = DateOnly.FromDateTime(DateTime.Now.AddDays(10).ToUniversalTime()),
            Description = CardDescription,
            GroupId = 2, PriorityId = 3,
            ChangeHistory =
            [
                new()
                {
                    Time = DateTime.Now.AddDays(10).ToUniversalTime(),
                    TypeId = 1,
                    Parameters =
                    [
                        new()
                        {
                            Name = ChangeCardParametersNames.MainEntityName,
                            Value = "List2Card5"
                        },
                        new()
                        {
                            Name = ChangeCardParametersNames.RelatedEntityName,
                            Value = "List2"
                        }
                    ]
                }
            ]
        },

        new()
        {
            Name = "List2Card6",
            DueDate = DateOnly.FromDateTime(DateTime.Now.AddDays(-1).ToUniversalTime()),
            Description = CardDescription,
            GroupId = 2, PriorityId = 3,
            ChangeHistory =
            [
                new()
                {
                    Time = DateTime.Now.AddDays(-1).ToUniversalTime(),
                    TypeId = 1,
                    Parameters =
                    [
                        new()
                        {
                            Name = ChangeCardParametersNames.MainEntityName,
                            Value = "List2Card6"
                        },
                        new()
                        {
                            Name = ChangeCardParametersNames.RelatedEntityName,
                            Value = "List2"
                        }
                    ]
                }
            ]
        },
        new()
        {
            Name = "List2Card7",
            DueDate = DateOnly.FromDateTime(DateTime.Now.AddDays(5).ToUniversalTime()),
            Description = CardDescription,
            GroupId = 2, PriorityId = 2,
            ChangeHistory =
            [
                new()
                {
                    Time = DateTime.Now.AddDays(5).ToUniversalTime(),
                    TypeId = 1,
                    Parameters =
                    [
                        new()
                        {
                            Name = ChangeCardParametersNames.MainEntityName,
                            Value = "List2Card7"
                        },
                        new()
                        {
                            Name = ChangeCardParametersNames.RelatedEntityName,
                            Value = "List2"
                        }
                    ]
                }
            ]
        },

        new()
        {
            Name = "List3Card1",
            DueDate = DateOnly.FromDateTime(DateTime.Now.AddDays(-1).ToUniversalTime()),
            Description = CardDescription,
            GroupId = 3, PriorityId = 2,
            ChangeHistory =
            [
                new()
                {
                    Time = DateTime.Now.AddDays(-1).ToUniversalTime(),
                    TypeId = 1,
                    Parameters =
                    [
                        new()
                        {
                            Name = ChangeCardParametersNames.MainEntityName,
                            Value = "List3Card1"
                        },
                        new()
                        {
                            Name = ChangeCardParametersNames.RelatedEntityName,
                            Value = "List3"
                        }
                    ]
                }
            ]
        },
        new()
        {
            Name = "List3Card2",
            DueDate = DateOnly.FromDateTime(DateTime.Now.AddDays(5).ToUniversalTime()),
            Description = CardDescription,
            GroupId = 3, PriorityId = 2,
            ChangeHistory =
            [
                new()
                {
                    Time = DateTime.Now.AddDays(5).ToUniversalTime(),
                    TypeId = 1,
                    Parameters =
                    [
                        new()
                        {
                            Name = ChangeCardParametersNames.MainEntityName,
                            Value = "List3Card2"
                        },
                        new()
                        {
                            Name = ChangeCardParametersNames.RelatedEntityName,
                            Value = "List3"
                        }
                    ]
                }
            ]
        },
        new()
        {
            Name = "List3Card3",
            DueDate = DateOnly.FromDateTime(DateTime.Now.AddDays(2).ToUniversalTime()),
            Description = CardDescription,
            GroupId = 3, PriorityId = 2,
            ChangeHistory =
            [
                new()
                {
                    Time = DateTime.Now.AddDays(2).ToUniversalTime(),
                    TypeId = 1,
                    Parameters =
                    [
                        new()
                        {
                            Name = ChangeCardParametersNames.MainEntityName,
                            Value = "List3Card3"
                        },
                        new()
                        {
                            Name = ChangeCardParametersNames.RelatedEntityName,
                            Value = "List3"
                        }
                    ]
                }
            ]
        },
        new()
        {
            Name = "List3Card4",
            DueDate = DateOnly.FromDateTime(DateTime.Now.AddDays(2).ToUniversalTime()),
            Description = CardDescription,
            GroupId = 3, PriorityId = 2,
            IsDeleted = true,
            ChangeHistory =
            [
                new()
                {
                    Time = DateTime.Now.AddDays(1).ToUniversalTime(),
                    TypeId = 1,
                    Parameters =
                    [
                        new()
                        {
                            Name = ChangeCardParametersNames.MainEntityName,
                            Value = "List3Card4"
                        },
                        new()
                        {
                            Name = ChangeCardParametersNames.RelatedEntityName,
                            Value = "List3"
                        }
                    ]
                },
                new()
                {
                    Time = DateTime.Now.AddDays(2).ToUniversalTime(),
                    TypeId = 2,
                    Parameters =
                    [
                        new()
                        {
                            Name = ChangeCardParametersNames.MainEntityName,
                            Value = "List3Card4"
                        },
                        new()
                        {
                            Name = ChangeCardParametersNames.RelatedEntityName,
                            Value = "List3"
                        }
                    ]
                }
            ]
        },
    ];

    private static readonly List<Change> Changes =
    [
        new()
        {
            AffectedCardId = 1,
            TypeId = 1,
            Time = DateTime.Now.AddHours(-8).ToUniversalTime(),
            Parameters =
            [
                new()
                {
                    Name = ChangeCardParametersNames.MainEntityName,
                    Value = "InitName"
                },
                new()
                {
                    Name = ChangeCardParametersNames.RelatedEntityName,
                    Value = "List3"
                }
            ]
        },
        new()
        {
            AffectedCardId = 1,
            TypeId = 3,
            Time = DateTime.Now.AddHours(-8).ToUniversalTime(),
            Parameters =
            [
                new()
                {
                    Name = ChangeCardParametersNames.PreviousValue,
                    Value = "PreviousName1"
                },
                new()
                {
                    Name = ChangeCardParametersNames.NewValue,
                    Value = "PreviousName2"
                }
            ]
        },
        new()
        {
            AffectedCardId = 1,
            TypeId = 3,
            Time = DateTime.Now.AddHours(-7).ToUniversalTime(),
            Parameters =
            [
                new()
                {
                    Name = ChangeCardParametersNames.PreviousValue,
                    Value = "PreviousName2"
                },
                new()
                {
                    Name = ChangeCardParametersNames.NewValue,
                    Value = "PreviousName3"
                }
            ]
        }
    ];

    public static async Task PopulateDbContext(AppDbContext dbContext)
    {
        await dbContext.Database.EnsureCreatedAsync();

        if (await dbContext.GroupLists.CountAsync() == 0
         && await dbContext.Cards.CountAsync() == 0)
        {
            await dbContext.GroupLists.AddRangeAsync(GroupLists);
            await dbContext.SaveChangesAsync();

            await dbContext.Cards.AddRangeAsync(Cards);
            await dbContext.SaveChangesAsync();

            await dbContext.Changes.AddRangeAsync(Changes);
            await dbContext.SaveChangesAsync();
        }
    }
}
