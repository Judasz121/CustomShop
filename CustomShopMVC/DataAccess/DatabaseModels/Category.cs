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
		public Category ParentCategory { get; set; }

		#region relations
		public ICollection<Product> Products { get; set; }
		public ICollection<CategoryProductChoosableProperty> ChoosableProperties { get; set; }
		public ICollection<CategoryProductMeasurableProperty> MeasurableProperties { get; set; }
		#endregion
	}
}
