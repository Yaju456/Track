using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Track.Models;
using Track.PreData;
using Track.Repository.Irepository;
using Track.ViewModel;

namespace Track.Controllers
{
    [Authorize(Roles = Roll.Admin+","+Roll.client)]

    public class OrderController : Controller
    {
        private readonly IunitOfwork _db;
        private readonly UserManager<IdentityUser> _userManager;
        public OrderController(IunitOfwork db, UserManager<IdentityUser> userManager)
        {
            _db = db;
            _userManager = userManager;
        }
        public IActionResult Index()
        {
            ViewBag.ActivePage = "Order";
            return View();
        }

        public JsonResult GetAll()
        {

            List<OrderClass> order = _db.Order.getAll(prop: "vendor").ToList();
            _db.Save();
            return new JsonResult(order);
        }
        
        public JsonResult Get(int? id) 
        {
            List<StockClass> list = _db.Stock.getSpecifics(u => u.Order_id == id, prop: "Product,Customer").ToList();
            return new JsonResult(list);
        }


        public JsonResult GetMost()
        {
            List<StockClass> list = _db.Stock.getAll(prop: "Product,Customer").ToList();
            return new JsonResult(list);
        }


        public IActionResult newOrder()
        {
            ViewBag.ActivePage = "Order";
            IEnumerable<SelectListItem> Products= _db.Product.getAll(prop:null).Select(u=> new SelectListItem
            {
                Text=u.Id + " " + u.Name,
                Value=u.Id.ToString(),
            });

            IEnumerable<SelectListItem> Vendor = _db.Vendor.getAll(prop: null).Select(u => new SelectListItem
            {
                Text = u.Id + " " + u.Name,
                Value = u.Id.ToString(),
            });
            ViewBag.Products = Products;  
            ViewBag.Vendor = Vendor;
            return View();
        }

        public JsonResult GetBucket()
        {
            string UserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            List<BucketClass> allBuckets= _db.Bucket.getSpecifics(u=>u.User_id==UserId,prop: "Product").ToList();
            return new JsonResult(allBuckets);
        }

        public IActionResult bucketAdd(BucketClass obj)
        {
            obj.User_id = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (ModelState.IsValid)
            {
                if(obj.Id==0)
                {
                    _db.Bucket.Add(obj);
                    _db.Save();
                    return Json(new
                    {
                        success = true,
                        message = "Product Added"
                    });
                }
                else
                {
                    BucketClass buck = _db.Bucket.GetOne(u => u.Id == obj.Id,prop:null);
                    if(buck !=null)
                    {
                        buck.Product_id = obj.Product_id;
                        buck.Quantity= obj.Quantity;
                        _db.Bucket.Update(buck);
                        _db.Save();
                        return Json(new
                        {
                            success = true,
                            message = "Product Updated"
                        });
                    }
                    return Json(new
                    {
                        success = false,
                        message = "Product not found"
                    });

                }
            }
            else
            {
                return Json(new
                {
                    success=false,
                    message="Modal State was not valid"
                });
            }
        }

        public IActionResult DeleteBucket(int? id)
        {
            BucketClass To_Delete = _db.Bucket.GetOne(u => u.Id == id, prop: null);
            if (To_Delete != null)
            {
                _db.Bucket.Delete(To_Delete);
                _db.Save();
                return Json(new
                {
                    success = true,
                    message = To_Delete.Id + " id's recorde is Deleted"
                });
            }
            else
            {
                return Json(new
                {
                    success = false,
                    message = "There was error while deleting"
                });
            }
        }
        public IActionResult AddSerial(int? id)
        {
            ViewBag.ActivePage = "Stock";
            IEnumerable<SelectListItem> Customer_id = _db.customer.getAll(prop: null).Select(u => new SelectListItem
            {
                Text = u.Id + " " + u.Name,
                Value = u.Id.ToString()
            });
            ViewBag.Customer_id = Customer_id;
            if (id!=null)
            {
                return View(id);
            }
            else
            {
                return View(0);
            }
        }

        [HttpPost]
        public IActionResult AddSerial(IDandSerial data) 
        {
            ViewBag.ActivePage = "Stock";
            if (ModelState.IsValid)
            {
                try
                {
                    if(data.id!=0)
                    {
                        StockClass one = _db.Stock.GetOne(u => u.Id == data.id, prop: null);
                        one.serial_number = data.serial_no;
                        if (data.customer_id != null)
                        {
                            one.Customer_id = data.customer_id;
                            one.InStock = "N";
                        }
                        else
                        {
                            one.InStock = "Y";
                        }
                        _db.Stock.Update(one);
                        _db.Save();

                        return Json(new
                        {
                            success = true,
                            message = "Value Updated"
                        });
                    }
                    else
                    {
                        StockClass one = new StockClass();
                        one.Id = data.id;
                        one.serial_number= data.serial_no;
                        one.Customer_id= data.customer_id;
                        one.InStock="Y";
                        _db.Stock.Add(one);
                        _db.Save();

                        return Json(new
                        {
                            success = true,
                            message = "Value Added"
                        });
                    }
                   
                }
                catch (Exception ex)
                {
                    return Json(new
                    {
                        success=false,
                        message=ex.Message
                    });
                }

            }
            else
            {
                return Json(new
                {
                    success=false,
                    message="Modal state is Not validate"
                });
            }
        }


        [HttpPost]
        public IActionResult Addstock(Add_stock data)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    StockClass one = new StockClass();
                    one.Id = data.id;
                    one.Order_id= data.order_id;
                    if(data.customer_id==0)
                    {
                        one.Customer_id =null;
                        one.InStock = "Y";

                    }
                    else
                    {
                        one.Customer_id=data.customer_id;
                        one.InStock = "Y";
                    }
                    
                    one.serial_number = data.serial_no;
                    //one.Product_id = _db.Order.GetOne(u => u.Id == data.order_id,prop:null).Product_id;
                    _db.Stock.Add(one);
                    _db.Save();
                    
                    return Json(new
                    {
                        success = true,
                        message = "Serial Number Updated"
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
                return Json(new
                {
                    success = false,
                    message = "Modal state is Not validate"
                });
            }
        }


        public IActionResult ViewOrder(int? id)
        {
            ViewBag.ActivePage = "Order";
            OrderClass one = _db.Order.GetOne(u => u.Id == id, prop: "vendor");
            return View(one);
        }

        public JsonResult getVewOrder(int? id) 
        {
            List<OrderhasProducts> list = _db.Orderhasproduct.getSpecifics(u => u.Order_id == id, prop: "Product").ToList();
            return new JsonResult(list);
        }


        public IActionResult Deletestock(int? id)
        {
            StockClass To_Delete = _db.Stock.GetOne(u => u.Id == id, prop: null);
            if(To_Delete != null)
            {
                _db.Stock.Delete(To_Delete);
                _db.Save();
                return Json(new
                {
                    success = true,
                    message = To_Delete.Id + " id's recorde is Deleted"
                });
            }
            else
            {
                return Json(new
                {
                    success = false,
                    message = "There was error while deleting"
                });
            }
        }
        public IActionResult Delete(int id)
        {
            OrderClass To_delete = _db.Order.GetOne(u => u.Id == id, prop: null);
            if(To_delete != null) 
            {
                _db.Order.Delete(To_delete);
                _db.Save();
                return Json(new
                {
                    success = true,
                    message= To_delete.Id+" id's recorde is Deleted"
                });
            }
            else
            {
                return Json(new
                {
                    success= false,
                    message="There was error while deleting"
                });
            }
        }
        public IActionResult AddnewOrder(OrderClass man)
        {

            if(ModelState.IsValid) 
            {
                try
                {
                    _db.Order.Add(man);
                    _db.Save();
                    string User_id = User.FindFirstValue(ClaimTypes.NameIdentifier);
                    List<BucketClass> buckets = _db.Bucket.getSpecifics(u=>u.User_id==User_id,null).ToList();
                 
                    foreach ( var a in buckets)
                    {
                        OrderhasProducts one = new OrderhasProducts();
                        one.Product_id = Convert.ToInt32(a.Product_id);
                        one.Order_id = man.Id;
                        one.Quantity = Convert.ToInt32(a.Quantity);
                        for (int i = 0; i < a.Quantity; i++)
                        {
                            StockClass Stock= new StockClass();
                            Stock.Product_id = one.Product_id;
                            Stock.Order_id = man.Id;
                            Stock.InStock = "Y";
                            Stock.isDamaged="T";
                            _db.Stock.Add(Stock);   
                        }
                        _db.Orderhasproduct.Add(one);
                    }
                    _db.Bucket.DeleteMost(buckets);
                    _db.Save();
                    return Json(new
                    {
                        success=true,
                        message="Order Added"
                    });
                }
                catch (Exception ex) 
                {

                    return Json(new
                    {
                        success= false,
                        message=ex.Message
                    });
                }
            }
            else
            {
                return Json(new
                {
                    success=false,
                    message="Invalid Modal State"
                });
            }
        }
    }
}
