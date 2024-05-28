using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BusTicketBooking.Models
{
    public class MainTable
    {
        public int Bus_No { get; set; }
        public string Bus_Name { get; set; }
        public string Travels_Name { get; set; }
        public string Boarding_Point { get; set; }
        public string Drop_Point { get; set; }
        public decimal Ticket_Cost { get; set; }
        public int Seat { get; set; }
    }
}