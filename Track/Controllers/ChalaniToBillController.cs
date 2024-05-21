
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Track.Models;
using Track.Repository.Irepository;
using Track.ViewModel;

namespace Track.Controllers
{
    public class ChalaniToBillController : Controller
    {
        private readonly IunitOfwork _db;
        private readonly UserManager<IdentityUser> _userManager;
        public ChalaniToBillController(IunitOfwork db,UserManager<IdentityUser> userManager)
        {
            _db = db;
            _userManager = userManager;
        }
        public IActionResult Index(int? id) 
        {
            BillClass billClass = _db.Bill.GetOne(u => u.Id == id, prop: "Customer");
            return View(billClass);
        }
        public IActionResult CtoB(int? id)
        {
            ChalaniClass to_generate = _db.Chalani.GetOne(u => u.Id == id, null);
            try
            {
                if (to_generate != null)
                {
                    
                    BillClass myBill = new BillClass();
                    if (to_generate.Bill_id == null)
                    {
                        myBill.Customer_id = to_generate.Customer_id;
                        myBill.Billno = null;
                        myBill.total = 0;
                        myBill.hasChalani = "Y";
                        _db.Bill.Add(myBill);
                        _db.Save();
                        myBill.Billno = "T-" + myBill.Id;
                        to_generate.Bill_id = myBill.Id;
                        _db.Chalani.Update(to_generate);
                    }
                    else
                    {
                        myBill = _db.Bill.GetOne(u => u.Id == to_generate.Bill_id, null);
                        List<BillhasProductClass> mylist=_db.Billhasproduct.getSpecifics(u=>u.Bill_id==myBill.Id && u.Extra_items==null, null).ToList();
                        _db.Billhasproduct.DeleteMost(mylist);
                    }
                    List<ChalanihasProductClass> Chalani = _db.Chalanihasproduct.getSpecifics(u => u.Chalani_id == id, null).ToList();
                    foreach (var chal in Chalani)
                    {
                        BillhasProductClass show = new BillhasProductClass();
                        show.Bill_id = myBill.Id;
                        show.product_id = chal.product_id;
                        show.Quantity = chal.Quantity;
                        show.Rate = 0;
                        show.User_id = User.FindFirstValue(ClaimTypes.NameIdentifier);
                        _db.Billhasproduct.Add(show);
                        _db.Save();

                        List<StockClass> to_changeBillid = _db.Stock.getSpecifics(u => u.chalanihasProduct_id == chal.Id, null).ToList();
                        foreach (var stak in to_changeBillid)
                        {
                            stak.billhasProduct_id = show.Id;
                            _db.Stock.Update(stak);
                        }
                        _db.Save();
                    }
                    return RedirectToAction("Index", new {id = myBill.Id});
                }
                else
                {
                    return Json(new
                    {
                        success = false,
                        message = "Something went wrong"
                    });
                }
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    success = false,
                    message = ex.Message,
                });
            }
        }

        public JsonResult GetBillhasproduct(int? id)
        {
            IEnumerable<BillhasProductClass> data = _db.Billhasproduct.getSpecifics(u => u.Bill_id == id, prop: "Product");
            return Json(data);
        }

        public JsonResult BillAdd(ChalaniTobillVM one)
        {
            try
            {
                if (one.Bill.Date == null)
                {
                    throw new Exception("Given date is Null");
                }
                BillClass myBill = _db.Bill.GetOne(u => u.Id == one.Bill.Id, null);
                myBill.Billno = one.Bill.Billno;
                myBill.Date = one.Bill.Date;
                myBill.total = 0;
                List<BillhasProductClass> icon = _db.Billhasproduct.getSpecifics(u => u.Bill_id == myBill.Id, null).ToList();
                int rat = 0;
                foreach (var iconItem in icon)
                {
                    iconItem.Rate = one.Rates[rat];
                    rat++;
                    iconItem.total= iconItem.Rate*iconItem.Quantity;
                    myBill.total +=Convert.ToDouble(iconItem.Rate * iconItem.Quantity);
                    _db.Billhasproduct.Update(iconItem);
                }
                ChalaniClass myChal= _db.Chalani.GetOne(u => u.Bill_id==myBill.Id, null);
                myChal.BillCreated = "Y";
                _db.Bill.Update(myBill);
                _db.Chalani.Update(myChal);
                _db.Save();
                return Json(new
                {
                    success = true,
                    message = "well done myboy"
                });
            }
            catch (Exception ex) 
            {
                return Json(new
                {
                    success = false,
                    message = ex.Message,
                });
            }
            
        }

        public JsonResult DeleteService(int id)
        {
            BillhasProductClass data = _db.Billhasproduct.GetOne(u => u.Id == id, null);
            if(data!=null)
            {
                _db.Billhasproduct.Delete(data);
                _db.Save();
                return Json(new
                {
                    success = true,
                    message = "Service Deleted from the bill"
                });
            }
            else
            {
                return Json(new
                {
                    success=false,
                    message="Something went wrong no data available"
                });
            }
        }

        [HttpPost]
        public JsonResult AddService(BillhasProductClass obj)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    string Mesage;
                    obj.total = obj.Quantity * obj.Rate;
                    obj.User_id = User.FindFirstValue(ClaimTypes.NameIdentifier);
                    BillhasProductClass man = _db.Billhasproduct.GetOne(u => u.Id == obj.Id, null);
                    if(man==null)
                    {
                        _db.Billhasproduct.Add(obj);
                        Mesage = "Product Added Succesfully";
                    }
                    else
                    {
                        _db.Billhasproduct.Update(obj);
                        Mesage = "Product Updated Successfully";
                    }
                    _db.Save();
                    return Json(new
                    {
                        success = true,
                        message = Mesage
                    });
                }
                catch(Exception ex)
                {
                    return Json(new
                    {
                        success = false,
                        message = ex.Message,
                    });
                }
            }
            else
            {
                return Json(new
                {
                    success=false,
                    message="Modal state not valid"
                });
            }
            
        }
    }
}
