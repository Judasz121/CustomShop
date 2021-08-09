using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CustomShopMVC.DataAccess.Identity
{
    public class CustomIdentityErrorDescriber : IdentityErrorDescriber
	{
		public override IdentityError DefaultError() { return new IdentityError { Code = nameof(DefaultError), Description = $"An unknown failure has occurred." }; }
		public override IdentityError ConcurrencyFailure() { return new IdentityError { Code = nameof(ConcurrencyFailure), Description = "Optimistic concurrency failure, object has been modified." }; }
		public override IdentityError PasswordMismatch() { return new IdentityError { Code = "Password", Description = "Incorrect password." }; }
		public override IdentityError InvalidToken() { return new IdentityError { Code = "Token", Description = "Invalid token." }; }
		public override IdentityError LoginAlreadyAssociated() { return new IdentityError { Code = "UserName", Description = "A user with this login already exists." }; }
		public override IdentityError InvalidUserName(string userName) { return new IdentityError { Code = "UserName", Description = $"User name '{userName}' is invalid, can only contain letters or digits." }; }
		public override IdentityError InvalidEmail(string email) { return new IdentityError { Code = "Email", Description = $"Email '{email}' is invalid." }; }
		public override IdentityError DuplicateUserName(string userName) { return new IdentityError { Code = "UserName", Description = $"User Name '{userName}' is already taken." }; }
		public override IdentityError DuplicateEmail(string email) { return new IdentityError { Code = "Email", Description = $"Email '{email}' is already taken." }; }
		public override IdentityError InvalidRoleName(string role) { return new IdentityError { Code = "RoleName", Description = $"Role name '{role}' is invalid." }; }
		public override IdentityError DuplicateRoleName(string role) { return new IdentityError { Code = "RoleName", Description = $"Role name '{role}' is already taken." }; }
		public override IdentityError UserAlreadyHasPassword() { return new IdentityError { Code = nameof(UserAlreadyHasPassword), Description = "User already has a password set." }; }
		public override IdentityError UserLockoutNotEnabled() { return new IdentityError { Code = nameof(UserLockoutNotEnabled), Description = "Lockout is not enabled for this user." }; }
		public override IdentityError UserAlreadyInRole(string role) { return new IdentityError { Code = "Role", Description = $"User already in role '{role}'." }; }
		public override IdentityError UserNotInRole(string role) { return new IdentityError { Code = "Role", Description = $"User is not in role '{role}'." }; }
		public override IdentityError PasswordTooShort(int length) { return new IdentityError { Code = "Password", Description = $"Passwords must be at least {length} characters long." }; }
		public override IdentityError PasswordRequiresNonAlphanumeric() { return new IdentityError { Code = "Password", Description = "Passwords must have at least one non alphanumeric character." }; }
		public override IdentityError PasswordRequiresDigit() { return new IdentityError { Code = "Password", Description = "Passwords must have at least one digit ('0'-'9')." }; }
		public override IdentityError PasswordRequiresLower() { return new IdentityError { Code = "Password", Description = "Passwords must have at least one lowercase ('a'-'z')." }; }
		public override IdentityError PasswordRequiresUpper() { return new IdentityError { Code = "Password", Description = "Passwords must have at least one uppercase ('A'-'Z')." }; }
		public override IdentityError PasswordRequiresUniqueChars(int uniqueChars)
		{
			return new IdentityError { Code = "Password", Description = "Passwords must have at least 1 different characters" };
		}
	}
}
