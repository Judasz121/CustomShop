using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CustomShopMVC.Models
{
	public class ProductViewModel
	{
		public string Id { get; set; }
		public string AuthorId { get; set; }
		public string OwnerId { get; set; }
		public string Name { get; set; }
		public string Description { get; set; }
		public string ThumbnailImagePath { get; set; }
		public List<string> ImagesPath { get; set; }
		public int Quantity { get; set; }

		// key is the property id ( not the propertyValue id )
		public Dictionary<string, string> ChoosablePropertiesValue { get; set; }
		public Dictionary<string, float> MeasurablePropertiesValue { get; set; }
	}

	public class ProductEditModel : ProductViewModel
	{
		public IFormFile NewThumbnailImage { get; set; }
		public List<IFormFile> NewImages { get; set; }
	}
}
