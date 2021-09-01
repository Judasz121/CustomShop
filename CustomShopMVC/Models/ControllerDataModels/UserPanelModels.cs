using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CustomShopMVC.DataAccess.DatabaseModels;
using CustomShopMVC.Models.ViewModels;

namespace CustomShopMVC.Models.ControllerDataModels.UserPanel
{ 
	public class GetUsersDataOut
	{
		public List<UserViewModel> users { get; set; }
	}

	public class SaveSettingsDataIn
	{
		public bool DarkMode { get; set; }
	}
	public class SaveSettingsDataOut
	{
		public bool Success { get; set; }
	}

	public class GetProductsDataOut
	{
		public List<ProductViewModel> Products { get; set; }
		public bool Success { get; set; }
	}

	public class GetProductDataOut
	{
		public ProductEditModel Product { get; set; }
		public bool Success { get; set; }
	}

	public class SaveProductDataIn
	{
		public ProductEditModel Product { get; set; }

	}
	public class SaveProductDataOut
	{
		public bool Success { get; set; }
		public string FormError { get; set; }
		public string NameError { get; set; }
	}
	
	
}
