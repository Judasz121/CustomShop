using AutoMapper;
using CustomShopMVC.DataAccess.DatabaseModels;
using CustomShopMVC.Helpers;
using CustomShopMVC.Identity;
using CustomShopMVC.Models;
using Dapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace CustomShopMVC.Controllers
{
	[ApiController]
	[Route("API/{controller}")]
	public class AdminPanelController : ControllerBase
	{
		private UserManager<ApplicationUser> _userManager;
		private SignInManager<ApplicationUser> _signInManager;
		private RoleManager<ApplicationUserRole> _roleManager;
		private IDatabaseAccess _dataAccess;

		public AdminPanelController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IDatabaseAccess databaseAccess, RoleManager<ApplicationUserRole> roleManager)
		{
			_userManager = userManager;
			_signInManager = signInManager;
			_dataAccess = databaseAccess;
			_roleManager = roleManager;
		}

		#region categories

		[HttpGet]
		[Route("{action}")]

		public async Task<ActionResult<GetCategoryTreeDataOut>> GetCategoryTree()
		{
			GetCategoryTreeDataOut result = new GetCategoryTreeDataOut();
			IMapper mapper = AutoMapperConfigs.AdminPanel().CreateMapper();

			using (IDbConnection conn = _dataAccess.GetDbConnection())
			{
				string sql = "SELECT * FROM [Categories]";
				IEnumerable<Category> sqlResult = conn.Query<Category>(sql);
				result.CategoryTreeData = mapper.Map<IEnumerable<Category>, IEnumerable<CategoryViewModel>>(sqlResult).ToList();
			}

			return result;
		}

		[HttpPost]
		[Route("{action}")]
		public async Task<ActionResult<InsertCategoryTreeDataOut>> InsertCategoryTree(CategoryTreeDataIn model)
		{
			InsertCategoryTreeDataOut result = new InsertCategoryTreeDataOut();
			IMapper mapper = AutoMapperConfigs.AdminPanel().CreateMapper();

			#region assign Guids to new categories
			foreach (CategoryViewModel item in model.categories)
			{
				if (!Guid.TryParse(item.Id, out Guid id))
				{
					string oldId = item.Id;
					Guid newId = Guid.NewGuid();
					model.categories[model.categories.IndexOf(item)].Id = newId.ToString();

					IEnumerable<CategoryViewModel> toChange = model.categories.Where<CategoryViewModel>(c => c.ParentId == oldId);
					foreach (CategoryViewModel item1 in toChange)
					{
						int index = model.categories.IndexOf(item1);
						model.categories[index].ParentId = newId.ToString();
					}
				}
			}
			#endregion

			#region save to db
			IEnumerable<Category> dataToQuery = mapper.Map<List<CategoryViewModel>, IEnumerable<Category>>(model.categories);
			using (IDbConnection conn = _dataAccess.GetDbConnection())
			{
				bool categoriesTableEmpty = conn.ExecuteScalar<int>("SELECT COUNT(*) FROM [Categories]") == 0 ? true : false;
				int delete = 0;
				if (!categoriesTableEmpty)
					delete = conn.Execute("DELETE FROM [Categories]");

				if (delete == 0 && !categoriesTableEmpty)
				{
					result.Success = false;
					result.ErrorMsg = "Could not clear categories table before updating";
				}
				else
				{
					string sql = "INSERT INTO [Categories] VALUES (@Id, @ParentId, @Name)";
					int insert = 0;
					foreach (Category item in dataToQuery)
					{
						DynamicParameters param = new DynamicParameters();
						param.Add("@Id", item.Id);
						param.Add("@ParentId", item.ParentId);
						param.Add("@Name", item.Name);
						insert = insert + conn.Execute(sql, param);
					}

					if (insert == 0)
					{
						result.Success = false;
						result.ErrorMsg = "Could not insert into categries.";
					}
					else
					{
						result.Success = true;
					}
				}
				#endregion
				return result;
			}			
		}



		[HttpPost]
		[Route("{action}")]
		public async Task<ActionResult<GetCategoryPropertiesDataOut>> GetCategoryProperties(GetCategoryPropertiesDataIn model)
		{
			GetCategoryPropertiesDataOut result = new GetCategoryPropertiesDataOut();
			IMapper mapper = AutoMapperConfigs.AdminPanel().CreateMapper();

			if (string.IsNullOrEmpty(model.CategoryId))
			{
				result.Error = "Category Id is requierd";
				return result;
			}
			using (IDbConnection conn = _dataAccess.GetDbConnection())
			{
				string sql = "SELECT * FROM [CategoryProductChoosableProperties] WHERE [CategoryId] = @CategoryId";
				DynamicParameters param = new DynamicParameters();
				param.Add("@CategoryId", model.CategoryId);
				IEnumerable<CategoryProductChoosableProperty> sqlSelect = conn.Query<CategoryProductChoosableProperty>(sql, param);
				result.ChoosableProperties = mapper.Map<IEnumerable<CategoryProductChoosableProperty>, List<CategoryProductChoosablePropertyViewModel>>(sqlSelect);

				sql = "SELECT * FROM [CategoryProductMeasurableProperties] WHERE [CategoryId] = @CategoryId";
				param = new DynamicParameters();
				param.Add("@CategoryId", model.CategoryId);
				IEnumerable<CategoryProductMeasurableProperty> sqlSelect2 = conn.Query<CategoryProductMeasurableProperty>(sql, param);
				result.MeasurableProperties = mapper.Map<IEnumerable<CategoryProductMeasurableProperty>, List<CategoryProductMeasurablePropertyViewModel>>(sqlSelect2);
				result.Success = true;
			}
			
			return result;
		}
		
		[HttpPost]
		[Route("{action}")]
		public async Task<ActionResult<SaveCategoryProductMeasurablePropertyDataOut>> SaveCategoryProductMeasurableProperty(SaveCategoryProductMeasurablePropertyDataIn model)
		{
			IMapper mapper = AutoMapperConfigs.AdminPanel().CreateMapper();
			SaveCategoryProductMeasurablePropertyDataOut result = new SaveCategoryProductMeasurablePropertyDataOut();
			if (model.MeasurableProperty.Id.Contains("new"))
			{
				Guid newId = Guid.NewGuid();
				string sql;
				int insert;
				int count;
				DynamicParameters param = new DynamicParameters();
				param.Add("@Id", newId);
				param.Add("@CategoryId", model.MeasurableProperty.CategoryId);
				param.Add("@PropertyName", model.MeasurableProperty.PropertyName);
				param.Add("@PropertyNameAbbreviation", model.MeasurableProperty.PropertyNameAbbreviation);
				param.Add("@UnitFullName", model.MeasurableProperty.UnitFullName);
				param.Add("@UnitName", model.MeasurableProperty.UnitName);
				param.Add("@IsMetric", model.MeasurableProperty.IsMetric);
				param.Add("@ToMetricModifier", model.MeasurableProperty.ToMetricModifier);
				using (IDbConnection conn = _dataAccess.GetDbConnection())
				{


					sql = "SELECT COUNT(*) FROM [CategoryProductMeasurableProperties] WHERE [CategoryId] = @CategoryId AND [PropertyName] = @PropertyName OR [PropertyNameAbbreviation] = @PropertyNameAbbreviation";
					count = conn.ExecuteScalar<int>(sql, param);
					if(count > 0)
					{
						result.Success = false;
						result.NameError = "There already exists property with this name or name abbreviation";
						return result;
					}
					
					 sql = "INSERT INTO [CategoryProductMeasurableProperties] VALUES(@Id, @CategoryId, @PropertyName, @PropertyNameAbbreviation, @UnitFullName, @UnitName, @IsMetric, @ToMetricModifier)";

					

					insert = conn.Execute(sql, param);
				}
				if(insert == 0)
				{
					result.Success = false;
					result.FormError = "Could not insert into DB.";
					return result;
				}
				else
				{
					result.Success = true;
					result.NewId = newId.ToString();
					return result;
				}
			}
			else
			{
				string sql;
				int update;
				int count;
				DynamicParameters param = new DynamicParameters();
				param.Add("@Id", model.MeasurableProperty.Id);
				param.Add("@CategoryId", model.MeasurableProperty.CategoryId);
				param.Add("@PropertyName", model.MeasurableProperty.PropertyName);
				param.Add("@PropertyNameAbbreviation", model.MeasurableProperty.PropertyNameAbbreviation);
				param.Add("@UnitFullName", model.MeasurableProperty.UnitFullName);
				param.Add("@UnitName", model.MeasurableProperty.UnitName);
				param.Add("@IsMetric", model.MeasurableProperty.IsMetric);
				param.Add("@ToMetricModifier", model.MeasurableProperty.ToMetricModifier);
				using (IDbConnection conn = _dataAccess.GetDbConnection())
				{
					sql = "UPDATE [CategoryProductMeasurableProperties] SET [CategoryId] = @CategoryId, [PropertyName] = @PropertyName, [PropertyNameAbbreviation] = @PropertyNameAbbreviation, [UnitFullName] = @UnitFullName, [UnitName] = @UnitName, [IsMetric] = @IsMetric, [ToMetricModifier] = @ToMetricModifier WHERE [Id] = @Id";
					update = conn.Execute(sql, param);
					if(update == 0)
					{
						result.FormError = "Could not insert into DB";
						result.Success = false;
						return result;
					}
					else
					{
						result.Success = true;
						return result;
					}
				}
			}
			return result;
		}
		[HttpPost]
		[Route("{action}")]
		public async Task<ActionResult<SaveCategoryProductChoosablePropertyDataOut>> SaveCategoryProductChoosableProperty(SaveCategoryProductChoosablePropertyDataIn model)
		{
			IMapper mapper = AutoMapperConfigs.AdminPanel().CreateMapper();
			SaveCategoryProductChoosablePropertyDataOut result = new SaveCategoryProductChoosablePropertyDataOut();
			if (model.ChoosableProperty.Id.Contains("new"))
			{
				Guid newId = Guid.NewGuid();
				model.ChoosableProperty.Id = newId.ToString();
				string sql;
				int insert;
				int count;				
				CategoryProductChoosableProperty newProp = mapper.Map<CategoryProductChoosablePropertyViewModel, CategoryProductChoosableProperty>(model.ChoosableProperty);
				DynamicParameters param = new DynamicParameters();
				param.Add("@Id", newProp.Id);
				param.Add("@CategoryId", newProp.CategoryId);
				param.Add("@PropertyName", newProp.PropertyName);
				param.Add("@PropertyNameAbbreviation", newProp.PropertyNameAbbreviation);
				param.Add("@ItemsToChoose", newProp.ItemsToChoose);
				using (IDbConnection conn = _dataAccess.GetDbConnection())
				{
					sql = "SELECT COUNT(*) FROM [CategoryProductChoosableProperties] WHERE [Id] != @Id AND [CategoryId] = @CategoryId AND ([PropertyName] = @PropertyName OR [PropertyNameAbbreviation] = @PropertyNameAbbreviation)";
					count = conn.ExecuteScalar<int>(sql, param);
					if (count > 0)
					{
						result.Success = false;
						result.NameError = "There already exists property with this name or name abbreviation";
						return result;
					}

					sql = "INSERT INTO [CategoryProductChoosableProperties] VALUES(@Id, @CategoryId, @PropertyName, @PropertyNameAbbreviation, @ItemsToChoose)";



					insert = conn.Execute(sql, param);
				}
				if (insert == 0)
				{
					result.Success = false;
					result.FormError = "Could not insert into DB.";
				}
				else
				{
					result.Success = true;
					result.NewId = newId.ToString();
				}
			}
			else
			{
				string sql;
				int update;
				int count;
				CategoryProductChoosableProperty editedProp = mapper.Map<CategoryProductChoosablePropertyViewModel, CategoryProductChoosableProperty>(model.ChoosableProperty);
				DynamicParameters param = new DynamicParameters();
				param.Add("@Id", editedProp.Id);
				param.Add("@CategoryId", editedProp.CategoryId);
				param.Add("@PropertyName", editedProp.PropertyName);
				param.Add("@PropertyNameAbbreviation", editedProp.PropertyNameAbbreviation);
				param.Add("@ItemsToChoose", editedProp.ItemsToChoose);
				using (IDbConnection conn = _dataAccess.GetDbConnection())
				{
					sql = "SELECT COUNT(*) FROM [CategoryProductChoosableProperties] WHERE [Id] != @Id AND [CategoryId] = @CategoryId AND ([PropertyName] = @PropertyName OR [PropertyNameAbbreviation] = @PropertyNameAbbreviation)";
					count = conn.ExecuteScalar<int>(sql, param);
					if (count > 0)
					{
						result.NameError = "There already exists property with this name or name abbreviation";
						result.Success = false;
						return result;
					}

					sql = "UPDATE [CategoryProductChoosableProperties] SET [CategoryId] = @CategoryId, [PropertyName] = @PropertyName, [PropertyNameAbbreviation] = @PropertyNameAbbreviation, [ItemsToChoose] = @ItemsToChoose WHERE [Id] = @Id";
					update = conn.Execute(sql, param);
					if (update == 0)
					{
						result.FormError = "Could not insert into DB";
						result.Success = false;
						return result;
					}
					else
					{
						result.Success = true;
						return result;
					}

				}
			}
			return result;
		}

		[HttpPost]
		[Route("{action}")]
		public async Task<ActionResult<DeleteCategoryProductPropertyDataOut>> DeleteCategoryProductProperty(DeleteCategoryProductPropertyDataIn model)
		{
			DeleteCategoryProductPropertyDataOut result = new DeleteCategoryProductPropertyDataOut();
			string sql;
			DynamicParameters param = new DynamicParameters();
			int delete = 0;

			using (IDbConnection conn = _dataAccess.GetDbConnection())
			{
				param.Add("@Id", model.PropertyId);
				if (model.IsChoosableProperty)
				{
					sql = "DELETE FROM [CategoryProductChoosableProperties] WHERE [Id] = @Id";
					delete = await conn.ExecuteAsync(sql, param);
				}
				else
				{
					sql = "DELETE FROM [CategoryProductMeasurableProperties] WHERE [Id] = @Id";
					delete = await conn.ExecuteAsync(sql, param);
				}
			}
			if (delete == 0)
			{
				result.Success = false;
				result.FormError = "Error; couldn't delete the property";
			}
			else
			{
				result.Success = true;
			}
			return result;
		}

		#endregion


		#region users
		[HttpGet]
		[Route("{action}")]
		public async Task<ActionResult<GetUsersDataOut>> GetUsers()
		{
			GetUsersDataOut result = new GetUsersDataOut();
			IMapper mapper = AutoMapperConfigs.AdminPanel().CreateMapper();

			using (IDbConnection conn = _dataAccess.GetDbConnection())
			{
				string sql = "SELECT * FROM [Users]";

				List<ApplicationUser> dbUsers = conn.Query<ApplicationUser>(sql).ToList();
				result.users = mapper.Map<List<ApplicationUser>, List<UserViewModel>>(dbUsers);
			}
				return result;
		}

		[HttpPost]
		[Route("{action}")]
		public async Task<ActionResult<SaveUserDataOut>> SaveUser(UserViewModel model)
		{
			SaveUserDataOut result = new SaveUserDataOut();
			IMapper mapper = AutoMapperConfigs.AdminPanel().CreateMapper();
			result.Success = true;

			if (model.Id.Contains("new"))
			{
				model.Id = null;
				ApplicationUser user = mapper.Map<UserViewModel, ApplicationUser>(model);
				user.Id = Guid.NewGuid();


				IdentityResult IR = await _userManager.CreateAsync(user);
				if (!IR.Succeeded)
				{
					result.Success = false;
					foreach (IdentityError item in IR.Errors)
					{
						if (item.Code == "UserName")
							result.UserNameError += item.Description + Environment.NewLine;
						else if (item.Code == "Email")
							result.EmailError += item.Description + Environment.NewLine;
						else if (item.Code == "PhoneNumber")
							result.PhoneNumberError += Environment.NewLine;
						else
							result.FormError += item.Description + Environment.NewLine;
					}
				}
				else
				{
					result.NewUserId = user.Id.ToString();
					result.Success = true;
				}
			}
			else
			{
				using (IDbConnection conn = _dataAccess.GetDbConnection())
				{
					string sql = "SELECT COUNT(*) FROM [Users] WHERE Id = @Id";
					DynamicParameters param = new DynamicParameters();
					param.Add("@Id", model.Id);
					int count = conn.ExecuteScalar<int>(sql, param);
					if (count == 0)
					{
						result.Success = false;
						result.FormError = "Could not find a user with this Id";
					}
					else
					{
						ApplicationUser user = mapper.Map<UserViewModel, ApplicationUser>(model);
						IdentityResult IR = await _userManager.UpdateAsync(user);
						if (!IR.Succeeded)
						{
							result.Success = false;
							foreach (IdentityError item in IR.Errors)
							{
								if (item.Code == "UserName")
									result.UserNameError += item.Description + Environment.NewLine;
								else if (item.Code == "Email")
									result.EmailError += item.Description + Environment.NewLine;
								else if (item.Code == "PhoneNumber")
									result.PhoneNumberError += item.Description + Environment.NewLine;
								else
									result.FormError += item.Description + Environment.NewLine;
							}
						}
						else
						{
							result.Success = true;
							result.FormError = "Successfully saved.";
						}
					}

				}
			}
			return result;
		}
		#endregion


		#region roles 

		[HttpGet]
		[Route("{action}")]
		public async Task<ActionResult<GetRolesDataOut>> GetRoles()
		{
			GetRolesDataOut result = new GetRolesDataOut();
			IMapper mapper = AutoMapperConfigs.AdminPanel().CreateMapper();

			using (IDbConnection conn = _dataAccess.GetDbConnection())
			{
				string sql = "SELECT * FROM [Roles]";

				IEnumerable<ApplicationUserRole> dbRoles = conn.Query<ApplicationUserRole>(sql);
				result.Roles = mapper.Map<IEnumerable<ApplicationUserRole>, List<RoleViewModel>>(dbRoles);
			}
			return result;
		}

		[HttpPost]
		[Route("[action]")]
		public async Task<ActionResult<SaveRoleDataOut>> SaveRole(RoleViewModel model)
		{
			IMapper mapper = AutoMapperConfigs.AdminPanel().CreateMapper();
			SaveRoleDataOut result = new SaveRoleDataOut();

			using (IDbConnection conn = _dataAccess.GetDbConnection())
			{
				if (model.Id.Contains("new"))
				{
					ApplicationUserRole role = new ApplicationUserRole()
					{
						Id = Guid.NewGuid(),
						Name = model.Name,
					};

					IdentityResult IR = await _roleManager.CreateAsync(role);
					if(IR.Succeeded)
					{
						result.Success = true;
						result.newRoleId = role.Id.ToString();
						return result;
					}
					else
					{
						foreach(IdentityError item in IR.Errors)
						{
							if(item.Code == "RoleName")
							{
								result.RoleNameError += item.Description + Environment.NewLine;
							}
							else
							{
								result.FormError += item.Description + Environment.NewLine;
							}
						}
						return result;
					}
				}
				else // role.id doesnt contain "new"
				{
					ApplicationUserRole role = mapper.Map<RoleViewModel, ApplicationUserRole>(model);
					IdentityResult IR = await _roleManager.UpdateAsync(role);
					if (IR.Succeeded)
					{
						result.Success = true;
						return result;
					}
					else
					{
						foreach (IdentityError item in IR.Errors)
						{
							if (item.Code == "RoleName")
							{
								result.RoleNameError += item.Description + Environment.NewLine;
							}
							else
							{
								result.FormError += item.Description + Environment.NewLine;
							}
						}
						return result;
					}
				}
			}
		}

		#endregion 
	}
}
