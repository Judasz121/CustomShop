using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CustomShopMVC.Models.ViewModels
{
    public class ErrorViewModel
    {
        public ErrorViewModel(string FieldName, string Messgae)
        {
            this.FieldName = FieldName;
            this.Message = Message;
        }

        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string FieldName { get; set; }
        public string Message { get; set; }
    }
}
