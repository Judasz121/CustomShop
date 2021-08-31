using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Mail;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CustomShopMVC.Helpers
{
    public interface IUpload
	{
        string Image(IFormFile file);
	}
    public  class Upload : IUpload
    {
        private readonly IWebHostEnvironment _webHostEnvironment;
        public Upload(IWebHostEnvironment webHostEnvironment)
		{
            _webHostEnvironment = webHostEnvironment;
		}
        public string Image(IFormFile file)
        {
            string uploadFolder = Path.Combine(_webHostEnvironment.WebRootPath, "DbContent/Images");
            string fileName = Guid.NewGuid().ToString() + "_" + file.FileName;
            string filePath = Path.Combine(uploadFolder, fileName);
            using(FileStream fs = new FileStream(filePath, FileMode.Create))
			{
                file.CopyTo(fs);
			}
            return filePath;
        }
    }
}
