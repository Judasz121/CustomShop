using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CustomShopMVC.Models
{
	public class AuthModels
	{
	}

	public class UserRegisterDataIn
	{
		public string Username { get; set; }
		public string Email { get; set; }
		public string Password { get; set; }

	}
	public class UserLoginDataIn
	{
		public string UsernameOrEmail { get; set; }
		public string Password { get; set; }
		public bool RememberMe { get; set; }
	}
	public class LoginDataOut
	{
		public string UsernameOrEmailError { get; set; }
		public string PasswordError { get; set; }
		public string FormError { get; set; }
		public bool Ok { get; set; }
	}
	public class RegisterDataOut
	{
		public string FormError { get; set; }
		public string UsernameError { get; set; }
		public string PasswordError { get; set; }
		public string EmailError { get; set; }
		public bool Ok { get; set; }
	}

	public class AuthStatusDataOut
	{
		public string Username { get; set; }
		public string Email { get; set; }
		public bool IsLoggedIn { get; set; }
	}

	public class LogOutDataIn
	{
		public string returnUrl { get; set; }
	}
}
