using AutoMapper;
using CustomShopMVC.DataAccess.DatabaseModels;
using CustomShopMVC.DataAccess.DatabaseModels;
using CustomShopMVC.Helpers;
using CustomShopMVC.Identity;
using CustomShopMVC.Models;
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
using static CustomShopMVC.Models.UserPanelModels;

namespace CustomShopMVC.Controllers
{
	[ApiController]
	[Route("API/{controller}")]
	public class UserPanelController : ControllerBase
	{
		private IDatabaseAccess _dataAccess;
		private IUpload _upload;
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

			string sql = "SELECT " +
				"[Products.Id], [Products.AuthorId], [Products.OwnerId], [Products.Name], [Products.Description], [Products.ThumbnailImagePath], [Products.Quantity], [ProductImages.ImagePath] " +
				"FROM [Products] LEFT OUTER JOIN [ProductImages] ON [Products.Id] = [ProductImages.ProductId]";

			using (IDbConnection conn = _dataAccess.GetDbConnection())
			{
				var selectJoin = await conn.QueryAsync<Product, ProductImage, Product>(sql,
					(product, productImage) =>
					{
						product.Images.Add(productImage);
						return product;
					}
				);
				dbProducts = selectJoin.GroupBy(p => p.Id).Select(g =>
				{
					Product groupedProduct = g.First();
					groupedProduct.Images = g.Select(g => g.Images.Single()).ToList();
					return groupedProduct;
				});

				result.Products = mapper.Map<IEnumerable<Product>, IEnumerable<ProductViewModel>>(dbProducts).ToList();
			}
			return result;
		}
		

		public async Task<ActionResult<SaveProductDataOut>> SaveProduct(SaveProductDataIn model)
		{
			SaveProductDataOut result = new SaveProductDataOut();
			IMapper mapper = AutoMapperConfigs.UserPanel().CreateMapper();

			string sql;
			int count;
			int update;
			int insert;
			DynamicParameters param = new DynamicParameters();

			if (model.Product.Id.Contains("new"))
			{
				model.Product.Id = Guid.NewGuid().ToString();
				
				string thumbnailImagePath = "";
				if (model.Product.NewThumbnailImage.Length > 0)
					thumbnailImagePath = _upload.Image(model.Product.NewThumbnailImage);

				string imagesPath = "";
				for (int i = 0; i > model.Product.NewImages.Count; i++)
				{
					if (i == 0)
						imagesPath = _upload.Image(model.Product.NewImages[i]);
					else
						imagesPath += "," + _upload.Image(model.Product.NewImages[i]);
				}

				param.Add("@Id", model.Product.Id);
				param.Add("@AuthorId", model.Product.AuthorId);
				param.Add("@OwnerId", model.Product.OwnerId);
				param.Add("@Name", model.Product.Name);
				param.Add("@Description", model.Product.Description);
				param.Add("@ThumbnailImagePath",thumbnailImagePath);
				param.Add("@ImagesPaths", imagesPath);
				param.Add("@Quantity", model.Product.Quantity);
				using (IDbConnection conn = _dataAccess.GetDbConnection())
				{
					sql = "SELECT COUNT(*) FROM [Products] WHERE [Id] != @Id AND [Name] != Name";
					count = conn.ExecuteScalar<int>(sql, param);
					if (count > 0)
					{
						result.Success = false;
						result.NameError = "There already exists product with this name";
						return result;
					}

					sql = "INSERT INTO [Products] VALUES(@Id, @AuthorId, @OwnerId, @Name, @Description, @ThumbnailImagePath, @ImagesPath, @Quantity)";
					insert = conn.Execute(sql, param);


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
				}
			}
			else // update
			{
				string thumbnailImagePath = "";
				if (model.Product.NewThumbnailImage.Length > 0)
					thumbnailImagePath = _upload.Image(model.Product.NewThumbnailImage);

				string imagesPath = "";
				for (int i = 0; i > model.Product.NewImages.Count; i++)
				{
					if (i == 0)
						imagesPath = _upload.Image(model.Product.NewImages[i]);
					else
						imagesPath += "," + _upload.Image(model.Product.NewImages[i]);
				}

				param.Add("@Id", model.Product.Id);
				param.Add("@AuthorId", model.Product.AuthorId);
				param.Add("@OwnerId", model.Product.OwnerId);
				param.Add("@Name", model.Product.Name);
				param.Add("@Description", model.Product.Description);
				param.Add("@ThumbnailImagePath", thumbnailImagePath);
				param.Add("@ImagesPaths", imagesPath);
				param.Add("@Quantity", model.Product.Quantity);
				using (IDbConnection conn = _dataAccess.GetDbConnection())
				{
					sql = "SELECT COUNT(*) FROM [Products] WHERE [Id] != @Id AND [Name] != Name";
					count = conn.ExecuteScalar<int>(sql, param);
					if (count > 0)
					{
						result.Success = false;
						result.NameError = "There already exists product with this name";
						return result;
					}

					sql = "UPDATE [Prodcuts] SET [AuthorId] = @AuthorId, [OwnerId] = @OwnerId, [Name] = @Name, [Description] = @Description, [ThumbnailImagePath] = @ThumbnailImagePath, [ImagesPath] = @ImagesPaths, [Quantity] = @Quantity";
					update = conn.Execute(sql, param);
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
				}
			}
				return result;
		}

		#endregion products
	}
}
