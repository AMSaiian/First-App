using AutoMapper;
using First_App.Application.Common.Dtos;
using First_App.Core.Entities;

namespace First_App.Application.Common.Mapping;

public class ChangeProfile : Profile
{
    public ChangeProfile()
    {
        CreateMap<Change, ChangeDto>();
        CreateMap<ChangeParameter, ChangeParameterDto>();
    }
}
