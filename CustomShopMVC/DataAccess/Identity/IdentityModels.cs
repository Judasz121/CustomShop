using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace CustomShopMVC.Identity
{
	public class IdentityModels
	{
	}
	public class ApplicationUserRole : IdentityRole<Guid>
	{

	}
	public class ApplicationUser : IdentityUser<Guid>
	{
		public bool Lock { get; set; } = false;
		public string FirstName { get; set; }
		public string LastName { get; set; }

	}
}

