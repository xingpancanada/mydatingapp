using System;
using System.Data;
using System.Linq;
using AutoMapper;
using Backend.DTOs;
using Backend.Entities;
using Backend.Extensions;

namespace Backend.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            // CreateMap<Photo, PhotoDto>()
            //     .ForMember(
            //         dest => dest.Url, opt =>
            //         {
            //             opt.MapFrom<PhotoUrlResolver>();
            //         });

          
             
                 
            CreateMap<AppUser, MemberDto>()
                .ForMember(
                    dest => dest.PhotoUrl, opt => opt.MapFrom(src => src.Photos!.FirstOrDefault(x => x.IsMain)!.Url)  //get first photo as cover
                ).ForMember(
                    dest => dest.Age, opt => opt.MapFrom(src => src.DateOfBirth.CalculateAge())
                );

            CreateMap<Photo, PhotoDto>();
                

            CreateMap<MemberUpdateDto, AppUser>();

            CreateMap<RegisterDto, AppUser>();

            //185
            CreateMap<Message, MessageDto>()
                .ForMember(dest => dest.SenderPhotoUrl, opt => opt.MapFrom(src => 
                    src.Sender!.Photos!.FirstOrDefault(x => x.IsMain)!.Url))
                .ForMember(dest => dest.RecipientPhotoUrl, opt => opt.MapFrom(src => 
                    src.Recipient!.Photos!.FirstOrDefault(x => x.IsMain)!.Url));

            //CreateMap<DateTime, DateTime>().ConvertUsing(d => DateTime.SpecifyKind(d, DateTimeKind.Utc));
        }
    }
}