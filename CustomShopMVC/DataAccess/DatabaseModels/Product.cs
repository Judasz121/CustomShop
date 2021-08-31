using System;
using System.Collections.Generic;
using System.Text;

namespace CustomShopMVC.DataAccess.DatabaseModels
{
	public class Product
	{
		public Guid Id { get; set; }
		public Guid AuthorId { get; set; }
		public Guid OwnerId { get; set; }
		public string Name { get; set; }
		public string Description { get; set; }
		public string ThumbnailImagePath { get; set; }
		public int Quantity { get; set; }

		#region relations
		public ICollection<ProductImage> Images { get; set; }
		public ICollection<ProductChoosablePropertyValue> ChoosablePropertiesValue { get; set; }
		public ICollection<ProductMeasurablePropertyValue> MeasurablePropertiesValue { get; set; }
		public ICollection<Category> Categories { get; set; }
		#endregion
	}
}

