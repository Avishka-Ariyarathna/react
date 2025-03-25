import { pool } from "../config/db.js";

// Function to get all receivables
const getAllReceivables = async () => {
  const query =
    "SELECT plant_name, amount, date FROM receivables ORDER BY date DESC"; // Ensure plant_name is included
  const [rows] = await pool.execute(query);
  return rows;
};

// Function to update receivable by plant_name
const updateReceivable = async (plantName, amount) => {
  const query = "UPDATE receivables SET amount = ? WHERE plant_name = ?";
  const [result] = await pool.execute(query, [amount, plantName]);
  return result; // Return the result of the update operation
};

export default { getAllReceivables, updateReceivable };
