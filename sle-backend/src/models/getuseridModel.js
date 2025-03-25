import { pool } from "../config/db.js";

// Function to get user by ID
const getUserById = async (id) => {
  const query = "SELECT name FROM users WHERE id = ?";
  const [rows] = await pool.execute(query, [id]);
  return rows[0]; // Assuming the user's name is in the first row
};

export default { getUserById };
