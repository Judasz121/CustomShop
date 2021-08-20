using System;
using System.Collections.Generic;
using System.Text;

namespace CustomShopMVC.DataAccess.DatabaseModels
{
	public class CategoryProductChoosableProperty : ICategoryProductProperty
	{
		public Guid Id { get; set; }
		public Guid CategoryId { get; set; }
		public string PropertyName { get; set; }
		public string PropertyNameAbbreviation { get; set; }
		public string ItemsToChoose { get; set; }
	}
}
