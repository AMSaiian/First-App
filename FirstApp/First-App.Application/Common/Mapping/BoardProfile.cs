using AutoMapper;
using First_App.Application.Commands.Board.Create;
using First_App.Application.Common.Dtos;
using First_App.Core.Entities;

namespace First_App.Application.Common.Mapping;

public class BoardProfile : Profile
{
    public BoardProfile()
    {
        CreateMap<CreateBoardCommand, Board>();

        CreateMap<Board, BoardDto>();
    }
}
