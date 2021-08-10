using System;
using System.Collections.Generic;
using System.Text;

namespace CustomShopMVC.DataAccess.DatabaseModels
{
	public class ProductMeasurableProperty : IProductProperty
	{
		public Guid Id { get; set; }
		public Guid CategoryId { get; set; }
		public string PropertyName { get; set; }
		public string PropertyNameAbbreviation { get; set; }
		public string UnitFullName { get; set; }
		public string UnitName { get; set; }
		public bool IsMetric { get; set; }
		public float ToMetricModifier { get; set; }
	}
}
