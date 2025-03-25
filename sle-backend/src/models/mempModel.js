import { pool } from "../config/db.js";

// Function to add daily data
const addDailyData = async (
  date,
  dispatch,
  manufactured,
  good_covers,
  good_bases,
  good_shutters,
  defect_covers,
  defect_bases,
  defect_shutters
) => {
  const query =
    "INSERT INTO memp_data (date, dispatch, manufactured, good_covers, good_bases, good_shutters, defect_covers, defect_bases, defect_shutters) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const [result] = await pool.execute(query, [
    date,
    dispatch,
    manufactured,
    good_covers,
    good_bases,
    good_shutters,
    defect_covers,
    defect_bases,
    defect_shutters,
  ]);
  return result.insertId; // Return the ID of the inserted row
};

// Function to get all daily records
const getAllDailyData = async () => {
  const query = "SELECT * FROM memp_data ORDER BY date DESC";
  const [rows] = await pool.execute(query);
  return rows;
};

// Function to get daily data by date
const getDailyDataByDate = async (date) => {
  const query = "SELECT * FROM memp_data WHERE date = ? ORDER BY date DESC";
  const [rows] = await pool.execute(query, [date]);
  return rows;
};

const deleteDailyData = async (id) => {
  const query = "DELETE FROM memp_data WHERE id = ?";
  const [result] = await pool.execute(query, [id]);
  return result.affectedRows; // Return the number of affected rows
};

export default {
  addDailyData,
  getAllDailyData,
  getDailyDataByDate,
  deleteDailyData,
};
