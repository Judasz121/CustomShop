using System;
using System.Collections.Generic;
using System.Text;

namespace CustomShopMVC.DataAccess.DatabaseModels
{
	public interface ICategoryProductProperty
	{
		public Guid Id { get; set; }
		public Guid CategoryId { get; set; }
		public string PropertyNameAbbreviation { get; set; }
	}
}
