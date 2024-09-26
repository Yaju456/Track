using System.Collections.Generic;
using Track.Models;

namespace Track.ViewModel
{
    public class ChalaniTobillVM
    {
        public BillClass Bill { get; set; }
        public List<decimal> Rates { get; set; }
    }
}
