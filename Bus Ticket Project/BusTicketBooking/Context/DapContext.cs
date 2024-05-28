using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Oracle.ManagedDataAccess.Client;

namespace BusTicketBooking.Context
{
    public class DapContext
    {
        private readonly IConfiguration _configuration;
        private readonly string _connectionString;

        public DapContext(IConfiguration configuration)
        {
            _configuration = configuration;
            _connectionString = _configuration.GetConnectionString("Dap");

        }
        public IDbConnection CreateConnection() => new OracleConnection(_connectionString);

    }
}