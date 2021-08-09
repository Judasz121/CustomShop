using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CustomShopMVC.DataAccess.DatabaseModels
{
	public class ProductPropertyValue
	{
		public Guid Id { get; set; }
		public Guid PropertyId { get; set; }
		public Guid ProductId { get; set; }
		public Guid CategoryId { get; set; }
		public string Value { get; set; }
	}
}
