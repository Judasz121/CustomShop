using CustomShopMVC.DataAccess.DatabaseModels;
using CustomShopMVC.Models.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CustomShopMVC.Models.ControllerDataModels.AdminPanel
{

	#region categories

	public class GetCategoryTreeDataOut
	{
		public List<CategoryViewModel> CategoryTreeData { get; set; }
	}

	public class CategoryTreeDataIn
	{
		public List<CategoryViewModel> categories { get; set; }
	}

	public class InsertCategoryTreeDataOut
	{
		public bool Success { get; set; }
		public string ErrorMsg { get; set; }
	}

	public class GetCategoryPropertiesDataIn
	{
		public string CategoryId { get; set; }
	}
	public class GetCategoryPropertiesDataOut
	{
		public List<CategoryProductChoosablePropertyViewModel> ChoosableProperties { get; set; }
		public List<CategoryProductMeasurablePropertyViewModel> MeasurableProperties { get; set; }
		public string Error { get; set; }
		public bool Success { get; set; }
	}

	

	public class SaveCategoryProductMeasurablePropertyDataIn
	{
		public CategoryProductMeasurablePropertyViewModel MeasurableProperty { get; set; }
	}

	public class SaveCategoryProductMeasurablePropertyDataOut
	{
		public string NewId { get; set; }
		public bool Success { get; set; }
		public string FormError { get; set; }
		public string NameError { get; set; }
	}


	public class SaveCategoryProductChoosablePropertyDataIn
	{
		public CategoryProductChoosablePropertyViewModel ChoosableProperty { get; set; }
	}

	public class SaveCategoryProductChoosablePropertyDataOut
	{
		public bool Success { get; set; }
		public string NewId { get; set; }
		public string FormError { get; set; }
		public string NameError { get; set; }

	}

	public class DeleteCategoryProductPropertyDataIn
	{
		public string PropertyId { get; set; }
		public bool IsChoosableProperty { get; set; }
	}

	public class DeleteCategoryProductPropertyDataOut
	{
		public bool Success { get; set; }
		public string FormError { get; set; }

	}

	#endregion categories

	#region users
	public class GetUsersDataOut
	{
		public List<UserViewModel> users { get; set; }
	}
	public class SaveUserDataOut
	{
		public bool Success { get; set; }
		public string NewUserId { get; set; }
		public string FormError { get; set; }
		public string UserNameError { get; set; }
		public string EmailError { get; set; }
		public string PhoneNumberError { get; set; }
	}



	#endregion users

	#region roles


	public class GetRolesDataOut
	{
		public List<RoleViewModel> Roles { get; set; }
	}

	public class SaveRoleDataOut
	{
		public bool Success { get; set; }
		public string RoleNameError { get; set; }
		public string FormError { get; set; }
		public string newRoleId { get; set; }
	}

	#endregion roles
}
