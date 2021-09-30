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
using System.Text.Json;
using Newtonsoft.Json;
using System.Linq.Expressions;
using Microsoft.AspNetCore.Hosting;
using System.IO;

namespace CustomShopMVC.Controllers
{
	[ApiController]
	[Route("API/{controller}")]
	public class UserPanelController : ControllerBase
	{
		private readonly IDatabaseAccess _dataAccess;
		private readonly IUpload _upload;
		private readonly IWebHostEnvironment _webHostEnvironment;

		public UserPanelController(IDatabaseAccess dataAccess, IUpload upload, IWebHostEnvironment webHostEnvironmet)
		{
			_dataAccess = dataAccess;
			_upload = upload;
			_webHostEnvironment = webHostEnvironmet;
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
					foreach (Product productItem in g)
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
			if (model.ProductId.Length == 0)
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
				result.Product.ChoosablePropertiesValue = new Dictionary<string, string>();
				result.Product.MeasurablePropertiesValue = new Dictionary<string, float>();

				#region custom properties value

				param = new DynamicParameters();
				param.Add("@ProductId", model.ProductId);

				sql = "SELECT [ChoosablePropertyId], [Value] FROM [ProductChoosablePropertiesValue] WHERE [ProductId] = @ProductId";
				var dbChoosablesValue = conn.Query<ProductChoosablePropertyValue>(sql, param);
				foreach (ProductChoosablePropertyValue dbChoosableItem in dbChoosablesValue)
				{
					//if (!((Dictionary<string, string>)result.Product.ChoosablePropertiesValue).Any(cp => cp.Key == dbChoosableItem.ChoosablePropertyId.ToString()))
						result.Product.ChoosablePropertiesValue.Add(dbChoosableItem.ChoosablePropertyId.ToString(), dbChoosableItem.Value);
				}

				sql = "SELECT [MeasurablePropertyId], [Value] FROM [ProductMeasurablePropertiesValue] WHERE [ProductId] = @ProductId";
				var dbMeasurablesValue = conn.Query<ProductMeasurablePropertyValue>(sql, param);
				foreach (ProductMeasurablePropertyValue dbMeasurableItem in dbMeasurablesValue)
				{
					//if(!((Dictionary<string, float>)result.Product.MeasurablePropertiesValue).Any(mp => mp.Key == dbMeasurableItem.MeasurablePropertyId.ToString()))
						result.Product.MeasurablePropertiesValue.Add(dbMeasurableItem.MeasurablePropertyId.ToString(), dbMeasurableItem.Value);
				}
				#endregion
			}
			result.Success = true;

			return result;
		}

		[HttpPost]
		[Route("[action]")]
		public async Task<ActionResult<DeleteProductDataOut>> DeleteProduct(DeleteProductDataIn model)
		{
			DeleteProductDataOut result = new DeleteProductDataOut();
			if (String.IsNullOrEmpty(model.ProductId))
			{
				result.Success = false;
				result.Error = "You must provide product id";
				return result;
			}

			DynamicParameters param = new DynamicParameters();
			param.Add("@Id", model.ProductId);
			param.Add("@ProductId", model.ProductId);
			using (IDbConnection conn = _dataAccess.GetDbConnection())
			{
				string sql = "DELETE FROM [ProductChoosablePropertiesValue] WHERE [ProductId] = @ProductId";
				await conn.ExecuteAsync(sql, param);

				sql = "DELETE FROM [ProductMeasurablePropertiesValue] WHERE [ProductId] = @ProductId";
				await conn.ExecuteAsync(sql, param);

				sql = "DELETE FROM [Categories_Products] WHERE [ProductId] = @ProductId";
				await conn.ExecuteAsync(sql, param);

				sql = "DELTE FROM [Products] WHERE [Id] = @Id";
				await conn.ExecuteAsync(sql, param);

			}
			result.Success = true;
			return result;
		}

		[HttpPost]
		[Route("{action}")]
		public async Task<ActionResult<SaveProductDataOut>> SaveProduct(SaveProductDataIn model)
		{
			model.Product.ChoosablePropertiesValue = JsonConvert.DeserializeObject<Dictionary<string, string>>(model.Product.ChoosablePropertiesValue.ToString());
			model.Product.MeasurablePropertiesValue = JsonConvert.DeserializeObject<Dictionary<string, float>>(model.Product.MeasurablePropertiesValue.ToString());
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
					#region product name check
					sql = "SELECT COUNT(*) FROM [Products] WHERE [Id] != @Id AND [Name] != Name";
					int count = conn.ExecuteScalar<int>(sql, param);
					if (count > 0)
					{
						result.Success = false;
						result.NameError = "There already exists product with this name";
						return result;
					}
					#endregion

					sql = "INSERT INTO [Products] VALUES(@Id, @AuthorId, @OwnerId, @Name, @Description, @Quantity)";
					conn.Execute(sql, param);

					#region custom properties value 
					foreach (KeyValuePair<string, string> choosableProperty in model.Product.ChoosablePropertiesValue)
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
						sql = "INSERT INTO [ProductChoosablePropertiesValue] @VALUES(@Id, @ProductId, @CategoryId, @ChoosablePropertyId, @Value)";

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
						sql = "INSERT INTO [ProductMeasurablePropertiesValue] @VALUES(@Id, @ProductId, @CategoryId, @ChoosablePropertyId, @Value)";

						conn.Execute(sql, param);
					}
					#endregion custom properties value
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


					sql = "UPDATE [Products] SET [AuthorId] = @AuthorId, [OwnerId] = @OwnerId, [Name] = @Name, [Description] = @Description, [Quantity] = @Quantity";
					int update = conn.Execute(sql, param);
					if (update == 0)
					{
						result.Success = false;
						result.FormError = "Could not update the product serverside.";
						return result;
					}

					#region product properties value
					foreach (KeyValuePair<string, string> choosablePropertyItem in model.Product.ChoosablePropertiesValue)
					{
						param = new DynamicParameters();
						param.Add("@ChoosablePropertyId", choosablePropertyItem.Key);
						param.Add("@Value", choosablePropertyItem.Value);
						param.Add("@ProductId", model.Product.Id);
						sql = "UPDATE [ProductChoosablePropertiesValue] SET [Value] = @Value WHERE [ChoosablePropertyId] = @ChoosablePropertyId AND [ProductId] = @ProductId";
						update = conn.Execute(sql, param);
						if (update == 0)
						{
							param = new DynamicParameters();
							param.Add("@Id", choosablePropertyItem.Key);
							sql = "SELECT [CategoryId] FROM [CategoryProductChoosableProperties] WHERE [Id] = @Id";
							Guid categoryId = conn.ExecuteScalar<Guid>(sql, param);

							param = new DynamicParameters();
							param.Add("@Id", Guid.NewGuid());
							param.Add("@ProductId", model.Product.Id);
							param.Add("@CategoryId", categoryId);
							param.Add("@ChoosablePropertyId", choosablePropertyItem.Key);
							param.Add("@Value", choosablePropertyItem.Value);
							sql = "INSERT INTO [ProductChoosablePropertiesValue] VALUES(@Id, @ProductId, @CategoryId, @ChoosablePropertyId, @Value)";
							conn.Execute(sql, param);
						}
					}

					foreach (KeyValuePair<string, float> measurablePropertyItem in model.Product.MeasurablePropertiesValue)
					{
						param = new DynamicParameters();
						param.Add("@MeasurablePropertyId", measurablePropertyItem.Key);
						param.Add("@Value", measurablePropertyItem.Value);
						param.Add("@ProductId", model.Product.Id);
						sql = "UPDATE [ProductMeasurablePropertiesValue] SET [Value] = @Value WHERE [MeasurablePropertyId] = @MeasurablePropertyId AND [ProductId] = @ProductId";
						update = conn.Execute(sql, param);
						if (update == 0)
						{
							param = new DynamicParameters();
							param.Add("@Id", measurablePropertyItem.Key);
							sql = "SELECT [CategoryId] FROM [CategoryProducMeasurableProperties] WHERE [Id] = @Id";
							Guid categoryId = conn.ExecuteScalar<Guid>(sql, param);

							param = new DynamicParameters();
							param.Add("@Id", Guid.NewGuid());
							param.Add("@ProductId", model.Product.Id);
							param.Add("@CategoryId", categoryId);
							param.Add("@MeasurablePropertyId", measurablePropertyItem.Key);
							param.Add("Value", measurablePropertyItem.Value);
							sql = "INSERT INTO [ProductMeasurablePropertiesValue] VALUES(@Id, @ProductId, @CategoryId, @MeasurablePropertyId, @Value)";
							conn.Execute(sql, param);
						}
					}
					#endregion product properties value
				}
			}
			result.Success = true;
			return result;
		}
		[HttpPost]
		[Route("[action]")]
		public async Task<ActionResult<SaveProductImagesDataOut>> SaveProductImages([FromForm] SaveProductImagesDataIn model)
		{
			SaveProductImagesDataOut result = new SaveProductImagesDataOut();
			using (IDbConnection conn = _dataAccess.GetDbConnection())
			{
				DynamicParameters param;
				string sql;
				string thumbnailImagePath = "";

				if (model.NewThumbnailImage != null && model.NewThumbnailImage.Length > 0)
				{
					param = new DynamicParameters();
					param.Add("@Id", model.ProductId);
					sql = "SELECT [ThumbnailImagePath] FROM [Products] WHERE [Id] = @Id";
					string oldThumbnailPath = conn.ExecuteScalar<string>(sql, param);
					oldThumbnailPath = _webHostEnvironment.WebRootPath + oldThumbnailPath;
					System.IO.File.Delete(oldThumbnailPath);

					thumbnailImagePath = _upload.Image(model.NewThumbnailImage);
				}
				param = new DynamicParameters();
				param.Add("@ThumbnailImagePath", thumbnailImagePath);
				sql = "UPDATE [Products] SET [ThumbnailImagePath] = @ThumbnailImagePath";
				conn.Execute(sql, param);

				if (model.ImagesToDelete != null)
				{
					foreach (string imagePath in model.ImagesToDelete)
					{
						string absolutePath = _webHostEnvironment.WebRootPath + imagePath;
						System.IO.File.Delete(absolutePath);

						param = new DynamicParameters();
						param.Add("@ImagePath", imagePath);
						param.Add("@ProductId", model.ProductId);
						sql = "DELETE FROM [ProductImages] WHERE [ImagePath] = @ImagePath AND [ProductId] = @ProductId";
						conn.Execute(sql, param);
					}
				}

				if (model.NewImages != null)
					foreach (IFormFile newImageItem in model.NewImages)
					{
						string path = _upload.Image(newImageItem);
						ProductImage newImage = new ProductImage()
						{
							Id = Guid.NewGuid(),
							ImagePath = path,
							ProductId = Guid.Parse(model.ProductId)
						};

						param = new DynamicParameters();
						param.Add("@Id", newImage.Id);
						param.Add("@ImagePath", newImage.ImagePath);
						param.Add("@ProductId", newImage.ProductId);
						sql = "INSERT INTO [ProductImages] VALUES(@Id, @ImagePath, @ProductId)";
						conn.Execute(sql, param);
					};



			}
			result.Success = true;
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
		public async Task<ActionResult<GetProductCategoriesDataOut>> GetProductCategories(GetProductCategoriesDataIn model)
		{
			GetProductCategoriesDataOut result = new GetProductCategoriesDataOut();
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

				result.ProductCategoriesId = conn.Query<Guid>(sql, param).Select(id => id.ToString()).ToList();
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

				foreach (string categoryIdItem in model.SelectedCategories)
				{ // check if there are new categories
					if (!dbCategories_Products.Any(c_p => c_p.CategoryId.ToString() == categoryIdItem))
					{
						List<CategoryProductChoosableProperty> dbChoosables = new List<CategoryProductChoosableProperty>();
						List<CategoryProductMeasurableProperty> dbMeasurables = new List<CategoryProductMeasurableProperty>();
						param = new DynamicParameters();
						param.Add("@CategoryId", categoryIdItem);
						param.Add("@ProductId", model.ProductId);

						sql = "INSERT INTO [Categories_Products] VALUES(@ProductId, @CategoryId)";
						conn.Execute(sql, param);

						#region gets parent categories properties
						param = new DynamicParameters();
						param.Add("@Id", categoryIdItem);
						sql = "SELECT [ParentId] FROM [Categories] WHERE [Id] = @Id";
						Guid parentId = conn.ExecuteScalar<Guid>(sql, param);
						if (parentId != Guid.Empty)
							do
							{
								param = new DynamicParameters();
								param.Add("@CategoryId", parentId);

								sql = "SELECT * FROM [CategoryProductChoosableProperties] WHERE [CategoryId] = @CategoryId";
								IEnumerable<CategoryProductChoosableProperty> choosableSelect = conn.Query<CategoryProductChoosableProperty>(sql, param);
								foreach (CategoryProductChoosableProperty choosablePropItem in choosableSelect)
								{
									if (!dbChoosables.Any(cp => cp.Id == choosablePropItem.Id))
										dbChoosables.Add(choosablePropItem);
								}

								sql = "SELECT * FROM [CategoryProductMeasurableProperties] WHERE [CategoryId] = @CategoryId";
								IEnumerable<CategoryProductMeasurableProperty> measurableSelect = conn.Query<CategoryProductMeasurableProperty>(sql, param);
								foreach (CategoryProductMeasurableProperty measurablePropItem in measurableSelect)
								{
									if (!dbMeasurables.Any(mp => mp.Id == measurablePropItem.Id))
										dbMeasurables.Add(measurablePropItem);
								}

								sql = "SELECT [ParentId] FROM [Categories] WHERE [Id] = @CategoryId";
								parentId = conn.ExecuteScalar<Guid>(sql, param);
							}
							while (parentId != Guid.Empty);
						#endregion

						param = new DynamicParameters();
						param.Add("@CategoryId", categoryIdItem);
						sql = "SELECT * FROM [CategoryProductChoosableProperties] WHERE [CategoryId] = @CategoryId";
						dbChoosables = dbChoosables.Concat(conn.Query<CategoryProductChoosableProperty>(sql, param)).ToList();

						#region sets choosables value
						foreach (CategoryProductChoosableProperty choosablePropItem in dbChoosables)
						{
							param = new DynamicParameters();
							param.Add("@Id", Guid.NewGuid());
							param.Add("@ProductId", model.ProductId);
							param.Add("@CategoryId", choosablePropItem.CategoryId);
							param.Add("@ChoosablePropertyId", choosablePropItem.Id);
							param.Add("@Value", null);
							sql = "INSERT INTO [ProductChoosablePropertiesValue] ([Id], [ProductId], [CategoryId], [ChoosablePropertyId], [Value]) VALUES(@Id, @ProductId, @CategoryId, @ChoosablePropertyId, @Value)";

							conn.Execute(sql, param);
						}
						#endregion

						#region sets measurables value
						param = new DynamicParameters();
						param.Add("@CategoryId", categoryIdItem);
						sql = "SELECT * FROM [CategoryProductMeasurableProperties] WHERE [CategoryId] = @CategoryId";
						dbMeasurables = dbMeasurables.Concat(conn.Query<CategoryProductMeasurableProperty>(sql, param)).ToList();
						foreach (CategoryProductMeasurableProperty measurablePropItem in dbMeasurables)
						{
							param = new DynamicParameters();
							param.Add("@Id", Guid.NewGuid());
							param.Add("@ProductId", model.ProductId);
							param.Add("@CategoryId", measurablePropItem.CategoryId);
							param.Add("@MeasurablePropertyId", measurablePropItem.Id);
							param.Add("@Value", null);
							sql = "INSERT INTO [ProductMeasurablePropertiesValue] ([Id], [ProductId], [CategoryId], [MeasurablePropertyId], [Value]) VALUES(@Id, @ProductId, @CategoryId, @MeasurablePropertyId, @Value)";

							conn.Execute(sql, param);
						}
						#endregion
					}
				}
				foreach(Category_Product catProdItem in dbCategories_Products)
				{// check if there are categories to delete
					if(!model.SelectedCategories.Any(c => c == catProdItem.CategoryId.ToString()))
					{
						param = new DynamicParameters();
						param.Add("@CategoryId", catProdItem.CategoryId);
						param.Add("@ProductId", model.ProductId);
						sql = "DELETE FROM [Categories_Products] WHERE [CategoryId] = @CategoryId AND [ProductId] = @ProductId";
						conn.Execute(sql, param);

						sql = "DELETE FROM [ProductChoosablePropertiesValue] WHERE [CategoryId] = @CategoryId AND [ProductId] = @ProductId";
						conn.Execute(sql, param);

						sql = "DELETE FROM [ProductMeasurablePropertiesValue] WHERE [CategoryId] = @CategoryId AND [ProductId] = @ProductId";
						conn.Execute(sql, param);

						#region parent categories
						param = new DynamicParameters();
						param.Add("@Id", catProdItem.CategoryId);
						sql = "SELECT [ParentId] FROM [Categories] WHERE [Id] = @Id";
						Guid parentId = conn.ExecuteScalar<Guid>(sql, param);

						while(parentId != Guid.Empty)
						{
							param = new DynamicParameters();
							param.Add("@CategoryId", parentId);

							sql = "DELETE FROM [ProductChoosablePropertiesValue] WHERE [CategoryId] = @CategoryId";
							conn.Execute(sql, param);

							sql = "DELETE FROM [ProductMeasurablePropertiesValue] WHERE [CategoryId] = @CategoryId";
							conn.Execute(sql, param);

							sql = "SELECT [ParentId] FROM [Categories] WHERE [Id] = @CategoryId";
							parentId = conn.ExecuteScalar<Guid>(sql, param);
						}
						#endregion
					}
				}
			}

			result.Success = true;
			return result;
		}
		[Route("[action]")]
		[HttpPost]
		public async Task<ActionResult<GetProductCustomPropertiesDataOut>> GetProductCustomProperties(GetProductCustomPropertiesDataIn model)
		{
			IMapper mapper = AutoMapperConfigs.UserPanel().CreateMapper();
			GetProductCustomPropertiesDataOut result = new GetProductCustomPropertiesDataOut();
			IEnumerable<CategoryProductChoosableProperty> choosableProperties = new List<CategoryProductChoosableProperty>();
			IEnumerable<CategoryProductMeasurableProperty> measurableProperties = new List<CategoryProductMeasurableProperty>();

			using (IDbConnection conn = _dataAccess.GetDbConnection())
			{
				DynamicParameters param = new DynamicParameters();
				param.Add("ProductId", model.ProductId);
				string sql = "SELECT [CategoryId] FROM [Categories_Products] WHERE [ProductId] = @ProductId";
				IEnumerable<Guid> productCategoriesId = conn.Query<Guid>(sql, param);


				foreach (Guid categoryIdItem in productCategoriesId)
				{
					Guid currCatId = categoryIdItem;
					do
					{
						param = new DynamicParameters();
						param.Add("@CategoryId", currCatId);

						sql = "SELECT * FROM [CategoryProductChoosableProperties] WHERE [CategoryId] = @CategoryId";
						IEnumerable<CategoryProductChoosableProperty> dbChProps = conn.Query<CategoryProductChoosableProperty>(sql, param);
						choosableProperties = choosableProperties.Concat(dbChProps);

						sql = "SELECT * FROM [CategoryProductMeasurableProperties] WHERE [CategoryId] = @CategoryId";
						IEnumerable<CategoryProductMeasurableProperty> dbMProps = conn.Query<CategoryProductMeasurableProperty>(sql, param);
						measurableProperties = measurableProperties.Concat(dbMProps);

						sql = "SELECT [ParentId] FROM [Categories] WHERE [Id] = @CategoryId";
						currCatId = conn.ExecuteScalar<Guid>(sql, param);
					}
					while (currCatId != Guid.Empty);
				}



			}

			result.ChoosableProperties = mapper.Map<IEnumerable<CategoryProductChoosableProperty>, List<CategoryProductChoosablePropertyViewModel>>(choosableProperties);
			result.MeasurableProperties = mapper.Map<IEnumerable<CategoryProductMeasurableProperty>, List<CategoryProductMeasurablePropertyViewModel>>(measurableProperties);
			result.Success = true;

			return result;
		}
		#endregion products
	}
}
