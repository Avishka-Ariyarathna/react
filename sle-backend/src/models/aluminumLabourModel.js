import { pool } from "../config/db.js";

// Function to add daily data
const addDailyData = async (date, SkilledLabour, SemiSkilledLabour) => {
  const query =
    "INSERT INTO aluminum_labour_data (date, SkilledLabour, SemiSkilledLabour) VALUES (?, ?, ?)";
  const [result] = await pool.execute(query, [
    date,
    SkilledLabour,
    SemiSkilledLabour,
  ]);
  return result.insertId; // Return the ID of the inserted row
};

// Function to get all daily records
const getAllDailyData = async () => {
  const query = "SELECT * FROM aluminum_labour_data ORDER BY date DESC";
  const [rows] = await pool.execute(query);
  return rows;
};

// Function to get daily data by date
const getDailyDataByDate = async (date) => {
  const query =
    "SELECT * FROM aluminum_labour_data WHERE date = ? ORDER BY date DESC";
  const [rows] = await pool.execute(query, [date]);
  return rows;
};

const deleteDailyData = async (id) => {
  const query = "DELETE FROM aluminum_labour_data WHERE id = ?";
  const [result] = await pool.execute(query, [id]);
  return result.affectedRows; // Return the number of affected rows
};

export default {
  addDailyData,
  getAllDailyData,
  getDailyDataByDate,
  deleteDailyData,
};
