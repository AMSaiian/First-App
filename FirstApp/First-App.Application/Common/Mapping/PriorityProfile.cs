using AutoMapper;
using First_App.Application.Common.Dtos;
using First_App.Core.Entities;

namespace First_App.Application.Common.Mapping;

public class PriorityProfile : Profile
{
    public PriorityProfile()
    {
        CreateMap<Priority, PriorityDto>();
    }
}
