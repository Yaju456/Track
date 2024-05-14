using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Scaffolding.Metadata;
using System.Linq;
using Track.Data;
using Track.Models;
using Track.Repository.Irepository;

namespace Track.Repository
{
    public class ChalaniRepo : MainRepo<ChalaniClass>, Ichalani
    {
        private readonly DbSet<ChalaniClass> _chalaniSet;
        public ChalaniRepo(Applicationdbcontext db) : base(db)
        {
            _chalaniSet= db.Set<ChalaniClass>();
        }

        public void Update(ChalaniClass chalani)
        {
            ChalaniClass data = _chalaniSet.FirstOrDefault(u=>u.Id == chalani.Id);  
            if (data != null) 
            {
                data.Send=chalani.Send;
                data.PhoneNumber=chalani.PhoneNumber;
                data.Remarks=chalani.Remarks;
                data.Customer_id=chalani.Customer_id;
                data.Address=chalani.Address;   
                _chalaniSet.Update(data);
            }
        }
    }
}
