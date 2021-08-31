using CustomShopMVC.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CustomShopMVC.DataAccess.DatabaseModels
{
	public class UserSettings
	{
		public Guid Id { get; set; }
		public Guid UserId { get; set; }
		public bool DarkMode { get; set; }

		#region relations
		public ApplicationUser User { get; set; }
		#endregion
	}
}
