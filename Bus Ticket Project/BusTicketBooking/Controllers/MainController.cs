using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BusTicketBooking.Contracts;
using BusTicketBooking.Models;
using Microsoft.AspNetCore.Mvc;

namespace BusTicketBooking.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MainController : Controller
    {
        private readonly IMainRepo _companyRepository;
        public MainController(IMainRepo companyRepository)
        {
            _companyRepository = companyRepository;
        }
        //Get details about bus
        [HttpGet("All")]
        public async Task<IActionResult> GetAllDetails([FromQuery] int bus_no)
        {

            try
            {
                var companies = await _companyRepository.GetAllDetails(bus_no);
                Console.WriteLine(companies);
                return Ok(companies);

            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        //Get details about all buses
        [HttpGet]
        public async Task<IActionResult> GetBuses()
        {

            try
            {
                var companies = await _companyRepository.GetBuses();
                return Ok(companies);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }


        [HttpPost("user")]
        public async Task<IActionResult> AddUser(List<UserTable> company)
        {
            try
            {
                var companies = await _companyRepository.AddUser(company);
                return Ok(companies);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        //Get all bookings
        [HttpGet("Bookings")]
        public async Task<IActionResult> GetBookings()
        {

            try
            {
                var companies = await _companyRepository.GetBookings();
                return Ok(companies);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        //Select available buses
        [HttpGet("select")]
        public async Task<IActionResult> GetSelect([FromQuery] string boarding, string drop, string date)
        {
            try
            {
                var companies = await _companyRepository.GetSelect(boarding, drop, date);
                return Ok(companies);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("update-status")]
        public async Task<IActionResult> UpdateBookingStatus()
        {
            try
            {
                await _companyRepository.UpdateBookingStatus();
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("Seat")]
        public async Task<IActionResult> InsertOrUpdateSeatPosition([FromBody] SeatPosition request)
        {

            try
            {
                await _companyRepository.InsertOrUpdateSeatPosition(request.DisabledButtons, request.Count, request.bus_no, request.datetravel);
                return Ok();

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }


        [HttpGet("seatposition")]
        public async Task<IActionResult> GetSeat([FromQuery] int bus_no, string travel_date)
        {

            try
            {
                var companies = await _companyRepository.GetSeat(bus_no, travel_date);
                return Ok(companies);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }



        [HttpGet("filter")]
        public async Task<IActionResult> GetBusfilter(int skip, int take, string? Boarding_Point, string? Drop_Point)
        {
            try
            {
                var bus = await _companyRepository.GetBusfilter(skip, take, Boarding_Point, Drop_Point);
                return Ok(bus);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("count")]
        public int GetBusCount()
        {
            var bus = _companyRepository.GetBusCount();
            return bus;
        }

        [HttpPost("Login")]
        public async Task<IActionResult> LoginCheck(string username, string password)
        {
            bool isAuthenticated = _companyRepository.CheckCredentials(username, password);

            if (isAuthenticated)
            {
                return Ok();
            }
            else
            {
                return StatusCode(500);
            }
        }

        [HttpPost("Admin")]
        public async Task<IActionResult> AdminCheck(string username, string password)
        {
            bool isAuthenticated = _companyRepository.CheckAdminCredentials(username, password);

            if (isAuthenticated)
            {
                return Ok();
            }
            else
            {
                return StatusCode(500);
            }
        }

        [HttpPost("Users")]
        public async Task<IActionResult> AddUsers(string user_name, string password)
        {
            try
            {
                int rowsAffected = await _companyRepository.AddUsers(user_name, password);
                return Ok(rowsAffected);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        [HttpGet("Booking")]
        public async Task<ActionResult<IEnumerable<dynamic>>> Bookings()
        {
            var userMainDetails = await _companyRepository.Bookings();
            return Ok(userMainDetails);
        }


        [HttpGet("Bookingcount")]
        public int GetBookingCount()
        {
            var bus = _companyRepository.GetBookingCount();
            return bus;
        }

        [HttpGet("bookingfilter")]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetBookingfilter(int skip, int take)
        {
            try
            {
                var bus = await _companyRepository.GetBookingfilter(skip, take);
                return Ok(bus);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("TicketDetails")]
        public async Task<IActionResult> AddTicketDetail(PrintTicket detail)
        {
            try
            {
                var details = await _companyRepository.AddTicketDetail(detail);
                return Ok(details);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}