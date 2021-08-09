using AutoMapper;
using CustomShopMVC.DataAccess.DatabaseModels;
using CustomShopMVC.Identity;
using CustomShopMVC.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CustomShopMVC.Helpers
{
	public static class AutoMapperConfigs
	{
		public static MapperConfiguration AdminPanel()
		{
			return new MapperConfiguration(cfg =>
			{
				cfg.CreateMap<CategoryViewModel, Category>()
					.ForMember(c => c.Id, opt => opt.MapFrom(src => Guid.Parse(src.Id)))
				;
				cfg.CreateMap<Category, CategoryViewModel>()
					
				;

				cfg.CreateMap<ApplicationUser, UserViewModel>()
					.ForMember(u => u.Id, opt => opt.MapFrom(src => src.Id.ToString()))
				;
				cfg.CreateMap<UserViewModel, ApplicationUser>()
					.ForMember(u => u.Id, opt => opt.MapFrom(src => Guid.Parse(src.Id)))
				;

				cfg.CreateMap<ApplicationUserRole, RoleViewModel>()
					.ForMember(r => r.Id, opt => opt.MapFrom(src => src.Id.ToString()))
				;
				cfg.CreateMap<RoleViewModel, ApplicationUserRole>()
					.ForMember(r => r.Id, opt => opt.MapFrom(src => Guid.Parse(src.Id)))
				;
			});
		}
		public static MapperConfiguration Auth()
		{
			return new MapperConfiguration(cfg =>
			{
				cfg.CreateMap<UserViewModel, ApplicationUser>()
					.ForMember(u => u.Id, opt => opt.MapFrom(src => Guid.Parse(src.Id)))
				;
			});
		}

		public static MapperConfiguration UserPanel()
		{
			return new MapperConfiguration((cfg) =>
			{
				cfg.CreateMap<UserSettings, UserSettingsViewModel>()
					.ForMember(us => us.Id, (opt) => opt.MapFrom(src => src.Id.ToString()))
					.ForMember(us => us.UserId, (opt) => opt.MapFrom(src => src.UserId.ToString()))
				;
				cfg.CreateMap<UserSettingsViewModel, UserSettings>()
					.ForMember(us => us.Id, opt => opt.MapFrom(src => Guid.Parse(src.Id)))
					.ForMember(us => us.UserId, opt => opt.MapFrom(src => Guid.Parse(src.UserId)))
				;
			});
		}
	}
}
