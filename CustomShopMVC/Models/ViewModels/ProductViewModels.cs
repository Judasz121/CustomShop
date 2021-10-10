using CustomShopMVC.Helpers;
using CustomShopMVC.Helpers.JsonConverters;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace CustomShopMVC.Models.ViewModels
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
		[JsonConverter(typeof (IntConverter))]
		public int Quantity { get; set; }

		// key is the property.id ( not the propertyValue.id )
		public dynamic ChoosablePropertiesValue { get; set; }
		public dynamic MeasurablePropertiesValue { get; set; }

		//[BindProperty(BinderType = typeof(CustomModelBinder))]
		//public Dictionary<string, string> ChoosablePropertiesValue { get; set; }
		//[BindProperty(BinderType = typeof(CustomModelBinder))]
		//public Dictionary<string, float> MeasurablePropertiesValue { get; set; }
	}


	public class ProductEditModel : ProductViewModel
	{
		public IFormFile NewThumbnailImage { get; set; }
		public List<IFormFile> NewImages { get; set; }
		public List<string> ImagesToDelete { get; set; }
	}
}
