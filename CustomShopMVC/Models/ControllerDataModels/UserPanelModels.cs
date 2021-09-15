using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CustomShopMVC.DataAccess.DatabaseModels;
using CustomShopMVC.Models.ViewModels;

namespace CustomShopMVC.Models.ControllerDataModels.UserPanel
{
	#region users
	public class GetUsersDataOut
	{
		public bool Success { get; set; }
		public List<UserViewModel> Users { get; set; }
		public List<string> FormErrors { get; set; }
	}
	#endregion users

	#region settings
	public class SaveSettingsDataIn
	{
		public bool DarkMode { get; set; }
	}
	public class SaveSettingsDataOut
	{
		public bool Success { get; set; }
	}
	#endregion settings

	#region products

	public class GetProductsDataOut
	{
		public List<ProductViewModel> Products { get; set; }
		public bool Success { get; set; }
	}

	public class GetProductDataOut
	{
		public ProductViewModel Product { get; set; }
		public bool Success { get; set; }
		public string Error { get; set; }
	}
	public class GetProductDataIn
	{
		public string ProductId { get; set; }
	}

	public class DeleteProductDataIn
	{
		public string ProductId { get; set; }
	}
	public class DeleteProductDataOut
	{
		public string Error { get; set; }
		public bool Success { get; set; }
	}

	public class SaveProductDataIn
	{
		public ProductEditModel Product { get; set; }
		public List<string> SelectedCategories { get; set; }
	}
	public class SaveProductDataOut
	{
		public bool Success { get; set; }
		public string FormError { get; set; }
		public string NameError { get; set; }
	}
	
	public class GetProductCategoriesDataDataIn
	{
		public string ProductId { get; set; }
	}
	public class GetProductCategoriesDataDataOut
	{
		public bool Success { get; set; }
		public List<string> ProductCategoriesId { get; set; }
		public List<CategoryViewModel> CategoryTree { get; set; }
	}
	public class SaveProductCategoriesDataIn
	{
		public string ProductId { get; set; }
		public List<string> SelectedCategories { get; set; }
	}
	public class SaveProductCategoriesDataOut
	{
		public bool Success { get; set; }
		public string Error { get; set; }
	}
	#endregion products

	#region category product properties

	public class GetProductCustomPropertiesDataIn
	{
		public string ProductId { get; set; }
	}
	public class GetProductCustomPropertiesDataOut
	{
		public bool Success { get; set; }
		public List<CategoryProductChoosableProperty> choosableProperties { get; set; }
		public List<CategoryProductMeasurableProperty> measurableProperties { get; set; }
	}
	#endregion category product properties
}
