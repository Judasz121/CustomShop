using CustomShopMVC.Models.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CustomShopMVC.Models.ControllerDataModels
{
    public class GetCategoriesCustomPropertiesDataOut
    {
        public List<CategoryProductChoosablePropertyViewModel> choosableProperties {get;set;}
        public List<CategoryProductMeasurablePropertyViewModel> measurableProperties { get; set; }
        public bool Success { get; set; }
        public List<string> FormErrors { get; set; }
    }
    public class GetCategoriesCustomPropertiesDataIn
    {
        public List<string> CategoriesId { get; set; }
    }

    public class GetCategoryChildrenDataIn
    {
        public string CategoryId { get; set; }
    }
    public class GetCategoryChildrenDataOut
    {
        public bool Success { get; set; }
        public List<CategoryViewModel> Children { get; set; }
        public List<string> FormErrors { get; set; }
    }

    public class GetAllCategoriesDataOut
    {
        public bool Success { get; set; }
        public List<CategoryViewModel> Categories { get; set; }
    }
    public class GetAllProductsDataOut 
    {
        public bool Success { get; set; }
        public List<ErrorViewModel> FormErrors { get; set; }
        public List<ProductViewModel> Products { get; set; }
    }
    public class GetMaxProductPriceInCategoriesDataIn
    {
        public List<string> CategoriesId { get; set; }
    }
    public class GetMaxProductPriceInCategoriesDataOut
    {
        public bool Success { get; set; }
        public int MaxPrice { get; set; }
    }
}
