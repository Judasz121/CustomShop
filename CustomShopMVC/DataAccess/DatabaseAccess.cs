using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;

namespace CustomShopMVC
{
	public interface IDatabaseAccess
	{
		IDbConnection GetDbConnection();
	}
	public class DatabaseAccess : IDatabaseAccess
	{
		private readonly IConfiguration _config;
		public DatabaseAccess(IConfiguration config)
		{
			_config = config;
		}
		public IDbConnection GetDbConnection()
		{
			return new SqlConnection(_config.GetConnectionString("CustomShopDb"));
		}

		public string GetConnectionString(string name)
		{
			throw new NotImplementedException();
		}
		public StoreImageFileResult StoreImageFile()
		{
			throw new NotImplementedException();
		}

	}
	public class StoreImageFileResult
	{
		public bool Success { get; set; }
		public string ErrorDescription { get; set; }
	}
}
