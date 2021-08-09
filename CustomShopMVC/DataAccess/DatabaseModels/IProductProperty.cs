using System;
using System.Collections.Generic;
using System.Text;

namespace CustomShopMVC.DataAccess.DatabaseModels
{
	public interface IProductProperty
	{
		public Guid Id { get; set; }
		public string PropertyName { get; set; }
		public Guid CategoryId { get; set; }
	}
}
