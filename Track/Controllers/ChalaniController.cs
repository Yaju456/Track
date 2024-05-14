using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Track.Models;
using Track.Repository.Irepository;
using Track.ViewModel;

namespace Track.Controllers
{
    public class ChalaniController : Controller
    {
        public readonly IunitOfwork _db;
        public readonly UserManager<IdentityUser> _userManager;
        public ChalaniController(IunitOfwork db, UserManager<IdentityUser> userManager)
        {
            _db = db;
            _userManager = userManager;
        }
        public IActionResult Index()
        {
            return View();
        }

        public JsonResult getAllChalani()
        {
            List<ChalaniClass> data  = _db.Chalani.getAll(prop: "Customer").ToList();
            return Json(data);
        }

        [HttpPost]
        public IActionResult AddChalani(ChalaniClass obj)
        {
            if(ModelState.IsValid) 
            {
                List<ChalanihasProductClass> data;
                if (obj.Id == 0) 
                {
                    string User_id = User.FindFirstValue(ClaimTypes.NameIdentifier);
                    data = _db.Chalanihasproduct.getSpecifics(u => u.User_id == User_id && u.Chalani_id == null, null).ToList();
                    _db.Chalani.Add(obj);
                }
                else
                {
                    data= _db.Chalanihasproduct.getSpecifics(u=>u.Chalani_id==obj.Id, null).ToList();
                    _db.Chalani.Update(obj);
                }
                _db.Save();
                
                foreach(var item in data) 
                {
                    item.Chalani_id = obj.Id;
                    List<StockClass> Stock= _db.Stock.getSpecifics(u=>u.chalanihasProduct_id==item.Id, null).ToList();
                    foreach(var lili in Stock)
                    {
                        lili.Customer_id= obj.Customer_id;
                        _db.Stock.Update(lili);
                    }
                    _db.Chalanihasproduct.Update(item);
                }
                _db.Save();
                return RedirectToAction("Index");
            }
            else
            {
                TempData["error"] = "Modal state is not Valid";
                return RedirectToAction("CreateChalani");
            }
        }
        public JsonResult getChalani(int? id)
        {
            if(id==0)
            {
                string? user_id = User.FindFirstValue(ClaimTypes.NameIdentifier);
                List<ChalanihasProductClass> data = _db.Chalanihasproduct.getSpecifics(u => u.User_id == user_id && u.Chalani_id == null, prop: "Product").ToList();
                return Json(data);
            }
            else
            {
                List<ChalanihasProductClass> data = _db.Chalanihasproduct.getSpecifics(u => u.Chalani_id == id, prop: "Product").ToList();
                return Json(data);
            }
            
        }
        public IActionResult CreateChalani(int? id)
        {
            IEnumerable<SelectListItem> CustomerName = _db.customer.getAll(null).Select(u => new SelectListItem
            {
                Text = u.Name,
                Value = u.Id.ToString(),
            });
            IEnumerable<SelectListItem> CustomerNumber = _db.customer.getAll(null).Select(u => new SelectListItem
            {
                Text = u.PhoneNumber.ToString(),
                Value = u.Id.ToString(),
            });
            IEnumerable<SelectListItem> ProductName = _db.Product.getAll(null).Select(u => new SelectListItem
            {
                Text = u.Name,
                Value = u.Id.ToString(),
            });
            ViewBag.CustomerName = CustomerName;
            ViewBag.CustomerNumber = CustomerNumber;
            ViewBag.ProductName = ProductName;
            ChalaniClass value = _db.Chalani.GetOne(u => u.Id == id, null);
            if(value != null) 
            {
                return View(value);
            }
            else 
            { 
                ChalaniClass lili = new ChalaniClass();
                lili.Id = 0;
                return View(lili);
            }
        }

        public JsonResult DeleteChalani(int id)
        {
            ChalanihasProductClass to_delete = _db.Chalanihasproduct.GetOne(u => u.Id == id, null);
            if (to_delete != null) 
            {
                List<StockClass> man= _db.Stock.getSpecifics(u=>u.chalanihasProduct_id==id, null).ToList();
                foreach(var data in man)
                {
                    data.InStock="Y";
                    data.Customer_id = null;
                    data.chalanihasProduct_id = null;
                    _db.Stock.Update(data);
                }
                _db.Chalanihasproduct.Delete(to_delete);
                _db.Save();
                return Json(new
                {
                    success = true,
                    message = "Value Deleted"
                });
            }
            else
            {
                return Json(new
                {
                    success=false,
                    message="Given value not found"
                });
            }
        }
        [HttpPost]
        public IActionResult AddChalaniOne(ChalanihasProductVM obj)
        {
            obj.Class.User_id = User.FindFirstValue(ClaimTypes.NameIdentifier);
            bool success1;
            string message1;
            if (ModelState.IsValid)
            {
                try
                {
                    List<string?> serial_no = _db.Stock.getSpecifics(u => u.serial_number != null, null).Select(u => u.serial_number).ToList();
                    if (obj.Serial_no.Select(u => u.Value).Contains(null))
                    {
                        throw new Exception("No Serial number is provided");
                    }
                    if (obj.Serial_no.Select(u => u.Value).Distinct().Count() != obj.Serial_no.Count)
                    {
                        throw new Exception("Serial no not unique");
                    }


                    if (obj.Class.Id == 0)
                    {
                        int Instock_count = _db.Stock.getSpecifics(u => u.InStock == "Y" && u.Product_id == obj.Class.product_id &&
                        u.chalanihasProduct_id == null, null).Count();

                        if (Instock_count < obj.Class.Quantity)
                        {
                            throw new Exception("Not Enough Item avaibale in Stock");
                        }
                        foreach (var check in obj.Serial_no)
                        {
                            string check_serial = check.Value;
                            if (check_serial != _db.Stock.GetOne(u => u.Id == check.Id, null).serial_number)
                            {
                                if (serial_no.Contains(check_serial))
                                {
                                    throw new Exception("Serial_no error not Unique");
                                }
                            }

                        }
                        if(obj.chalani_no!=0)
                        {
                            obj.Class.Chalani_id = obj.chalani_no;
                        }
                        _db.Chalanihasproduct.Add(obj.Class);
                        _db.Save();
                        foreach (var item in obj.Serial_no)
                        {
                            StockClass man = _db.Stock.GetOne(u => u.Id == item.Id, null);
                            if (man.InStock == "N")
                            {
                                _db.Chalanihasproduct.Delete(obj.Class);
                                _db.Save();
                                throw new Exception("Given Item of product no " + item.Id + " has alread been out of stock enter again");
                            }
                            man.chalanihasProduct_id = obj.Class.Id;
                            man.serial_number = obj.Serial_no.FirstOrDefault(u => u.Id == item.Id).Value;
                            man.InStock = "N";
                            _db.Stock.Update(man);
                        }
                        _db.Save();
                        success1 = true;
                        message1 = "Value Added";
                    }
                    else
                    {
                        List<StockClass> man = _db.Stock.getSpecifics(u => u.chalanihasProduct_id == obj.Class.Id, null).ToList();
                        int B_update = man.Count;

                        if (B_update >= obj.Class.Quantity)
                        {
                            int check = 0;
                            foreach (var item in man)
                            {
                                if (check < obj.Class.Quantity && obj.Serial_no.Select(u => u.Id).Contains(item.Id))
                                {

                                    item.serial_number = obj.Serial_no[check].Value.ToString();
                                    item.InStock = "N";
                                    check++;
                                }
                                else
                                {
                                    item.serial_number = null;
                                    item.chalanihasProduct_id = null;
                                    item.InStock = "Y";
                                }
                                _db.Stock.Update(item);
                            }
                        }
                        else
                        {
                            int additional_required = obj.Class.Quantity - B_update;
                            int Instock_count = _db.Stock.getSpecifics(u => u.InStock == "Y" && u.Product_id == obj.Class.product_id && u.chalanihasProduct_id == null, null).Count();
                            if (Instock_count < additional_required)
                            {
                                throw new Exception("Not Enough Item avaibale in Stock");
                            }
                            foreach (var item in obj.Serial_no)
                            {
                                StockClass man1 = _db.Stock.GetOne(u => u.Id == item.Id, null);
                                if (!(man1.InStock == "Y" || man1.chalanihasProduct_id == obj.Class.Id))
                                {
                                    throw new Exception("Given Item of product no " + item.Id + " has alread been out of stock enter again");
                                }
                                man1.chalanihasProduct_id = obj.Class.Id;
                                man1.serial_number = obj.Serial_no.FirstOrDefault(u => u.Id == item.Id).Value;
                                man1.InStock = "N";
                                _db.Stock.Update(man1);
                            }

                        }
                        if(obj.chalani_no!=0)
                        {
                            obj.Class.Chalani_id= obj.chalani_no;
                        }
                        _db.Chalanihasproduct.Update(obj.Class);
                        success1 = true;
                        message1 = "Value Updated";
                    }
                    _db.Save();
                    return Json(new
                    {
                        success = success1,
                        message = message1
                    });
                }
                catch (Exception ex)
                {
                    return Json(new
                    {
                        success = false,
                        message = ex.Message
                    });
                }
            }
            else
            {
                return Json(
                    new
                    {
                        success = false,
                        message = "Modal state not valid"
                    });
            }
        }
    }
}
