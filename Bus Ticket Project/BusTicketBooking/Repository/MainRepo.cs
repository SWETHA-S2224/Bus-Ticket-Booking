using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusTicketBooking.Context;
using BusTicketBooking.Contracts;
using BusTicketBooking.Models;
using Dapper;
using Microsoft.AspNetCore.Http.HttpResults;
using Newtonsoft.Json;
using Oracle.ManagedDataAccess.Client;


namespace BusTicketBooking.Repository
{
    public class MainRepo : IMainRepo
    {
        public string connection_string = "Data Source=//10.1.193.185:1521/ORCLDM;User ID=ICORALV2QC_MAR2022;Password=ICORALV2QC_MAR2022";

        //Get details about bus
        public async Task<IEnumerable<MainTable>> GetAllDetails(int id)
        {
            var query = "SELECT tn.Travels_Name, t.bus_no, t.bus_name, t.boarding_point, t.drop_point, t.Ticket_cost, t.Seat FROM Travels t INNER JOIN Travels_name tn ON t.Travels_id = tn.Travels_id WHERE t.bus_no =:id";
            using (var connection = new OracleConnection(connection_string))
            {
                var companies = await connection.QueryAsync<MainTable>(query, new { id });
                return companies.ToList();
            }
        }

        //Get details about all buses
        public async Task<IEnumerable<MainTable>> GetBuses()
        {
            var query = "SELECT tn.Travels_Name, t.bus_no, t.bus_name, t.boarding_point, t.drop_point, t.Ticket_cost, t.Seat FROM Travels t INNER JOIN Travels_name tn ON t.Travels_id = tn.Travels_id";
            using (var connection = new OracleConnection(connection_string))
            {
                var companies = await connection.QueryAsync<MainTable>(query);
                return companies.ToList();
            }
        }

        public async Task<IEnumerable<UserTable>> AddUser(List<UserTable> details)
        {
            using (var connection = new OracleConnection(connection_string))
            {
                try
                {
                    var procedureName = "ICORALV2QC_MAR2022.Travel.InsertUserDetail";
                    var addedUsers = new List<UserTable>();

                    foreach (var user in details)
                    {
                        var parameters = new DynamicParameters();
                        parameters.Add("UserName", user.user_name, DbType.String, ParameterDirection.Input);
                        parameters.Add("NoOfBooking", user.no_of_booking, DbType.Int32, ParameterDirection.Input);
                        parameters.Add("DateOfTravel", user.date_of_travel, DbType.String, ParameterDirection.Input);
                        parameters.Add("BusNo", user.bus_no, DbType.Int32, ParameterDirection.Input);
                        parameters.Add("Age", user.age, DbType.Int32, ParameterDirection.Input);
                        parameters.Add("Gender", user.gender, DbType.String, ParameterDirection.Input);
                        var result = await connection.ExecuteAsync(procedureName, parameters, commandType: CommandType.StoredProcedure);
                        Console.WriteLine($"User added successfully: {user.user_name}");
                        addedUsers.Add(user);
                    }

                    return addedUsers;
                }
                catch (OracleException ex)
                {
                    Console.WriteLine($"Oracle Exception: {ex.Message}");
                    throw;
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Exception: {ex.Message}");
                    throw;
                }
            }

        }

        //Get all bookings
        public async Task<IEnumerable<UserTable>> GetBookings()
        {
            var query = "select * from userdetail";
            using (var connection = new OracleConnection(connection_string))
            {
                connection.Open();
                var companies = await connection.QueryAsync<UserTable>(query);
                return companies.ToList();
            }
        }

        public async Task UpdateBookingStatus()
        {
            using (var connection = new OracleConnection(connection_string))
            {
                await connection.ExecuteAsync("UpdatePackage.UpdateBookingStatus", commandType: CommandType.StoredProcedure);
            }
        }

        public async Task InsertOrUpdateSeatPosition(List<int> disabledButtons, int count, int bus_no, string date)
        {
            using (var connection = new OracleConnection(connection_string))
            {
                var parameters = new DynamicParameters();

                for (int i = 1; i <= 20; i++)
                {
                    int seatValue = disabledButtons.Contains(i) ? 1 : 0;
                    parameters.Add($"p_Seat{i}", seatValue, DbType.Int32);
                }

                parameters.Add("p_Count", count, DbType.Int32);
                parameters.Add("p_busno", bus_no, DbType.Int32);
                // parameters.Add("p_travel", date.ToString("yyyy-MM-dd"), DbType.String);
                parameters.Add("p_travel", date, DbType.String);

                var procedureName = "ICORALV2QC_MAR2022.InsertPackage.SeatPosition33";
                await connection.ExecuteAsync(procedureName, parameters, commandType: CommandType.StoredProcedure);
            }
        }


        //Available buses
        public async Task<IEnumerable<MainTable>> GetSelect(string boarding, string drop, string date)
        {
            IEnumerable<MainTable> busDetails;

            using (var connection = new OracleConnection(connection_string))
            {
                var enableDBMSOutputQuery = "BEGIN DBMS_OUTPUT.ENABLE(NULL); END;";
                await connection.ExecuteAsync(enableDBMSOutputQuery);
                var parameters = new DynamicParameters();
                parameters.Add("BoardingPoint", boarding, DbType.String, ParameterDirection.Input);
                parameters.Add("DropPoint", drop, DbType.String, ParameterDirection.Input);
                parameters.Add("TravelDate", date, DbType.String, ParameterDirection.Input);

                var procedureName = "TravelPackage.GetAvailableBus";
                await connection.ExecuteAsync(procedureName, parameters, commandType: CommandType.StoredProcedure);

                var sqlQuery = @"
SELECT DISTINCT
    T.bus_no, 
    T.bus_name, 
    T.boarding_point, 
    T.drop_point, 
    T.ticket_cost, 
    CASE 
        WHEN U.date_of_travel = TO_DATE(:TravelDate, 'YYYY-MM-DD') THEN 
            CASE 
                WHEN U.status = 'Pending' THEN T.seat - NVL(Bookings.total_booking, 0)
                ELSE T.seat
            END
        ELSE 10
    END AS seat,
    tn.travels_name
FROM 
    travels T
INNER JOIN 
    travels_name tn ON T.travels_id = tn.travels_id
LEFT JOIN (
    SELECT 
        bus_no, 
        SUM(no_of_booking) AS total_booking
    FROM 
        userdetail
    WHERE 
        date_of_travel = TO_DATE(:TravelDate, 'YYYY-MM-DD')
    GROUP BY 
        bus_no
) Bookings ON T.bus_no = Bookings.bus_no
LEFT JOIN userdetail U ON T.bus_no = U.bus_no AND U.date_of_travel = TO_DATE(:TravelDate, 'YYYY-MM-DD')
WHERE 
    T.boarding_point = :BoardingPoint
    AND 
    T.drop_point = :DropPoint
    AND 
    (T.seat - NVL(Bookings.total_booking, 0)) > 0";


                busDetails = await connection.QueryAsync<MainTable>(sqlQuery, parameters);
            }

            return busDetails;

        }

        public async Task<IEnumerable<SeatPosition>> GetSeat(int bus_no, string travel_date)
        {
            var query = "SELECT seat1, seat2, seat3, seat4, seat5, seat6, seat7, seat8, seat9, seat10, seat11, seat12, seat13, seat14, seat15, seat16, seat17, seat18, seat19, seat20, count, bus_no, datetravel FROM seatposition WHERE bus_no = :bus_no AND datetravel = TO_DATE(:travel_date, 'YYYY-MM-DD')";

            var seatPositions = new List<SeatPosition>();

            using (var connection = new OracleConnection(connection_string))
            {
                var command = new OracleCommand(query, connection);
                command.Parameters.Add("bus_no", OracleDbType.Int32).Value = bus_no;
                // command.Parameters.Add("travel_date", OracleDbType.Varchar2).Value = travel_date.ToString("yyyy-MM-dd");
                command.Parameters.Add("travel_date", OracleDbType.Varchar2).Value = travel_date;


                try
                {
                    await connection.OpenAsync();

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var disabledButtons = new List<int>();

                            for (int i = 1; i <= 20; i++)
                            {
                                var seatValue = reader.GetInt32(reader.GetOrdinal($"seat{i}"));
                                if (seatValue == 1)
                                {
                                    disabledButtons.Add(i);
                                }
                            }

                            var seatPosition = new SeatPosition
                            {
                                DisabledButtons = disabledButtons,
                                Count = reader.GetInt32(reader.GetOrdinal("count")),
                                bus_no = reader.GetInt32(reader.GetOrdinal("bus_no")),
                                datetravel = travel_date
                            };

                            seatPositions.Add(seatPosition);
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error retrieving seat positions: {ex.Message}");
                }
            }

            return seatPositions;
        }



        public async Task<IEnumerable<MainTable>> GetBusfilter(int skip, int take, string? Boarding_Point, string? Drop_Point)
        {
            var query = new StringBuilder();
            query.Append("SELECT tn.Travels_Name, t.bus_no, t.bus_name, t.boarding_point, t.drop_point, t.Ticket_cost, t.Seat FROM Travels t INNER JOIN Travels_name tn ON t.Travels_id = tn.Travels_id");

            bool hasWhereClause = false;

            if (!string.IsNullOrEmpty(Boarding_Point))
            {
                query.Append(hasWhereClause ? " AND " : " WHERE ");
                query.Append("boarding_point LIKE '%' || :Boarding_Point || '%' ");
                hasWhereClause = true;
            }

            if (!string.IsNullOrEmpty(Drop_Point))
            {
                query.Append(hasWhereClause ? " AND " : " WHERE ");
                query.Append("drop_point LIKE '%' || :Drop_Point || '%' ");
                hasWhereClause = true;
            }

            query.Append(" OFFSET :Skip ROWS FETCH NEXT :Take ROWS ONLY");

            using (IDbConnection connection = new OracleConnection(connection_string))
            {
                connection.Open();
                var result = await connection.QueryAsync<MainTable>(query.ToString(), new { Skip = skip, Take = take, boarding_point = Boarding_Point, drop_point = Drop_Point });
                return result;
            }
        }

        public int GetBusCount()
        {
            var countQuery = "SELECT COUNT(*) FROM Travels";

            using (IDbConnection connection = new OracleConnection(connection_string))
            {
                connection.Open();
                var count = connection.QuerySingle<int>(countQuery);
                return count;
            }
        }

        //Login
        public bool CheckCredentials(string username, string password)
        {
            using (var con = new OracleConnection(connection_string))
            {
                using (var cmd = new OracleCommand("SELECT COUNT(*) FROM Users WHERE user_name = :username AND Password = :password", con))
                {
                    cmd.Parameters.Add(":username", OracleDbType.Varchar2).Value = username;
                    cmd.Parameters.Add(":password", OracleDbType.Varchar2).Value = password;
                    con.Open();
                    int count = Convert.ToInt32(cmd.ExecuteScalar());
                    return count == 1;
                }
            }
        }

        public bool CheckAdminCredentials(string username, string password)
        {
            using (var con = new OracleConnection(connection_string))
            {
                using (var cmd = new OracleCommand("SELECT COUNT(*) FROM Admin WHERE user_name = :username AND password = :password", con))
                {
                    cmd.Parameters.Add(":username", OracleDbType.Varchar2).Value = username;
                    cmd.Parameters.Add(":password", OracleDbType.Varchar2).Value = password;
                    con.Open();
                    int count = Convert.ToInt32(cmd.ExecuteScalar());
                    return count == 1;
                }
            }
        }

        public async Task<int> AddUsers(string user_name, string password)
        {
            using (var connection = new OracleConnection(connection_string))
            {
                var query = "insert into users (user_name, password) values (:user_name, :password)";
                return await connection.ExecuteAsync(query, new { user_name, password });
            }
        }

        public async Task<IEnumerable<dynamic>> Bookings()
        {
            using (var connection = new OracleConnection(connection_string))
            {
                var query = @"
    SELECT 
        UD.user_id, 
        UD.user_name, 
        UD.no_of_booking,
        UD.age,
        UD.gender, 
        UD.Date_of_Travel, 
        UD.Status, 
        UD.bus_no,
        T.bus_name, 
        T.boarding_point, 
        T.drop_point, 
        T.Ticket_cost,
        TN.Travels_Name
    FROM 
        UserDetail UD
    JOIN 
        Travels T ON UD.bus_no = T.bus_no
    JOIN 
        Travels_name TN ON T.Travels_id = TN.Travels_id
";

                var userMainDetails = await connection.QueryAsync<dynamic>(query);

                return userMainDetails;
            }
        }

        public int GetBookingCount()
        {
            var countQuery = "SELECT COUNT(*) FROM UserDetail";

            using (IDbConnection connection = new OracleConnection(connection_string))
            {
                connection.Open();
                var count = connection.QuerySingle<int>(countQuery);
                return count;
            }
        }

        public async Task<IEnumerable<dynamic>> GetBookingfilter(int skip, int take)
        {
            var query = new StringBuilder();
            query.Append(" SELECT UD.user_id, UD.user_name, UD.no_of_booking, UD.age, UD.gender, UD.Date_of_Travel, UD.Status, UD.bus_no, T.bus_name, T.boarding_point, T.drop_point, T.Ticket_cost, TN.Travels_Name FROM UserDetail UD JOIN Travels T ON UD.bus_no = T.bus_no JOIN Travels_name TN ON T.Travels_id = TN.Travels_id");
            query.Append(" OFFSET :Skip ROWS FETCH NEXT :Take ROWS ONLY");

            using (IDbConnection connection = new OracleConnection(connection_string))
            {
                connection.Open();
                var result = await connection.QueryAsync<dynamic>(query.ToString(), new { Skip = skip, Take = take });
                return result;
            }
        }

        public async Task<IEnumerable<PrintTicket>> AddTicketDetail(PrintTicket details)
        {
            using (var connection = new OracleConnection(connection_string))
            {
                var procedureName = "ICORALV2QC_MAR2022.Ticket.InsertTicketDetail";
                var addedUsers = new PrintTicket();
                var parameters = new DynamicParameters();
                parameters.Add("User_Name", details.user_name, DbType.String, ParameterDirection.Input);
                parameters.Add("PICKUP", details.pickup, DbType.String, ParameterDirection.Input);
                parameters.Add("DESTINATION", details.destination, DbType.String, ParameterDirection.Input);
                parameters.Add("DATETRAVEL", details.datetravel, DbType.Date, ParameterDirection.Input);
                var seatString = string.Join(",", details.seat);
                parameters.Add("SEAT", seatString,DbType.String, ParameterDirection.Input);
                parameters.Add("COST", details.cost, DbType.Int32, ParameterDirection.Input);
                var result = await connection.ExecuteAsync(procedureName, parameters, commandType: CommandType.StoredProcedure);
            }
            return null;

        }





    }
}