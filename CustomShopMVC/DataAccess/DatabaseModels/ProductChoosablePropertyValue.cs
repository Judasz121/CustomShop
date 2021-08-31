using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CustomShopMVC.DataAccess.DatabaseModels
{
	public class ProductChoosablePropertyValue
	{
		public Guid Id { get; set; }
		public Guid ChoosablePropertyId { get; set; }
		public Guid ProductId { get; set; }
		public Guid CategoryId { get; set; }
		public string Value { get; set; }
	}
}
