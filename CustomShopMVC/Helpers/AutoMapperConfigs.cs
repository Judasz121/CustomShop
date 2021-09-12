using AutoMapper;
using CustomShopMVC.DataAccess.DatabaseModels;
using CustomShopMVC.Identity;
using CustomShopMVC.Models;
using CustomShopMVC.Models.ControllerDataModels.AdminPanel;
using CustomShopMVC.Models.ViewModels;
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

				#region categoryProperties
				cfg.CreateMap<CategoryProductChoosableProperty, CategoryProductChoosablePropertyViewModel>()
					.ForMember(p => p.Id, opt => opt.MapFrom(src => src.Id.ToString()))
					.ForMember(p => p.CategoryId, opt => opt.MapFrom(src => src.CategoryId.ToString()))
					.ForMember(p => p.ItemsToChoose, opt => opt.MapFrom(src => src.ItemsToChoose.Split(',', StringSplitOptions.None).ToList()))
				;
				cfg.CreateMap<CategoryProductChoosablePropertyViewModel, CategoryProductChoosableProperty>()
					.ForMember(p => p.Id, opt => opt.MapFrom(src => Guid.Parse(src.Id)))
					.ForMember(p => p.CategoryId, opt => opt.MapFrom(src => Guid.Parse(src.CategoryId)))
					.ForMember(p => p.ItemsToChoose, opt => opt.MapFrom<CategoryChoosablePropertyValueResolver>())
				;
				cfg.CreateMap<CategoryProductChoosableProperty, ParentCategoryProductChoosablePropertyViewModel>()
					.ForMember(p => p.Id, opt => opt.MapFrom(src => src.Id.ToString()))
					.ForMember(p => p.CategoryId, opt => opt.MapFrom(src => src.CategoryId.ToString()))
					.ForMember(p => p.ItemsToChoose, opt => opt.MapFrom(src => src.ItemsToChoose.Split(',', StringSplitOptions.None).ToList()))
				;

				cfg.CreateMap<CategoryProductMeasurableProperty, CategoryProductMeasurablePropertyViewModel>()
					.ForMember(p => p.Id, opt => opt.MapFrom(src => src.Id.ToString()))
					.ForMember(p => p.CategoryId, opt => opt.MapFrom(src => src.CategoryId.ToString()))
				;
				cfg.CreateMap<CategoryProductMeasurablePropertyViewModel, CategoryProductMeasurableProperty>()
					.ForMember(p => p.Id, opt => opt.MapFrom(src => Guid.Parse(src.Id)))
					.ForMember(p => p.CategoryId, opt => opt.MapFrom(src => Guid.Parse(src.CategoryId)))
				;
				cfg.CreateMap<CategoryProductMeasurableProperty, ParentCategoryProductMeasurablePropertyViewModel>()
					.ForMember(p => p.Id, opt => opt.MapFrom(src => src.Id.ToString()))
					.ForMember(p => p.CategoryId, opt => opt.MapFrom(src => src.CategoryId.ToString()))
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
				cfg.CreateMap<ApplicationUser, UserViewModel>()
					.ForMember(u => u.Id, opt => opt.MapFrom(src => src.Id.ToString()))
				;
			});
		}

		public static MapperConfiguration UserPanel()
		{
			return new MapperConfiguration((cfg) =>
			{

				#region settings
				cfg.CreateMap<UserSettings, UserSettingsViewModel>()
					.ForMember(us => us.Id, (opt) => opt.MapFrom(src => src.Id.ToString()))
					.ForMember(us => us.UserId, (opt) => opt.MapFrom(src => src.UserId.ToString()))
				;
				cfg.CreateMap<UserSettingsViewModel, UserSettings>()
					.ForMember(us => us.Id, opt => opt.MapFrom(src => Guid.Parse(src.Id)))
					.ForMember(us => us.UserId, opt => opt.MapFrom(src => Guid.Parse(src.UserId)))
				;
				#endregion settings

				#region products
				cfg.CreateMap<ProductViewModel, Product>()
					.ForMember(p => p.AuthorId, opt => opt.MapFrom(src => Guid.Parse(src.AuthorId)))
					.ForMember(p => p.OwnerId, opt => opt.MapFrom(src => Guid.Parse(src.OwnerId)))
					.ForMember(p => p.Id, opt => opt.MapFrom(src => Guid.Parse(src.Id)))
					
				;
				cfg.CreateMap<Product, ProductViewModel>()
					.ForMember(p => p.AuthorId, opt => opt.MapFrom(src => src.AuthorId.ToString()))
					.ForMember(p => p.OwnerId, opt => opt.MapFrom(src => src.OwnerId.ToString()))
					.ForMember(p => p.Id, opt => opt.MapFrom(src => src.Id.ToString()))
					.ForMember(p => p.ImagesPath, opt => opt.MapFrom((src) => src.Images.Select(i => i.ImagePath)))
				;
				#endregion products

				#region users
				cfg.CreateMap<ApplicationUser, UserViewModel>()
					.ForMember(u => u.Id, opt => opt.MapFrom(src => src.Id.ToString()))
				;
				cfg.CreateMap<UserViewModel, ApplicationUser>()
					.ForMember(u => u.Id, opt => opt.MapFrom(src => Guid.Parse(src.Id)))
				;
				#endregion users

				#region categories 
				cfg.CreateMap<Category, CategoryViewModel>()
					.ForMember(c => c.Id, opt => opt.MapFrom(src => src.Id.ToString()))
					.ForMember(c => c.ParentId, opt => opt.MapFrom(src => src.ParentId.ToString()))
				;
				#endregion
			});
		}
	}
	public class CategoryChoosablePropertyValueResolver : IValueResolver<CategoryProductChoosablePropertyViewModel, CategoryProductChoosableProperty, string>
	{
		public string Resolve(CategoryProductChoosablePropertyViewModel source, CategoryProductChoosableProperty destination, string member, ResolutionContext context)
		{
			string result = "";
			for (int i = 0; i < source.ItemsToChoose.Count; i++)
			{
				if (i == 0)
					result = source.ItemsToChoose[i];
				else
					result += "," + source.ItemsToChoose[i];
			}
			return result;
		}
	}
}
