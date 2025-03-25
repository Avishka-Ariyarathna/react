import { pool } from "../config/db.js";

// Function to add new manpower financial data
const addManpowerData = async (
  year,
  month,
  workers,
  income,
  profit,
  salary
) => {
  const query =
    "INSERT INTO manpower_data (year, month, workers, income, profit, salary) VALUES (?, ?, ?, ?, ?, ?)";
  const [result] = await pool.execute(query, [
    year,
    month,
    workers,
    income,
    profit,
    salary,
  ]);
  return result.insertId;
};

// Function to fetch all manpower data
const getAllManpower = async () => {
  const query = "SELECT * FROM manpower_data ORDER BY year DESC, month DESC";
  const [rows] = await pool.execute(query);
  return rows;
};

// Function to fetch the latest data row
const getLatestManpowerData = async () => {
  const query = "SELECT * FROM manpower_data ORDER BY id DESC, id DESC LIMIT 1";
  const [rows] = await pool.execute(query);
  return rows[0]; // Return the first row (latest entry)
};

// Function to fetch data for a specific year
// Function to fetch data for a specific year
const getManpowerDataByYear = async (year) => {
  const query = `
    SELECT * 
    FROM manpower_data 
    WHERE year = ? 
    ORDER BY 
      CASE 
        WHEN month = 'Jan' THEN 1
        WHEN month = 'Feb' THEN 2
        WHEN month = 'Mar' THEN 3
        WHEN month = 'Apr' THEN 4
        WHEN month = 'May' THEN 5
        WHEN month = 'Jun' THEN 6
        WHEN month = 'Jul' THEN 7
        WHEN month = 'Aug' THEN 8
        WHEN month = 'Sep' THEN 9
        WHEN month = 'Oct' THEN 10
        WHEN month = 'Nov' THEN 11
        WHEN month = 'Dec' THEN 12
      END ASC
  `;
  const [rows] = await pool.execute(query, [year]);
  return rows;
};

const deleteManpowerData = async (id) => {
  const query = "DELETE FROM manpower_data WHERE id = ?";
  const [result] = await pool.execute(query, [id]);
  return result.affectedRows;
};

export default {
  addManpowerData,
  getAllManpower,
  getLatestManpowerData,
  getManpowerDataByYear,
  deleteManpowerData,
};
