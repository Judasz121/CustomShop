using System;
using System.Collections.Generic;
using System.Text;

namespace CustomShopMVC.DataAccess.DatabaseModels
{
	public class ProductImage
	{
		public Guid Id { get; set; }
		public string ImagePath { get; set; }
		public Guid ProductId { get; set; }

		public Product Product { get; set; }
	}
}

