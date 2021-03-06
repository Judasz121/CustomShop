using CustomShopMVC.DataAccess.DatabaseModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CustomShopMVC.DataAccess.DatabaseModels
{
	public class Category_Product
	{
		public Guid Id { get; set; }
		public Guid ProductId { get; set; }
		public Guid CategoryId { get; set; }

		#region relations
		public Product Product { get; set; }
		public Category Category { get; set; }
		#endregion
	}
}
