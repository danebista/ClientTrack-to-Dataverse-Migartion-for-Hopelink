import sql from 'mssql/msnodesqlv8';

const sqlConfig = {
    database: "stghl",
    user: " HOPELINK\\tclark",
    server: "HL-VM-SQL-01",
    driver: "msnodesqlv8",
    requestTimeout: 3600000,
    options: {
      trustedConnection: true
    }
  };

  export async function getSqlConnection(){
    let pool = await sql.connect(sqlConfig);

    return pool;
  }