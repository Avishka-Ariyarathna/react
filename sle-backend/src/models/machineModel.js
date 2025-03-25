// models/machineModel.js
import { pool } from "../config/db.js";

// Function to get all machines
const getAllMachines = async () => {
  const query = "SELECT * FROM machines ORDER BY id ASC";
  const [rows] = await pool.execute(query);
  return rows;
};

// Function to update machine details
const updateMachine = async (id, status, details) => {
  const query = "UPDATE machines SET status = ?, details = ? WHERE id = ?";
  const [result] = await pool.execute(query, [status, details, id]);
  return result; // You can return additional details or status as needed
};

export default { getAllMachines, updateMachine };
