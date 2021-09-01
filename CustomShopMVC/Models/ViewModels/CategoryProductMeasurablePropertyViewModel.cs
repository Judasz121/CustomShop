using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CustomShopMVC.Models.ViewModels
{
	public class CategoryProductMeasurablePropertyViewModel
	{
		public string Id { get; set; }
		public string CategoryId { get; set; }
		public string PropertyName { get; set; }
		public string PropertyNameAbbreviation { get; set; }
		public string UnitFullName { get; set; }
		public string UnitName { get; set; }
		public bool IsMetric { get; set; }
		public float ToMetricModifier { get; set; }
	}
}
