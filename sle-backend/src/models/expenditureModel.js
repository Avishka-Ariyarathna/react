import { pool } from "../config/db.js";

// Function to get all expenditures
const getAllExpenditures = async () => {
  const query = "SELECT * FROM expenditure ORDER BY date DESC";
  const [rows] = await pool.execute(query);
  return rows;
};

// Function to update expenditure by plant_name
const updateExpenditureByPlantName = async (plantName, amount) => {
  const query =
    "UPDATE expenditure SET amount = ? WHERE plant_name = ?";
  const [result] = await pool.execute(query, [amount, plantName]);
  return result; // Return the result of the update operation
};

export default { getAllExpenditures, updateExpenditureByPlantName };
