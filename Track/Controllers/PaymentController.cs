using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using Track.Models;
using Track.Repository.Irepository;

namespace Track.Controllers
{
    public class PaymentController : Controller
    {
        private readonly IunitOfwork _db;
        public PaymentController(IunitOfwork db)
        {
            _db = db;
        }
        public IActionResult Index()
        {
            ViewBag.ActivePage = "Payment";
            return View();
        }

        public JsonResult GetAll()
        {
            List <PaymentClass> PaymentList= _db.Payment.getAll(prop: "Bill").ToList();
            return Json(PaymentList);
        }
    }
}
