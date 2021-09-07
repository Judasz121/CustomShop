using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CustomShopMVC.Models.ViewModels
{
	public class CategoryProductChoosablePropertyViewModel
	{
		public string Id { get; set; }
		public string CategoryId { get; set; }
		public string PropertyName { get; set; }
		public string PropertyNameAbbreviation { get; set; }
		public List<string> ItemsToChoose { get; set; }
	}

	public class ParentCategoryProductChoosablePropertyViewModel : CategoryProductChoosablePropertyViewModel
	{
		public string CategoryName { get; set; }
	}
}
