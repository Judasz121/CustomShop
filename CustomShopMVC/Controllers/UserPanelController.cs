using AutoMapper;
using CustomShopMVC.DataAccess.DatabaseModels;
using CustomShopMVC.Helpers;
using CustomShopMVC.Identity;
using CustomShopMVC.Models.ControllerDataModels.UserPanel;
using CustomShopMVC.Models.ViewModels;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace CustomShopMVC.Controllers
{
	[ApiController]
	[Route("API/{controller}")]
	public class UserPanelController : ControllerBase
	{
		private readonly IDatabaseAccess _dataAccess;
		private readonly IUpload _upload;
		public UserPanelController(IDatabaseAccess dataAccess, IUpload upload)
		{
			_dataAccess = dataAccess;
			_upload = upload;
		}

		#region settings
		[HttpGet]
		[Route("{action}")]
		public async Task<ActionResult<UserSettingsViewModel>> GetSettings()
		{
			UserSettingsViewModel result = new UserSettingsViewModel();
			IMapper mapper = AutoMapperConfigs.UserPanel().CreateMapper();

			using (IDbConnection conn = _dataAccess.GetDbConnection())
			{
				string userId = User.Claims.Where(c => c.Type == "Id").First().Value;

				DynamicParameters param = new DynamicParameters();
				string sql = "SELECT * FROM [UsersSettings] WHERE [UserId] = @Id";
				param.Add("@Id", userId);

				UserSettings queryResult = (await conn.QueryAsync<UserSettings>(sql, param)).First();
				result = mapper.Map<UserSettings, UserSettingsViewModel>(queryResult);
			}
			return result;
		}

		[HttpPost]
		[Route("{action}")]
		public async Task<ActionResult<SaveSettingsDataOut>> SaveSettings(UserSettingsViewModel model)
		{
			SaveSettingsDataOut result = new SaveSettingsDataOut();
			using (IDbConnection conn = _dataAccess.GetDbConnection())
			{
				string sql = "UPDATE [UsersSettings] SET [DarkMode] = @DarkMode  WHERE [Id] = @Id";
				DynamicParameters param = new DynamicParameters();
				param.Add("@Id", model.Id);
				param.Add("@DarkMode", model.DarkMode);

				int update = await conn.ExecuteAsync(sql, param);
				if (update == 1)
					result.Success = true;
				else
					result.Success = false;
			}

			return result;
		}

		#endregion settings

		#region products
		[HttpGet]
		[Route("{action}")]
		public async Task<ActionResult<GetProductsDataOut>> GetProducts()
		{
			GetProductsDataOut result = new GetProductsDataOut();
			IMapper mapper = AutoMapperConfigs.UserPanel().CreateMapper();
			IEnumerable<Product> dbProducts;

			string sql = "SELECT * FROM [Products] LEFT OUTER JOIN [ProductImages] ON [Products].[Id] = [ProductImages].[ProductId]";

			using (IDbConnection conn = _dataAccess.GetDbConnection())
			{	
				IEnumerable<Product> selectJoin = await conn.QueryAsync<Product, ProductImage, Product>(sql,
					(product, productImage) =>
					{
						if (productImage != null)
							product.Images.Add(productImage);
						return product;
					}
				);
				dbProducts = selectJoin.GroupBy(p => p.Id).Select(g =>
				{
					Product groupedProduct = g.First();

					IEnumerable<ProductImage> productImages = g.Select(g => g.Images.Single());
					foreach(Product productItem in g)
					{
						if (productItem.Images != null) 
							groupedProduct.Images.Add(productItem.Images.Single());
					}

					//groupedProduct.Images = productImages.ToList();
					
					return groupedProduct;
				}).ToList();

				result.Products = mapper.Map<IEnumerable<Product>, IEnumerable<ProductViewModel>>(dbProducts).ToList();
				result.Success = true;
			}
			return result;
		}
		[HttpPost]
		[Route("[action]")]
		public async Task<ActionResult<GetProductDataOut>> GetProduct(GetProductDataIn model)
		{
			GetProductDataOut result = new GetProductDataOut();
			IMapper mapper = AutoMapperConfigs.UserPanel().CreateMapper();
			if(model.ProductId.Length == 0)
			{
				result.Error = "You need to provide Product Id";
				result.Success = false;
				return result;
			}

			DynamicParameters param = new DynamicParameters();
			param.Add("@Id", model.ProductId);
			string sql = "SELECT * FROM [Products] WHERE [Id] = @Id";
			using (IDbConnection conn = _dataAccess.GetDbConnection())
			{
				Product dbProduct = conn.QueryFirst<Product>(sql, param);
				result.Product = mapper.Map<Product, ProductViewModel>(dbProduct);
			}
			result.Success = true;

			return result;
		}
		[HttpPost]
		[Route("{action}")]
		public async Task<ActionResult<SaveProductDataOut>> SaveProduct(SaveProductDataIn model)
		{
			SaveProductDataOut result = new SaveProductDataOut();
			IMapper mapper = AutoMapperConfigs.UserPanel().CreateMapper();

			string sql;
			DynamicParameters param = new DynamicParameters();

			if (model.Product.Id.Contains("new"))
			{
				Guid newProductId = Guid.NewGuid();
				


				param.Add("@Id", newProductId);
				param.Add("@AuthorId", model.Product.AuthorId);
				param.Add("@OwnerId", model.Product.OwnerId);
				param.Add("@Name", model.Product.Name);
				param.Add("@Description", model.Product.Description);

				param.Add("@Quantity", model.Product.Quantity);
				using (IDbConnection conn = _dataAccess.GetDbConnection())
				{
					sql = "SELECT COUNT(*) FROM [Products] WHERE [Id] != @Id AND [Name] != Name";
					int count = conn.ExecuteScalar<int>(sql, param);
					if (count > 0)
					{
						result.Success = false;
						result.NameError = "There already exists product with this name";
						return result;
					}

					string thumbnailImagePath = "";
					if (model.Product.NewThumbnailImage != null && model.Product.NewThumbnailImage.Length > 0)
						thumbnailImagePath = _upload.Image(model.Product.NewThumbnailImage);
					param.Add("@ThumbnailImagePath", thumbnailImagePath);

					sql = "INSERT INTO [Products] VALUES(@Id, @AuthorId, @OwnerId, @Name, @Description, @ThumbnailImagePath, @Quantity)";
					int insert = conn.Execute(sql, param);


					#region properties value 
					foreach(KeyValuePair<string, string> choosableProperty in model.Product.ChoosablePropertiesValue)
					{
						param = new DynamicParameters();
						param.Add("@Id", choosableProperty.Key);
						sql = "SELECT [CategoryId] FROM [CategoryProductChoosableProperties] WHERE [Id] = @Id";
						string categoryId = conn.ExecuteScalar<string>(sql, param);

						param = new DynamicParameters();
						param.Add("@Id", Guid.NewGuid());
						param.Add("@Value", choosableProperty.Value);
						param.Add("@ProductId", model.Product.Id);
						param.Add("@CategoryId", categoryId);
						sql = "INSERT INTO [ProductChoosablePropertyValues] @VALUES(@Id, @ProductId, @CategoryId, @ChoosablePropertyId, @Value)";

						conn.Execute(sql, param);
					}

					foreach (KeyValuePair<string, float> measurableProperty in model.Product.MeasurablePropertiesValue)
					{
						param = new DynamicParameters();
						param.Add("@Id", measurableProperty.Key);
						sql = "SELECT [CategoryId] FROM [CategoryProductMeasurableProperties] WHERE [Id] = @Id";
						string categoryId = conn.ExecuteScalar<string>(sql, param);

						param = new DynamicParameters();
						param.Add("@Id", Guid.NewGuid());
						param.Add("@Value", measurableProperty.Value);
						param.Add("@ProductId", model.Product.Id);
						param.Add("@CategoryId", categoryId);
						sql = "INSERT INTO [ProductMeasurablePropertyValues] @VALUES(@Id, @ProductId, @CategoryId, @ChoosablePropertyId, @Value)";

						conn.Execute(sql, param);
					}
					#endregion properties value

					#region images
					foreach(IFormFile newImage in model.Product.NewImages)
					{
						string path = _upload.Image(newImage);
						ProductImage newDbImage = new ProductImage()
						{
							Id = Guid.NewGuid(),
							ImagePath = path,
							ProductId = newProductId
						};

						param = new DynamicParameters();
						param.Add("@Id", newDbImage.Id);
						param.Add("@ImagePath", newDbImage.ImagePath);
						param.Add("@ProductId", newDbImage.ProductId);
						sql = "INSERT INTO [ProductImages] VALUES(@Id, @ImagePath, @ProductId)";
						conn.Execute(sql, param);
					}
					#endregion images
				}
			}
			else // update
			{
				param.Add("@Id", model.Product.Id);
				param.Add("@AuthorId", model.Product.AuthorId);
				param.Add("@OwnerId", model.Product.OwnerId);
				param.Add("@Name", model.Product.Name);
				param.Add("@Description", model.Product.Description);

				param.Add("@Quantity", model.Product.Quantity);
				using (IDbConnection conn = _dataAccess.GetDbConnection())
				{
					sql = "SELECT COUNT(*) FROM [Products] WHERE [Id] != @Id AND [Name] != Name";
					int count = conn.ExecuteScalar<int>(sql, param);
					if (count > 0)
					{
						result.Success = false;
						result.NameError = "There already exists product with this name";
						return result;
					}

					string thumbnailImagePath = "";
					if (model.Product.NewThumbnailImage != null && model.Product.NewThumbnailImage.Length > 0)
						thumbnailImagePath = _upload.Image(model.Product.NewThumbnailImage);
					param.Add("@ThumbnailImagePath", thumbnailImagePath);

					sql = "UPDATE [Products] SET [AuthorId] = @AuthorId, [OwnerId] = @OwnerId, [Name] = @Name, [Description] = @Description, [ThumbnailImagePath] = @ThumbnailImagePath, [Quantity] = @Quantity";
					int update = conn.Execute(sql, param);
					if(update == 0)
					{
						result.Success = false;
						result.FormError = "Could not update the product serverside.";
						return result;
					}

					#region product properties value
					foreach (KeyValuePair<string, string> choosableProperty in model.Product.ChoosablePropertiesValue)
					{
						param = new DynamicParameters();
						param.Add("@ChoosablePropertyId", choosableProperty.Key);
						param.Add("@Value", choosableProperty.Value);
						param.Add("@ProductId", model.Product.Id);
						sql = "UPDATE [ProductChoosablePropertyValues] SET [Value] = @Value WHERE [ChoosablePropertyId] = @ChoosablePropertyId AND [ProductId] = @ProductId";
						update = conn.Execute(sql, param);
						if (update == 0)
						{
							param = new DynamicParameters();
							param.Add("@Id", choosableProperty.Key);
							sql = "SELECT [PropertyName] FROM [CategoryProductChoosableProperties] WHERE [Id] = @Id";
							string propertyName = conn.ExecuteScalar<string>(sql, param);
							result.FormError += $"Could not update the product {propertyName} property value." + Environment.NewLine;
							result.Success = false;
						}
					}

					foreach(KeyValuePair<string, float> measurableProperty in model.Product.MeasurablePropertiesValue)
					{
						param = new DynamicParameters();
						param.Add("@MeasurablePropertyId", measurableProperty.Key);
						param.Add("@Value", measurableProperty.Value);
						param.Add("@ProductId", model.Product.Id);
						sql = "UPDATE [ProductMeasurablePropertyValues] SET [Value] = @Value WHERE [MeasurablePropertyId] = @MeasurablePropertyId AND [ProductId] = @ProductId";
						update = conn.Execute(sql, param);
						if (update == 0)
						{
							param = new DynamicParameters();
							param.Add("@Id", measurableProperty.Key);
							sql = "SELECT [PropertyName] FROM [CategoryProductMeasurableProperties] WHERE [Id] = @Id";
							string propertyName = conn.ExecuteScalar<string>(sql, param);
							result.FormError += $"Could not update the product {propertyName} property value." + Environment.NewLine;
							result.Success = false;
						}
					}
					#endregion product properties value

					#region imagesls
					if(model.Product.NewImages != null)
						foreach (IFormFile newImage in model.Product.NewImages)
						{
							string path = _upload.Image(newImage);
							ProductImage newDbImage = new ProductImage()
							{
								Id = Guid.NewGuid(),
								ImagePath = path,
								ProductId = Guid.Parse(model.Product.Id)
							};

							param = new DynamicParameters();
							param.Add("@Id", newDbImage.Id);
							param.Add("@ImagePath", newDbImage.ImagePath);
							param.Add("@ProductId", newDbImage.ProductId);
							sql = "INSERT INTO [ProductImages] VALUES(@Id, @ImagePath, @ProductId)";
							conn.Execute(sql, param);
						}
					#endregion images
				}
			}
				return result;
		}

		[HttpGet]
		[Route("{action}")]
		public async Task<GetUsersDataOut> GetUsers()
		{
			GetUsersDataOut result = new GetUsersDataOut();
			IMapper mapper = AutoMapperConfigs.UserPanel().CreateMapper();

			string sql = "SELECT * FROM [Users]";
			using (IDbConnection conn = _dataAccess.GetDbConnection())
			{
				IEnumerable<ApplicationUser> dbUsers = conn.Query<ApplicationUser>(sql);
				result.Users = mapper.Map<IEnumerable<ApplicationUser>, IEnumerable<UserViewModel>>(dbUsers).ToList();
				result.Success = true;
			}
			
			return result;
		}

		[HttpPost]
		[Route("[action]")]
		public async Task<ActionResult<GetProductCategoriesDataDataOut>> GetProductCategoriesData(GetProductCategoriesDataDataIn model)
		{ 
			GetProductCategoriesDataDataOut result = new GetProductCategoriesDataDataOut();
			IMapper mapper = AutoMapperConfigs.UserPanel().CreateMapper();

			using (IDbConnection conn = _dataAccess.GetDbConnection())
			{
				string sql = "SELECT * FROM [Categories]";
				IEnumerable<Category> sqlResult = conn.Query<Category>(sql);
				result.CategoryTree = mapper.Map<IEnumerable<Category>, IEnumerable<CategoryViewModel>>(sqlResult).ToList();

				DynamicParameters param = new DynamicParameters();
				param.Add("@ProductId", model.ProductId);
				if (model.ProductId == "new")
					sql = "SELECT [CategoryId] FROM [Categories_Products]";
				else
					sql = "SELECT [CategoryId] FROM [Categories_Products] WHERE [ProductId] = @ProductId";
				result.ProductCategoriesId = conn.Query<string>(sql, param).ToList();
				result.Success = true;
			}
			return result;
		}
		[HttpPost]
		[Route("[action]")]
		public async Task<ActionResult<SaveProductCategoriesDataOut>> SaveProductCategories(SaveProductCategoriesDataIn model)
		{
			SaveProductCategoriesDataOut result = new SaveProductCategoriesDataOut();

			DynamicParameters param = new DynamicParameters();
			param.Add("@ProductId", model.ProductId);

			string sql = "SELECT * FROM [Categories_Products] WHERE [ProductId] = @ProductId";
			using (IDbConnection conn = _dataAccess.GetDbConnection())
			{
				List<Category_Product> dbCategories_Products = conn.Query<Category_Product>(sql, param).ToList();
				
				foreach(string categoryIdItem in model.SelectedCategories)
				{
					if(!dbCategories_Products.Any(c_p => c_p.CategoryId.ToString() == categoryIdItem))
					{
						param = new DynamicParameters();
						param.Add("CategoryId", categoryIdItem);
						param.Add("@ProductId", model.ProductId);
						sql = "INSERT INTO [Categories_Products] VALUES(@ProductId, @CategoryId)";
						conn.Execute(sql, param);
					}
				}
			}


			result.Success = true;
			return result;
		}
		#endregion products
	}
}
