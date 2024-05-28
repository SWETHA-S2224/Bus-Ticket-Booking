using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BusTicketBooking.Models;
using Microsoft.AspNetCore.Mvc;

namespace BusTicketBooking.Contracts
{
    public interface IMainRepo
    {
        public Task<IEnumerable<MainTable>> GetAllDetails(int bus_no);
        public Task<IEnumerable<MainTable>> GetBuses();
        //public Task<UserTable> AddUser(UserTable company);
        public Task<IEnumerable<UserTable>> AddUser(List<UserTable> company);
        public Task<IEnumerable<UserTable>> GetBookings();
        //public Task UpdateBookingStatus();
        //public Task UpdateCompany(int id, string date);
        public Task<IEnumerable<MainTable>> GetSelect(string boarding, string drop, string date);
        // public Task<List<MainTable>> GetSelect(string boarding,string drop,DateOnly date);
        Task UpdateBookingStatus();
        //public Task ClickDate(DateOnly click);
        //Task InsertOrUpdateSeatPosition(SeatPosition seatPosition);
        Task InsertOrUpdateSeatPosition(List<int> disabledButtons, int count, int bus_no, string date);
        //Task InsertOrUpdateSeatPosition(int[] disabledButtons, int count, int bus_no, DateOnly date);
        //public Task<UserTable> GetSeat(UserTable company);
        public Task<IEnumerable<SeatPosition>> GetSeat(int bus_no, string travel_date);
        //Task<IEnumerable<SeatPosition>> GetSeatPositionAvailable(int bus_no, DateOnly travel_date);

        public int GetBusCount();
        public Task<IEnumerable<MainTable>> GetBusfilter([FromQuery] int skip, [FromQuery] int take, [FromQuery] string? Boarding_Point, [FromQuery] string? Drop_Point);
        bool CheckCredentials(string username, string password);
        bool CheckAdminCredentials(string username, string password);
        Task<int> AddUsers(string user_name, string password);
        Task<IEnumerable<dynamic>> Bookings();
        public int GetBookingCount();
        Task<IEnumerable<dynamic>> GetBookingfilter([FromQuery] int skip, [FromQuery] int take);
        public Task<IEnumerable<PrintTicket>> AddTicketDetail(PrintTicket company);

    }
}