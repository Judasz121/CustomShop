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
using System.Net.Mail;
using System.Text.Json;
using System.Threading.Tasks;

namespace CustomShopMVC.Controllers
{
    [ApiController]
    [Route("api/{controller}")]
    public class AuthController : ControllerBase
    {
        private UserManager<ApplicationUser> _userManager;
        private SignInManager<ApplicationUser> _signInManager;
        private IDatabaseAccess _dbConnection;

        public AuthController(UserManager<ApplicationUser> userManager, IDatabaseAccess dataAccess, SignInManager<ApplicationUser> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _dbConnection = dataAccess;
		}

		[HttpPost]
		[Route("[action]")]
		public async Task<ActionResult<RegisterDataOut>> Register(UserRegisterDataIn model)
		{
			RegisterDataOut result = new RegisterDataOut();
			ApplicationUser newUser = new ApplicationUser()
			{
				UserName = model.Username,
				Email = model.Email,
				Id = Guid.NewGuid(),
			};
			IdentityResult idResult = await _userManager.CreateAsync(newUser, model.Password);
			if (!idResult.Succeeded)
			{
				result.Ok = false;
				//result.FormError = "Server Error: ";
				foreach (IdentityError item in idResult.Errors)
				{
					if (item.Code == "Password")
						result.PasswordError += item.Description + Environment.NewLine;
                    else
						if (item.Code == "UserName")
						result.UsernameError += item.Description + Environment.NewLine;
                    else
						if (item.Code == "Email")
						result.EmailError += item.Description + Environment.NewLine;
					else
						result.FormError += item.Description + Environment.NewLine;
				}

			}
			else
			{
                result.Ok = true;
			}

			return result;
		}


		[Route("[action]")]
        [HttpPost]
        public async Task<ActionResult<LoginDataOut>> LogIn(UserLoginDataIn model)
		{
            LoginDataOut result = new LoginDataOut();
            ApplicationUser user;

            if (!string.IsNullOrEmpty(model.UsernameOrEmail))
			{
                if (IsValid.Email(model.UsernameOrEmail))
                    user = await _userManager.FindByEmailAsync(model.UsernameOrEmail);
                else
                    user = await _userManager.FindByNameAsync(model.UsernameOrEmail);

                if (user != null)
                {
                    if(user.PasswordHash == null && string.IsNullOrEmpty(model.Password))
					{
                        await _signInManager.SignInAsync(user, true);
                        result.Ok = true;
                        return result;
					}
                    
                    Microsoft.AspNetCore.Identity.SignInResult signInResult = await _signInManager.PasswordSignInAsync(user, model.Password, model.RememberMe, false);
                    if (signInResult.Succeeded)
                    {        
                        result.Ok = true;
                        return result;
                    }
                    else
                    {
                        if (string.IsNullOrEmpty(model.Password))
                            result.PasswordError = "Password is required.";
                        result.PasswordError = "Incorrect password.";
                    }
                }
                else
                {
                    result.UsernameOrEmailError = "There is no user with such Email/Username.";
                    result.Ok = false;
                }
            }
			else
			{
                result.UsernameOrEmailError = "Email/Username is required.";
                result.Ok = false;
			}

            return result;
		}

        [Route("[action]")]
        [HttpPost]
        //public async Task<IActionResult> LogOut(string returnUrl = null)
        public async Task<IActionResult> LogOut(LogOutDataIn model)
		{
            await _signInManager.SignOutAsync();
			if (!string.IsNullOrEmpty(model.returnUrl))
			{
                return Redirect(model.returnUrl);
			}
			else
			{
                return RedirectToAction("LogIn", "Auth");
			}
		}


        [HttpGet]
        [Route("{action}")]
        public async Task<ActionResult<AuthStatusDataOut>> AuthStatus()
        {
            AuthStatusDataOut result = new AuthStatusDataOut() { IsLoggedIn = false };
            result.IsLoggedIn = User.Identity.IsAuthenticated;
            if (result.IsLoggedIn)
            {
                ApplicationUser user = await _userManager.GetUserAsync(User);
                result.Username = user.UserName;
                result.Email = user.Email;
            }

            return result;
		}










    }
}

