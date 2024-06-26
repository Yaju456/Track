﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using Track.Data;
using Track.Models;
using Track.PreData;
using Track.Repository.Irepository;

namespace Track.Controllers
{
    [Authorize(Roles =Roll.Admin)]
    public class PaymentController : Controller
    {
        private readonly Applicationdbcontext _context;
        public PaymentController( Applicationdbcontext context)
        {
            _context = context;
        }
        public IActionResult Index()
        {
            ViewBag.ActivePage = "Payment";
            return View();
        }

        public JsonResult GetAll()
        {
            var data = from payment in _context.Payment
                       join bill in _context.Bill on payment.Bill_id equals bill.Id
                       join customer in _context.CustomerTable on bill.Customer_id equals customer.Id
                       select new
                       {
                           method= payment.Method,
                           PDate= payment.PDate,
                           Amount = payment.Amount,
                           commission= payment.commission,
                           commission_to=payment.Commissino_to,
                           bill_no= bill.Billno,
                           total = bill.total,
                           Name= customer.Name,
                       };
            var PaymentList= data.ToList();
            return Json(PaymentList);
        }
    }
}
