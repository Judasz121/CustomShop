using AutoMapper;
using CustomShopMVC.DataAccess.DatabaseModels;
using CustomShopMVC.DataAccess.DatabaseModels;
using CustomShopMVC.Helpers;
using CustomShopMVC.Identity;
using CustomShopMVC.Models;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using static CustomShopMVC.Models.UserPanelModels;

namespace CustomShopMVC.Controllers
{
	[ApiController]
	[Route("API/{controller}")]
	public class UserPanelController : ControllerBase
	{
		private IDatabaseAccess _dataAccess;

		public UserPanelController(IDatabaseAccess dataAccess)
		{
			_dataAccess = dataAccess;
		}


		[HttpGet]
		[Route("{action}")]
		public async Task<ActionResult<UserSettingsViewModel>> GetSettings()
		{
			UserSettingsViewModel result = new UserSettingsViewModel();
			IMapper mapper = AutoMapperConfigs.UserPanel().CreateMapper();
			
			using (IDbConnection conn = _dataAccess.GetDbConnection())
			{
				string userId = User.Claims.Where(c => c.Type == "Id").First().Value;

				DynamicParameters param = new DynamicParameters();
				string sql = "SELECT * FROM [UsersSettings] WHERE [UserId] = @Id";
				param.Add("@Id", userId);
				
				UserSettings queryResult = (await conn.QueryAsync<UserSettings>(sql, param)).First();
				result = mapper.Map<UserSettings, UserSettingsViewModel>(queryResult);
			}
			return result;
		}

		[HttpPost]
		[Route("{action}")]
		public async Task<ActionResult<SaveSettingsDataOut>> SaveSettings(UserSettingsViewModel model)
		{
			SaveSettingsDataOut result = new SaveSettingsDataOut();
			using (IDbConnection conn = _dataAccess.GetDbConnection())
			{
				string sql = "UPDATE [UsersSettings] SET [DarkMode] = @DarkMode  WHERE [Id] = @Id";
				DynamicParameters param = new DynamicParameters();
				param.Add("@Id", model.Id);
				param.Add("@DarkMode", model.DarkMode);

				int update = await conn.ExecuteAsync(sql, param);
				if (update == 1)
					result.Success = true;
				else
					result.Success = false;
			}

			return result;
		}

	}
}
