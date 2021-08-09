using System;
using System.Collections.Generic;
using System.Text;

namespace CustomShopMVC.DataAccess.DatabaseModels
{
	public class ProductChoosableProperty : IProductProperty
	{
		public Guid Id { get; set; }
		public Guid CategoryId { get; set; }
		public string PropertyName { get; set; }
		public string PropertyNameAbbreviation { get; set; }
		public List<string> ItemsToChoose { get; set; }
	}
}
