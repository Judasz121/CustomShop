using CustomShopMVC.Helpers;
using Dapper;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace CustomShopMVC.Identity
{
	public class DapperUserStore : IUserStore<ApplicationUser>, IUserPasswordStore<ApplicationUser>, IDisposable
	{
        private readonly IDatabaseAccess _dbConnection;
        private readonly IPasswordHasher<ApplicationUser> _passwordHasher;

        public DapperUserStore(IDatabaseAccess dbConnection, IPasswordHasher<ApplicationUser> passwordHasher)
        {
            _dbConnection = dbConnection;
            _passwordHasher = passwordHasher;
        }

        public async Task<IdentityResult> CreateAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
			using (var conn = _dbConnection.GetDbConnection())
			{
				List<IdentityError> errors = new List<IdentityError>();

				int count = conn.ExecuteScalar<int>($"SELECT COUNT(*) FROM [Users] WHERE NormalizedUserName = '{user.UserName.ToUpper()}' AND Id != '{user.Id}'");
				if (count > 0)
					errors.Add(new IdentityError() { Code = "UserName", Description = "This username is already taken." });

				if (!string.IsNullOrEmpty(user.Email))
				{
					count = conn.ExecuteScalar<int>($"SELECT COUNT(*) FROM [Users] WHERE NormalizedEmail = '{user.Email.ToUpper()}' AND Id != '{user.Id}'");
					if (count > 0)
						errors.Add(new IdentityError() { Code = "Email", Description = "This e-mail is already taken." });
				}

                if (!string.IsNullOrEmpty(user.PhoneNumber))
                {
                    count = conn.ExecuteScalar<int>($"SELECT COUNT(*) FROM [Users] WHERE PhoneNumber = '{user.PhoneNumber.ToUpper()}' AND Id != '{user.Id}'");
                    if (count > 0)
                        errors.Add(new IdentityError() { Code = "PhoneNumber", Description = "This phone number is already taken." });
                }

                if (errors.Count() > 0)
					return IdentityResult.Failed(errors.ToArray());

				var query = $"INSERT INTO [Users](" +
				$"[Id],[UserName],[NormalizedUserName],[Email],[NormalizedEmail],[EmailConfirmed]," +
				$"[PasswordHash],[SecurityStamp],[ConcurrencyStamp],[PhoneNumber],[PhoneNumberConfirmed],[TwoFactorEnabled],[LockoutEnd],[LockoutEnabled],[AccessFailedCount],[Lock]" +
				$")" +
				$"VALUES(@Id,@UserName,@NormalizedUserName,@Email,@NormalizedEmail,@EmailConfirmed,@PasswordHash,@SecurityStamp,@ConcurrencyStamp,@PhoneNumber,@PhoneNumberConfirmed," +
				$"@TwoFactorEnabled,@LockoutEnd,@LockoutEnabled,@AccessFailedCount,@Lock)";
				var param = new DynamicParameters();
				param.Add("@Id", user.Id);
				param.Add("@UserName", user.UserName);
				param.Add("@NormalizedUserName", user.UserName.ToUpper());
				param.Add("@Email", user.Email);
				param.Add("@NormalizedEmail", string.IsNullOrEmpty(user.Email) ? null : user.Email.ToUpper());
				param.Add("@EmailConfirmed", user.EmailConfirmed);
				param.Add("@PasswordHash", user.PasswordHash);
				param.Add("@SecurityStamp", user.SecurityStamp);
				param.Add("@ConcurrencyStamp", user.ConcurrencyStamp);
				param.Add("@PhoneNumber", user.PhoneNumber);
				param.Add("@PhoneNumberConfirmed", user.PhoneNumberConfirmed);
				param.Add("@TwoFactorEnabled", user.TwoFactorEnabled);
				param.Add("@LockoutEnd", user.LockoutEnd);
				param.Add("@LockoutEnabled", user.LockoutEnabled);
				param.Add("@AccessFailedCount", user.AccessFailedCount);
				param.Add("@Lock", user.Lock);
				int result = await conn.ExecuteAsync(query, param: param, commandType: CommandType.Text);

                if(result == 0)
                    return IdentityResult.Failed(new IdentityError() { Code = "120", Description = "Unknown error occured; cannot create user." });

                query = "INSERT INTO [UserSettings] (Id, UserId) VALUES (@Id, @UserId)";
                param = new DynamicParameters();
                param.Add("@Id", Guid.NewGuid());
                param.Add("@UserId", user.Id);
                result = await conn.ExecuteAsync(query, param);


				if (result > 0)
					return IdentityResult.Success;
				else
					return IdentityResult.Failed(new IdentityError() { Code = "120", Description = "Unknown error occured; cannot create user settings." });
			}
		}

		public async Task<IdentityResult> DeleteAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            using (var conn = _dbConnection.GetDbConnection())
            {
                var query = $"DELETE FROM [Users] WHERE [Id] = @Id";
                var param = new DynamicParameters();
                param.Add("@Id", user.Id);

                var result = await conn.ExecuteAsync(query, param: param, commandType: CommandType.Text);

                if (result > 0)
                    return IdentityResult.Success;
                else
                    return IdentityResult.Failed(new IdentityError() { Code = "120", Description = "Cannot Update User!" });
            }
        }

        public void Dispose()
        {
            //Dispose();
        }

        public async Task<ApplicationUser> FindByIdAsync(string userId, CancellationToken cancellationToken)
        {
            using (var conn = _dbConnection.GetDbConnection())
            {
                var query = $"SELECT * FROM [Users] WHERE [Id] = @Id";
                var param = new DynamicParameters();
                param.Add("@Id", userId);
                return await conn.QueryFirstOrDefaultAsync<ApplicationUser>(query, param: param, commandType: CommandType.Text);
            }
        }

        public async Task<ApplicationUser> FindByNameAsync(string normalizedUserName, CancellationToken cancellationToken)
        {
            using (var conn = _dbConnection.GetDbConnection())
            {
                var query = $"SELECT * FROM [Users] WHERE [NormalizedUserName] = @normalizedUserName";
                var param = new DynamicParameters();
                param.Add("@normalizedUserName", normalizedUserName);
                return await conn.QueryFirstOrDefaultAsync<ApplicationUser>(query, param: param, commandType: CommandType.Text);
            }
        }

        public async Task<string> GetNormalizedUserNameAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();
            if (user == null) throw new ArgumentNullException(nameof(user));
            return await Task.Run(() => user.UserName.ToUpper());
        }

        public async Task<string> GetPasswordHashAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();
            if (user == null) throw new ArgumentNullException(nameof(user));
            return await Task.Run(() => user.PasswordHash);
        }

        public async Task<string> GetUserIdAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();
            if (user == null) throw new ArgumentNullException(nameof(user));
            return await Task.Run(() => user.Id.ToString());
        }

        public async Task<string> GetUserNameAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();
            if (user == null) throw new ArgumentNullException(nameof(user));
            return await Task.Run(() => user.UserName);
            //return user.UserName;
        }

        public Task<bool> HasPasswordAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();
            if (user == null) throw new ArgumentNullException(nameof(user));
            return Task.FromResult(!string.IsNullOrWhiteSpace(user.PasswordHash));
        }

        public Task SetNormalizedUserNameAsync(ApplicationUser user, string normalizedName, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();
            if (user == null) throw new ArgumentNullException(nameof(user));
            user.NormalizedUserName = normalizedName;
            return Task.FromResult<object>(null);
        }

        public Task SetPasswordHashAsync(ApplicationUser user, string passwordHash, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();
            if (user == null) throw new ArgumentNullException(nameof(user));
            user.PasswordHash = passwordHash;
            return Task.FromResult<object>(null);
        }

        public Task SetUserNameAsync(ApplicationUser user, string userName, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();
            if (user == null) throw new ArgumentNullException(nameof(user));
            user.UserName = userName;
            return Task.FromResult<object>(null);
        }

        public async Task<IdentityResult> UpdateAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            using (var conn = _dbConnection.GetDbConnection())
            {
                List<IdentityError> errors = new List<IdentityError>();

				int count = conn.ExecuteScalar<int>($"SELECT COUNT(*) FROM [Users] WHERE NormalizedUserName = '{user.UserName.ToUpper()}' AND Id != '{user.Id}'");
				if (count > 0)
					errors.Add(new IdentityError() { Code = "UserName", Description = "This username is already taken." });

				if (!string.IsNullOrEmpty(user.Email))
				{
					count = conn.ExecuteScalar<int>($"SELECT COUNT(*) FROM [Users] WHERE NormalizedEmail = '{user.Email.ToUpper()}' AND Id != '{user.Id}'");
					if (count > 0)
						errors.Add(new IdentityError() { Code = "Email", Description = "This e-mail is already taken." });
				}

                if (!string.IsNullOrEmpty(user.PhoneNumber))
                {
                    count = conn.ExecuteScalar<int>($"SELECT COUNT(*) FROM [Users] WHERE PhoneNumber = '{user.PhoneNumber}' AND Id != '{user.Id}'");
                    if (count > 0)
                        errors.Add(new IdentityError() { Code = "PhoneNumber", Description = "This phone number is already taken." });
                }

                if (errors.Count() > 0)
                    return IdentityResult.Failed(errors.ToArray());


                var query = $"UPDATE [Users]" +
                    $"SET" +
                    $"[PasswordHash] = @PasswordHash," +
                    $"[SecurityStamp] = @SecurityStamp," +
                    $"[ConcurrencyStamp] = @ConcurrencyStamp," +
                    $"[TwoFactorEnabled] = @TwoFactorEnabled," +
                    $"[LockoutEnd] = @LockoutEnd," +
                    $"[LockoutEnabled] = @LockoutEnabled," +
                    $"[AccessFailedCount] = @AccessFailedCount, " +
                    $"[UserName] = @UserName, " +
                    $"[NormalizedUserName] = @NormalizedUserName, " +
                    $"[Lock] = Lock, " +
                    $"[Email] = @Email, " +
                    $"[NormalizedEmail] = @NormalizedEmail, " +
                    $"[EmailConfirmed] = @EmailConfirmed, " + 
                    $"[PhoneNumber] = @PhoneNumber, " +
                    $"[PhoneNumberConfirmed] = @PhoneNumberConfirmed, " +
                    $"[FirstName] = @FirstName, " +
                    $"[LastName] = @LastName " +

                    $"WHERE [Id] = @Id";
                var param = new DynamicParameters();
                param.Add("@Id", user.Id);
                param.Add("@PasswordHash", user.PasswordHash);
                param.Add("@SecurityStamp", user.SecurityStamp);
                param.Add("@ConcurrencyStamp", user.ConcurrencyStamp);
                param.Add("@TwoFactorEnabled", user.TwoFactorEnabled);
                param.Add("@LockoutEnd", user.LockoutEnd);
                param.Add("@LockoutEnabled", user.LockoutEnabled);
                param.Add("@AccessFailedCount", user.AccessFailedCount);
                param.Add("@UserName", user.UserName);
                param.Add("@NormalizedUserName", user.UserName.ToUpper());
                param.Add("@Lock", user.Lock);
                param.Add("@Email", user.Email);
                param.Add("NormalizedEmail", user.Email.ToUpper());
                param.Add("@EmailConfirmed", user.EmailConfirmed);
                param.Add("@PhoneNumber", user.PhoneNumber);
                param.Add("@PhoneNumberConfirmed", user.PhoneNumberConfirmed);
                param.Add("@FirstName", user.FirstName);
                param.Add("@LastName", user.LastName);

                var result = await conn.ExecuteAsync(query, param: param, commandType: CommandType.Text);

                if (result > 0)
                    return IdentityResult.Success;
                else
                    return IdentityResult.Failed(new IdentityError() { Code = "120", Description = "Cannot Update User!" });

            }
        }
    }
}
