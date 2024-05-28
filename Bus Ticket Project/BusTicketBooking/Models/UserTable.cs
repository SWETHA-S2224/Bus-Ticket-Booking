using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace BusTicketBooking.Models
{
    public class UserTable
    {
        [Key]
        public int user_id { get; set; }
        public string user_name { get; set; }
        public int no_of_booking { get; set; }
        public string date_of_travel { get; set; }
        public string? Status { get; set; }
        public int bus_no { get; set; }
        public int age { get; set; }
        public string gender { get; set; }
    }
}