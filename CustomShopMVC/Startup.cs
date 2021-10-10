using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using JavaScriptEngineSwitcher.V8;
using JavaScriptEngineSwitcher.Extensions.MsDependencyInjection;
using React.AspNet;
using CustomShopMVC.Identity;
using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System.IO;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using CustomShopMVC.DataAccess.Identity;
using CustomShopMVC.Helpers;

namespace CustomShopMVC
{
	public class Startup
	{
		public Startup(IConfiguration configuration)
		{
			Configuration = configuration;
		}

		public IConfiguration Configuration { get; }

		// This method gets called by the runtime. Use this method to add services to the container.
		public void ConfigureServices(IServiceCollection services)
		{
			services.AddScoped<IDatabaseAccess, DatabaseAccess>();
			services.AddSingleton<IUpload, Upload>();
			services.AddIdentity<ApplicationUser, ApplicationUserRole> ()
				.AddUserStore<DapperUserStore>()
				.AddRoleStore<DapperRoleStore>()
				.AddErrorDescriber<CustomIdentityErrorDescriber>()
				.AddDefaultTokenProviders()
			;
			services.AddScoped<IUserClaimsPrincipalFactory<ApplicationUser>, UserCustomClaimsPrincipalFactory>();
			services.Configure<IdentityOptions>(options =>
			{
				options.Password.RequireNonAlphanumeric = false;
				options.Password.RequireUppercase = false;
				options.Password.RequireLowercase = false;
			});
			services.AddSpaStaticFiles(config =>
			{
				config.RootPath = "react-views/build";
			});
			services.AddMvc(options =>
			{
				options.EnableEndpointRouting = false;
			});
		}

		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
		{
			if (env.IsDevelopment())
			{
				app.UseDeveloperExceptionPage();
			}
			app.UseHttpsRedirection();
			app.UseStaticFiles();
			app.UseSpaStaticFiles();

			app.UseRouting();

			app.UseAuthentication();
			app.UseAuthorization();

			app.UseEndpoints(endpoints =>
			{
				endpoints.MapControllerRoute(
					name: "default",
					pattern: "{controller}/{action=Index}/{id?}");
			});

			app.UseSpa(spa =>
			{
				spa.Options.SourcePath = Path.Join(env.ContentRootPath, "react-views");
				if (env.IsDevelopment())
				{
					//spa.UseReactDevelopmentServer(npmScript: "start");
					spa.UseProxyToSpaDevelopmentServer("http://localhost:3000");
				}
			});

		}
	}
}
