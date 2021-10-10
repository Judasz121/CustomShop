using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CustomShopMVC.DataAccess.DatabaseModels;
using CustomShopMVC.Helpers;
using CustomShopMVC.Models.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

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

	public class AddProductDataIn
    {
		public ProductViewModel Product { get; set; }
    }
	public class AddProductDataOut
    {
		public bool Success { get; set; }
		public string newProductId { get; set; }
		public string FormError { get; set; }
		public string NameError { get; set; }
    }
	public class SaveProductDataIn
	{
		public ProductViewModel Product { get; set; }
	}
	public class SaveProductDataOut
	{
		public bool Success { get; set; }
		public string FormError { get; set; }
		public string NameError { get; set; }
	}

	public class SaveProductImagesDataIn
	{
		public string ProductId { get; set; }
		public IFormFile NewThumbnailImage { get; set; }
		public List<IFormFile> NewImages { get; set; }
		public List<string> ImagesToDelete { get; set; }
	}
	public class SaveProductImagesDataOut
	{
		public bool Success { get; set; }
	}
	
	public class GetProductCategoriesDataIn
	{
		public string ProductId { get; set; }
	}
	public class GetProductCategoriesDataOut
	{
		public bool Success { get; set; }
		public List<string> ProductCategoriesId { get; set; }
		public List<CategoryViewModel> CategoryTree { get; set; }
		public string Error { get; set; }
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
	public class GetCategoryTreeDataOut
	{
		public List<CategoryViewModel> CategoryTree { get; set; }
	}
	public class GetProductCustomPropertiesDataIn
	{
		public string ProductId { get; set; }
	}
	public class GetProductCustomPropertiesDataOut
	{
		public bool Success { get; set; }
		public string FormError { get; set; }
		public List<CategoryProductChoosablePropertyViewModel> ChoosableProperties { get; set; }
		public List<CategoryProductMeasurablePropertyViewModel> MeasurableProperties { get; set; }
	}
	public class GetNewProductCustomPropertiesDataIn
	{
		public List<string> SelectedCategories { get; set; }

	}
	public class GetNewProductCustomPropertiesDataOut : GetProductCustomPropertiesDataOut
	{
		
	}
	#endregion category product properties
}
