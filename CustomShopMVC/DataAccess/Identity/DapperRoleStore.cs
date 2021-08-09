using Microsoft.AspNetCore.Identity;
using Dapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Data;

namespace CustomShopMVC.Identity
{
	public class DapperRoleStore : IRoleStore<ApplicationUserRole>, IDisposable
	{
        private IDatabaseAccess _dataAccess;
        public DapperRoleStore(IDatabaseAccess dbConnection)
        {
            _dataAccess = dbConnection;
        }
        public async Task<IdentityResult> CreateAsync(ApplicationUserRole role, CancellationToken cancellationToken)
        {
            string sql = "INSERT INTO [Roles] VALUES(@Id, @Name, @NormalizedName, @ConcurrencyStamp);";
            int result;
            DynamicParameters param = new DynamicParameters();
            param.Add("@Id", role.Id);
            param.Add("@Name", role.Name);
            param.Add("@NormalizedName", role.NormalizedName);
            param.Add("@ConcurrencyStamp", role.ConcurrencyStamp);

            using (IDbConnection conn = _dataAccess.GetDbConnection())
            {
                result = await conn.ExecuteAsync(sql, param);
            }
            if (result > 0)
                return IdentityResult.Success;
            else
                return IdentityResult.Failed(new IdentityError() { Code = "120", Description = "Cannot Update Role!", });
        }

        public async Task<IdentityResult> DeleteAsync(ApplicationUserRole role, CancellationToken cancellationToken)
        {
            string sql = "DELETE FROM [Roles] WHERE [Id] = @Id;";
            int result;
            DynamicParameters param = new DynamicParameters();
            param.Add("@Id", role.Id);

            using (IDbConnection conn = _dataAccess.GetDbConnection())
			{
                result = await conn.ExecuteAsync(sql, param);
			}

            if (result > 0)
                return IdentityResult.Success;
            else
                return IdentityResult.Failed(new IdentityError() { Code = "120", Description = "Cannot Update Role!", });
        }

        public void Dispose()
        {
            //Dispose();
        }

        public async Task<ApplicationUserRole> FindByIdAsync(string roleId, CancellationToken cancellationToken)
        {
            string sql = "SELECT * FROM [Roles] WHERE [Id] = @Id";
            DynamicParameters param = new DynamicParameters();
            param.Add("@Id", roleId);
            ApplicationUserRole role;
            using (IDbConnection conn = _dataAccess.GetDbConnection())
			{
                role = await conn.QuerySingleOrDefaultAsync(sql, param);
			}
            return role;
        }

        public async Task<ApplicationUserRole> FindByNameAsync(string normalizedRoleName, CancellationToken cancellationToken)
        {
            string sql = "SELECT * FROM [Roles] WHERE [NormalizedName] = @normalizedRoleName";
            DynamicParameters param = new DynamicParameters();
            param.Add("@normalizedRoleName", normalizedRoleName);
            ApplicationUserRole role;
            using (IDbConnection conn = _dataAccess.GetDbConnection())
            {
                role = await conn.QuerySingleOrDefaultAsync<ApplicationUserRole>(sql, param);
            }
            return role;
        }

        public async Task<IdentityResult> UpdateAsync(ApplicationUserRole role, CancellationToken cancellationToken)
        {
            string sql = "UPDATE [Roles] SET [Name] = @Name, [NormalizedName] = @NormalizedName, [ConcurrencyStamp] = @ConcurrencyStamp WHERE [Id] = @Id";
            DynamicParameters param = new DynamicParameters();
            param.Add("@Id", role.Id);
            param.Add("@Name", role.Name);
            param.Add("@NormalizedName", role.NormalizedName);
            param.Add("@ConcurrencyStamp", role.ConcurrencyStamp);
            int result;
     
            using (IDbConnection conn = _dataAccess.GetDbConnection())
			{
                result = await conn.ExecuteAsync(sql, param);
			}
            if (result > 0)
                return IdentityResult.Success;
            else
                return IdentityResult.Failed(new IdentityError() { Code = "120", Description = "Cannot Update Role!", });
        }


        public async Task<string> GetNormalizedRoleNameAsync(ApplicationUserRole role, CancellationToken cancellationToken)
        {
            return role.Name.ToUpper();
        }

        public async Task<string> GetRoleIdAsync(ApplicationUserRole role, CancellationToken cancellationToken)
        {
            return role.Id.ToString();
        }

        public async Task<string> GetRoleNameAsync(ApplicationUserRole role, CancellationToken cancellationToken)
        {
            return role.Name;
        }

        public Task SetNormalizedRoleNameAsync(ApplicationUserRole role, string normalizedName, CancellationToken cancellationToken)
        {
            role.NormalizedName = normalizedName;
            return Task.CompletedTask;
        }

        public Task SetRoleNameAsync(ApplicationUserRole role, string roleName, CancellationToken cancellationToken)
        {
            role.Name = roleName;
            return Task.CompletedTask;
        }

    }
}
