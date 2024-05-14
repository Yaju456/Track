using Microsoft.EntityFrameworkCore;
using System.Linq;
using Track.Data;
using Track.Models;
using Track.Repository.Irepository;

namespace Track.Repository
{
    public class billhasProductRepo : MainRepo<BillhasProductClass>, IbillhasProduct
    {
        private readonly DbSet<BillhasProductClass> _billhasProducts;
        public billhasProductRepo(Applicationdbcontext db) : base(db)
        {
            _billhasProducts = db.Set<BillhasProductClass>();
        }

        public void Update(BillhasProductClass obj)
        {
            BillhasProductClass To_update= _billhasProducts.FirstOrDefault(u=>u.Id==obj.Id);
            if (To_update!=null) 
            {
                To_update.Bill_id = obj.Bill_id;
                To_update.product_id= obj.product_id;
                To_update.Quantity = obj.Quantity;
                To_update.Rate = obj.Rate;
                To_update.total= obj.total;
                _billhasProducts.Update(To_update);
            }
        }
    }
}
