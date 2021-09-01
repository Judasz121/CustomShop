using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CustomShopMVC.Models.ViewModels
{
	public class CategoryViewModel
	{
		public string Id { get; set; }
		public string ParentId { get; set; }
		public string Name { get; set; }

	}
}
