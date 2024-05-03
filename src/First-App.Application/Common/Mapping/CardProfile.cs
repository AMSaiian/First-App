using AutoMapper;
using First_App.Application.Commands.Card.Create;
using First_App.Application.Commands.Card.Update;
using First_App.Core.Entities;

namespace First_App.Application.Common.Mapping;

public class CardProfile : Profile
{
    public CardProfile()
    {
        CreateMap<CreateCardCommand, Card>();
        CreateMap<UpdateCardCommand, Card>();
    }
}
