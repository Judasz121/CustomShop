﻿using AutoMapper;
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
				#region category
				cfg.CreateMap<CategoryViewModel, Category>()
					.ForMember(c => c.Id, opt => opt.MapFrom(src => Guid.Parse(src.Id)))
				;
				cfg.CreateMap<Category, CategoryViewModel>()
					
				;
				#endregion category

				#region user
				cfg.CreateMap<ApplicationUser, UserViewModel>()
					.ForMember(u => u.Id, opt => opt.MapFrom(src => src.Id.ToString()))
				;
				cfg.CreateMap<UserViewModel, ApplicationUser>()
					.ForMember(u => u.Id, opt => opt.MapFrom(src => Guid.Parse(src.Id)))
				;
				#endregion user
				#region role
				cfg.CreateMap<ApplicationUserRole, RoleViewModel>()
					.ForMember(r => r.Id, opt => opt.MapFrom(src => src.Id.ToString()))
				;
				cfg.CreateMap<RoleViewModel, ApplicationUserRole>()
					.ForMember(r => r.Id, opt => opt.MapFrom(src => Guid.Parse(src.Id)))
				;
				#endregion role

				#region categoryProperty
				cfg.CreateMap<CategoryProductChoosableProperty, CategoryChoosablePropertyViewModel>()
					.ForMember(p => p.Id, opt => opt.MapFrom(src => src.Id.ToString()))
					.ForMember(p => p.CategoryId, opt => opt.MapFrom(src => src.CategoryId.ToString()))
				;
				cfg.CreateMap<CategoryChoosablePropertyViewModel, CategoryProductChoosableProperty>()
					.ForMember(p => p.Id, opt => opt.MapFrom(src => Guid.Parse(src.Id)))
					.ForMember(p => p.CategoryId, opt => opt.MapFrom(src => Guid.Parse(src.CategoryId)))
				;

				cfg.CreateMap<CategoryProductMeasurableProperty, CategoryMeasurablePropertyViewModel>()
					.ForMember(p => p.Id, opt => opt.MapFrom(src => src.Id.ToString()))
					.ForMember(p => p.CategoryId, opt => opt.MapFrom(src => src.CategoryId.ToString()))
				;
				cfg.CreateMap<CategoryMeasurablePropertyViewModel, CategoryProductMeasurableProperty>()
					.ForMember(p => p.Id, opt => opt.MapFrom(src => Guid.Parse(src.Id)))
					.ForMember(p => p.CategoryId, opt => opt.MapFrom(src => Guid.Parse(src.CategoryId)))
				;
				#endregion categoryProperty
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
