using CustomShopMVC.DataAccess.DatabaseModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CustomShopMVC.Models
{
	public class AdminPanelModels
	{
	}

	#region categories

	public class GetCategoryTreeDataOut
	{
		public List<CategoryViewModel> CategoryTreeData { get; set; }
	}

	public class CategoryViewModel
	{
		public string Id { get; set; }
		public string ParentId { get; set; }
		public string Name { get;set; }

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
		public List<CategoryChoosablePropertyViewModel> ChoosableProperties { get; set; }
		public List<CategoryMeasurablePropertyViewModel> MeasurableProperties { get; set; }
		public string Error { get; set; }
		public bool Success { get; set; }
	}
	public class CategoryChoosablePropertyViewModel
	{
		public string Id { get; set; }
		public string CategoryId { get; set; }
		public string PropertyName { get; set; }
		public string PropertyNameAbbreviation { get; set; }
		public List<string> ItemsToChoose { get; set; }
	}
	public class CategoryMeasurablePropertyViewModel
	{
		public string Id { get; set; }
		public string CategoryId { get; set; }
		public string PropertyName { get; set; }
		public string PropertyNameAbbreviation { get; set; }
		public string UnitFullName { get; set; }
		public string UnitName { get; set; }
		public bool IsMetric { get; set; }
		public float ToMetricModifier { get; set; }

	}

	public class SaveCategoryProductMeasurablePropertyDataIn
	{
		public CategoryMeasurablePropertyViewModel MeasurableProperty { get; set; }
	}

	public class SaveCategoryProductMeasurablePropertyDataOut
	{
		public string newId { get; set; }
		public bool success { get; set; }
		public string formError { get; set; }
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

	public class UserViewModel
	{
		public string Id { get; set; }
		public string UserName { get; set; }
		public string Email { get; set; }
		public string FirstName { get; set; }
		public string LastName { get; set; }
		public string PhoneNumber { get; set; }
		public bool Lock { get; set; }
		public bool EmailConfirmed { get; set; }
	}

	#endregion users

	#region roles
	public class RoleViewModel
	{
		public string Id { get; set; }
		public string Name { get; set; }

	}

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
