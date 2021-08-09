﻿using AutoMapper;
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
