using AutoMapper;
using Backend.DTOs;
using Backend.Entities;

namespace Backend.Helpers
{
    public class PhotoUrlResolver : IValueResolver<Photo, PhotoDto, string>
    {
        private readonly IConfiguration _config;
        public PhotoUrlResolver(IConfiguration config)
        {
            _config = config;
        }

        public string Resolve(Photo source, PhotoDto destination, string destMember, ResolutionContext context)
        {
            if(!string.IsNullOrEmpty(source.Url)){
                return _config["ApiUrl"] + source.Url;
            }

            return null;
        }
    }
}