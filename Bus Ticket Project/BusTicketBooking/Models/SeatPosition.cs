using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BusTicketBooking.Models
{
    public class SeatPosition
    {
        public List<int> DisabledButtons { get; set; }
        public int Count { get; set; }
        public int bus_no { get; set; }
        public string datetravel { get; set; }
    }
}