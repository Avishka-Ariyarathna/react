// db.js
import mysql2 from "mysql2/promise";

const pool = mysql2.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "slenew",
  connectionLimit: 10,
  queueLimit: 0,
  waitForConnections: true,
});

const checkConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Database Connection Successful!!");
    connection.release();
  } catch (error) {
    console.log("Error connecting to database!");
    throw error;
  }
};

export { pool, checkConnection };
