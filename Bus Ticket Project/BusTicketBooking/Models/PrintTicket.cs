using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BusTicketBooking.Models
{
    public class PrintTicket
    {
        public string user_name { get; set; }
        public string pickup { get; set; }
        public string destination { get; set; }
        public DateOnly datetravel { get; set; }
        public  List<int> seat { get; set; }
        public int cost { get; set; }
        public string? status { get; set; }
    }
}