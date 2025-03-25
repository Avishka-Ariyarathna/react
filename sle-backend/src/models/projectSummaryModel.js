import { pool } from "../config/db.js";

// Function to get all project summaries
const getAllProjectSummaries = async () => {
  const query = "SELECT * FROM project_summary ";
  const [rows] = await pool.execute(query);
  return rows;
};

// Function to update project summary by name
const updateProjectSummaryByName = async (
  name,
  status,
  completionPercentage,
  lastUpdated
) => {
  const query = `
    UPDATE project_summary 
    SET status = ?, completion_percentage = ?, last_updated = ?
    WHERE name = ?
  `;
  const [result] = await pool.execute(query, [
    status,
    completionPercentage,
    lastUpdated,
    name,
  ]);
  return result;
};

export default { getAllProjectSummaries, updateProjectSummaryByName };
