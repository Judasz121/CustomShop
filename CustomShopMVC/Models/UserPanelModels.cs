using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CustomShopMVC.DataAccess.DatabaseModels;

namespace CustomShopMVC.Models
{
	public class UserPanelModels
	{
	}
	public class UserSettingsViewModel
	{
		public string Id { get; set; }
		public string UserId { get; set; }
		public bool DarkMode { get; set; }
	}
	public class SaveSettingsDataIn
	{
		public bool DarkMode { get; set; }
	}
	public class SaveSettingsDataOut
	{
		public bool Success { get; set; }
	}
	
}
