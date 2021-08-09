using System;
using System.Collections.Generic;
using System.Text;

namespace CustomShopMVC.DataAccess.DatabaseModels
{
	public class Category
	{
		public Guid Id { get; set; }
		public Guid ParentId { get; set; }
		public string Name { get; set; }
		public virtual Category ParentCategory { get; set; }

	}
}
