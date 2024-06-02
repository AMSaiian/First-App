using AutoMapper;
using First_App.Application.Commands.GroupList.Create;
using First_App.Application.Common.Dtos;
using First_App.Core.Entities;

namespace First_App.Application.Common.Mapping;

public class GroupListProfile : Profile
{
    public GroupListProfile()
    {
        CreateMap<CreateGroupListCommand, GroupList>();

        CreateMap<GroupList, GroupListDto>();
    }
}
