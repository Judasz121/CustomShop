using AutoMapper;
using CustomShopMVC.DataAccess.DatabaseModels;
using CustomShopMVC.Helpers;
using CustomShopMVC.Models;
using CustomShopMVC.Models.ControllerDataModels;
using CustomShopMVC.Models.ViewModels;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace CustomShopMVC.Controllers
{
	[ApiController]
	[Route("API/{controller}")]
	public class HomeController : Controller
	{
		private readonly ILogger<HomeController> _logger;
		private readonly IDatabaseAccess _databaseAccess;

		public HomeController(ILogger<HomeController> logger, IDatabaseAccess databaseAccess)
		{
			_logger = logger;
			_databaseAccess = databaseAccess;
		}
		[HttpPost]
		[Route("[action]")]
        public async Task<ActionResult<GetCategoriesCustomPropertiesDataOut>> GetCategoriesCustomProperties(GetCategoriesCustomPropertiesDataIn model)
        {
			var result = new GetCategoriesCustomPropertiesDataOut();
            var dbMeasurables = new HashSet<CategoryProductMeasurableProperty>();
            var dbChoosables = new HashSet<CategoryProductChoosableProperty>();
            IMapper mapper = AutoMapperConfigs.Home().CreateMapper();
            if(model.CategoriesId == null || model.CategoriesId.Count() == 0)
            {
                result.FormErrors.Add("You need to provide at least one category id.");
                result.Success = false;
                return result;
            }
            foreach(string categoryIdItem in model.CategoriesId)
            {
                using (IDbConnection conn = _databaseAccess.GetDbConnection())
                {
                    var param = new DynamicParameters();
                    param.Add("@CategoryId", categoryIdItem);
                    string sql = "SELECT * FROM [CategoryProductChoosableProperties] WHERE [CategoryId] = @CategoryId";
                    dbChoosables = conn.Query<CategoryProductChoosableProperty>(sql, param).ToHashSet();
                    sql = "SELECT * FROM [CategoryProductMeasurableProperties] WHERE [CategoryId] = @CategoryId";
                    dbMeasurables = conn.Query<CategoryProductMeasurableProperty>(sql, param).ToHashSet();

                    sql = "EXEC GetCategoryParentsId @CategoryId";
                    IEnumerable<Guid> parentsId = conn.Query<Guid>(sql, param);
                    foreach(Guid parentIdItem in parentsId)
                    {
                        param = new DynamicParameters();
                        param.Add("@CategoryId", parentIdItem);
                        sql = "SELECT * FROM [CategoryProductChoosableProperties] WHERE [CategoryId] = @CategoryId";
                        dbChoosables = dbChoosables.Concat(conn.Query<CategoryProductChoosableProperty>(sql, param)).ToHashSet();

                        sql = "SELECT * FROM [CategoryProductMeasurableProperties] WHERE [CategoryId] = @CategoryId";
                        dbMeasurables = dbMeasurables.Concat(conn.Query<CategoryProductMeasurableProperty>(sql, param)).ToHashSet();
                    }
                }
            }
            result.choosableProperties = mapper.Map<IEnumerable<CategoryProductChoosableProperty>, IEnumerable<CategoryProductChoosablePropertyViewModel>>(dbChoosables).ToList();
            result.measurableProperties = mapper.Map<IEnumerable<CategoryProductMeasurableProperty>, IEnumerable<CategoryProductMeasurablePropertyViewModel>>(dbMeasurables).ToList();
            result.Success = true;
			return result;
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<ActionResult<GetCategoryChildrenDataOut>> GetCategoryChildren(GetCategoryChildrenDataIn model)
        {
            var result = new GetCategoryChildrenDataOut();
            var mapper = AutoMapperConfigs.Home().CreateMapper();
            if (String.IsNullOrEmpty(model.CategoryId))
            {
                result.FormErrors.Add("You need to provide category id.");
            }
            using (IDbConnection conn = _databaseAccess.GetDbConnection())
            {
                var param = new DynamicParameters();
                param.Add("@ParentId", model.CategoryId);
                string sql = "SELECT * FROM [Categories] WHERE [ParentId] = @ParentId";
                IEnumerable<Category> dbCategories = conn.Query<Category>(sql, param);
                result.Children = mapper.Map<IEnumerable<Category>, IEnumerable<CategoryViewModel>>(dbCategories).ToList();
            }

            result.Success = true;
            return result;
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<ActionResult<GetAllCategoriesDataOut>> GetAllCategories()
        {
            var result = new GetAllCategoriesDataOut();
            IMapper mapper = AutoMapperConfigs.Home().CreateMapper();

            using (IDbConnection conn = _databaseAccess.GetDbConnection())
            {
                string sql = "SELECT * FROM [Categories]";
                result.Categories = mapper.Map<IEnumerable<Category>, IEnumerable<CategoryViewModel>>(conn.Query<Category>(sql)).ToList();
            }
            result.Success = true;
            return result;
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<ActionResult<GetAllProductsDataOut>> GetAllProducts()
        {
            var result = new GetAllProductsDataOut();
            IMapper mapper = AutoMapperConfigs.Home().CreateMapper();
            using (IDbConnection conn = _databaseAccess.GetDbConnection())
            {
                string sql = "SELECT * FROM [Products]";
                IEnumerable<Product> dbProducts = conn.Query<Product>(sql);
                result.Products = mapper.Map<IEnumerable<Product>, IEnumerable<ProductViewModel>>(dbProducts).ToList();
            }

            result.Success = true;
            return result;
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<ActionResult<GetMaxProductPriceInCategoriesDataOut>> GetMaxProductPriceInCategories(GetMaxProductPriceInCategoriesDataIn model)
        {
            var result = new GetMaxProductPriceInCategoriesDataOut();
            using (IDbConnection conn = _databaseAccess.GetDbConnection())
            {
                var param = new DynamicParameters();            
                string sql = "EXEC [GetMaxProductsPriceInCategory] @CategoryId";

                foreach(string categoryIdItem in model.CategoriesId)
                {
                    param.Add("@CategoryId", categoryIdItem);
                    int price = conn.ExecuteScalar<int>(sql, param);
                    if (result.MaxPrice < price)
                        result.MaxPrice = price;                 
                }
            }
            result.Success = true;
            return result;
        }


        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
		public IActionResult Error()
		{
			//return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
			throw new NotImplementedException();
		}
	}
}
