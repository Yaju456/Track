using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using Track.Data;
using Track.Models;
using Track.Repository.Irepository;

namespace Track.Repository
{
    public class billhasProductRepo : MainRepo<BillhasProductClass>, IbillhasProduct
    {
        private readonly DbSet<BillhasProductClass> _billhasProducts;
        private readonly Applicationdbcontext _db;
        public billhasProductRepo(Applicationdbcontext db) : base(db)
        {
            _billhasProducts = db.Set<BillhasProductClass>();
            _db = db;
        }
        public override void Add(BillhasProductClass obj)
        {
            if (obj.Bill_id != null)
            {
                BillClass bill= _db.Bill.FirstOrDefault(u=>u.Id==obj.Bill_id);
                bill.total += Convert.ToDouble(obj.total);
                _db.Bill.Update(bill);
                _db.SaveChanges();
            }
            base.Add(obj);
        }
        public void Update(BillhasProductClass obj)
        {
            BillhasProductClass To_update= _billhasProducts.FirstOrDefault(u=>u.Id==obj.Id);
            if (To_update!=null) 
            {
                To_update.Bill_id = obj.Bill_id;
                if (obj.Bill_id != null)
                { 
                    BillClass myBill= _db.Bill.FirstOrDefault(u=>u.Id==obj.Bill_id);
                    if (myBill!=null)
                    {
                        myBill.total = Convert.ToDouble(myBill.total - To_update.total + obj.total);
                        _db.Bill.Update(myBill);
                        _db.SaveChanges();
                    }
                 
                }
                To_update.product_id= obj.product_id;
                To_update.Quantity = obj.Quantity;
                To_update.Rate = obj.Rate;
                To_update.total= obj.total;
                To_update.Extra_items = obj.Extra_items;
                _billhasProducts.Update(To_update);
            }
        }

        public override void Delete(BillhasProductClass obj)
        {
            BillClass mybill= _db.Bill.FirstOrDefault(u=>u.Id== obj.Bill_id);
            if (mybill != null)
            {
                mybill.total -= Convert.ToDouble(obj.total);
                _db.Update(mybill); 
            }
            _billhasProducts.Remove(obj);
        }

        //public override void DeleteMost(List<BillhasProductClass> list)
        //{
        //    foreach(var lili in list)
        //    {
        //        List<StockClass> myStock = _db.StockTable.Where(u=>u.billhasProduct_id==lili.Id).ToList();
        //        foreach(var stock in myStock)
        //        {
        //            stock.InStock = "Y";
        //            _db.StockTable.Update(stock);
        //        }
        //    }
        //    _db.billhasProduct.RemoveRange(list);            
        //    _db.SaveChanges();
        //}
    }
}
