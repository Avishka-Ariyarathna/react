import { pool } from "../config/db.js";

// Function to add daily data
const addDailyData = async (date, start, end, status) => {
  const query =
    "INSERT INTO aluminum_status (date, start, end, status) VALUES (?, ?, ?, ?)";
  const [result] = await pool.execute(query, [date, start, end, status]);
  return result.insertId; // Return the ID of the inserted row
};

// Function to get all daily records
const getAllDailyData = async () => {
  const query = "SELECT * FROM aluminum_status ORDER BY date DESC";
  const [rows] = await pool.execute(query);
  return rows;
};

// Function to get daily data by date
const getDailyDataByDate = async (date) => {
  const query =
    "SELECT * FROM aluminum_status WHERE date = ? ORDER BY date DESC";
  const [rows] = await pool.execute(query, [date]);
  return rows;
};

const deleteDailyData = async (id) => {
  const query = "DELETE FROM aluminum_status WHERE id = ?";
  const [result] = await pool.execute(query, [id]);
  return result.affectedRows; // Return the number of affected rows
};

export default {
  addDailyData,
  getAllDailyData,
  getDailyDataByDate,
  deleteDailyData,
};
