// IMPORTING THE SQL MODULE
import sql from "mssql";
import { config as dotenvConfig } from "dotenv";
dotenvConfig();

//CREATING THE CONFIG VARIABLES
const db_user = process.env.DB_USER;
const db_password = process.env.DB_PASSWORD;
const db_server = process.env.DB_HOST;
const db_name = process.env.DB_NAME;

//CREATING THE CONFIG OBJECT
const config = {
  user: db_user,
  password: db_password,
  server: db_server,
  database: db_name,
  options: {
    enableArithAbort: true,
    trustServerCertificate: true,
  },
};

// ASYNC FUNCTION TO CONNECT TO THE DATABASE
async function connectToDatabase() {
  try {
    const connectionPool = new sql.ConnectionPool(config);
    await connectionPool.connect();
    return connectionPool;
  } catch (error) {
    console.error("Error connecting to the database:");
    throw error;
  }
}

// ASYNC FUNCTION TO EXECUTE THE QUERY
async function executeQuery(query, values) {
  let connectionPool;
  try {
    connectionPool = await connectToDatabase();
    const request = connectionPool.request();
    for (const key in values) {
      if (Object.hasOwnProperty.call(values, key)) {
        request.input(key, values[key]);
      }
    }
    const result = await request.query(query);
    return result.recordset;
  } catch (error) {
    console.error("Error executing query:", error);
  } finally {
    if (connectionPool) {
      try {
        await connectionPool.close();
      } catch (error) {
        console.error("Error closing connection pool:");
        throw error;
      }
    }
  }
}

export default executeQuery;
