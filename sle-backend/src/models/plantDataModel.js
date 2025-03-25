import { pool } from "../config/db.js";

// Function to get daily production data for all plants
const getDailyDataForAllPlants = async () => {
  const query = `
   SELECT 
      date,
      SUM(CASE WHEN source = 'deduruoya_data' THEN units ELSE 0 END) AS deduruoya_production,
      SUM(CASE WHEN source = 'kumbalgamuwa_data' THEN units ELSE 0 END) AS kumbalgamuwa_production,
      SUM(CASE WHEN source = 'biomed_data' THEN units ELSE 0 END) AS biomed_production
    FROM (
      SELECT date, units, 'deduruoya_data' AS source FROM deduruoya_data
      UNION ALL
      SELECT date, units, 'kumbalgamuwa_data' AS source FROM kumbalgamuwa_data
      UNION ALL
      SELECT date, units, 'biomed_data' AS source FROM biomed_data
    ) AS combined_data
    GROUP BY date
    ORDER BY date DESC;
  `;
  const [rows] = await pool.execute(query);
  return rows;
};

export default { getDailyDataForAllPlants };
