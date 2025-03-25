import { pool } from "../config/db.js";

// Function to add daily data for Deduru Oya
const addDailyData = async (date, units) => {
  const tarif = 9.27; // Fixed tariff amount
  const revenue = units * tarif; // Calculate revenue
  const plantFactor = ((units / (1300 * 24)) * 100).toFixed(2);

  const query =
    "INSERT INTO kumbalgamuwa_data (date, units, tarif, revenue, plant_factor) VALUES (?, ?, ?, ?, ?)";
  const [result] = await pool.execute(query, [
    date,
    units,
    tarif,
    revenue,
    plantFactor,
  ]);
  return result.insertId; // Return the ID of the inserted row
};

// Function to get all daily records
const getAllDailyData = async () => {
  const query = "SELECT * FROM kumbalgamuwa_data ORDER BY date DESC";
  const [rows] = await pool.execute(query);
  return rows;
};

// Function to get daily data by date
const getDailyDataByDate = async (date) => {
  const query =
    "SELECT * FROM kumbalgamuwa_data WHERE date = ? ORDER BY date DESC";
  const [rows] = await pool.execute(query, [date]);
  return rows;
};

// Function to delete daily data
const deleteDailyData = async (id) => {
  const query = "DELETE FROM kumbalgamuwa_data WHERE id = ?";
  const [result] = await pool.execute(query, [id]);
  return result.affectedRows; // Return the number of affected rows
};

export default {
  addDailyData,
  getAllDailyData,
  getDailyDataByDate,
  deleteDailyData,
};
