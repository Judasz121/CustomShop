using CustomShopMVC.Identity;
using IdentityModel;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace CustomShopMVC.DataAccess.Identity
{
	public class UserCustomClaimsPrincipalFactory : UserClaimsPrincipalFactory<ApplicationUser, ApplicationUserRole>
	{
		public UserCustomClaimsPrincipalFactory(UserManager<ApplicationUser> userManager, RoleManager<ApplicationUserRole> roleManager, IOptions<IdentityOptions> optionsAccessor) : base (userManager, roleManager, optionsAccessor) { }

		public async override Task<ClaimsPrincipal> CreateAsync(ApplicationUser user)
		{
			ClaimsPrincipal principal = await base.CreateAsync(user);
			ClaimsIdentity identity = (ClaimsIdentity)principal.Identity;

			List<Claim> claims = new List<Claim>();
			claims.Add(new Claim("Id", user.Id.ToString()));

			identity.AddClaims(claims);
			return principal;
		}
	}
}
