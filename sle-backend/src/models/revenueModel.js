import { pool } from "../config/db.js";

// Function to fetch the latest revenue data for each plant based on the most recent date
export const getRevenueDataForPlants = async () => {
  try {
    // Fetch the latest revenue data for Deduruoya
    const [deduruoyaData] = await pool.execute(
      "SELECT revenue AS total_revenue, date FROM deduruoya_data ORDER BY date DESC LIMIT 1"
    );

    // Fetch the latest revenue data for Biomed
    const [biomedData] = await pool.execute(
      "SELECT revenue AS total_revenue, date FROM biomed_data ORDER BY date DESC LIMIT 1"
    );

    // Fetch the latest revenue data for Kumbalgamuwa
    const [kumbalgamuwaData] = await pool.execute(
      "SELECT revenue AS total_revenue, date FROM kumbalgamuwa_data ORDER BY date DESC LIMIT 1"
    );

    // Determine the latest date among all plants
    const dates = [
      deduruoyaData[0]?.date,
      biomedData[0]?.date,
      kumbalgamuwaData[0]?.date,
    ].filter(Boolean); // Filter out undefined/null dates

    const latestDate =
      dates.length > 0
        ? new Date(Math.max(...dates.map((d) => new Date(d))))
        : null;

    return {
      deduruoya: deduruoyaData[0]?.total_revenue || 0,
      biomed: biomedData[0]?.total_revenue || 0,
      kumbalgamuwa: kumbalgamuwaData[0]?.total_revenue || 0,
      date: latestDate
        ? latestDate.toISOString().split("T")[0]
        : "Unknown Date", // Return the latest date in YYYY-MM-DD format
    };
  } catch (error) {
    console.error("Error fetching latest revenue data:", error);
    throw error;
  }
};

// Function to fetch weekly revenue data (unchanged for now)
export const getWeeklyRevenueData = async () => {
  try {
    // Fetch the last 7 rows of revenue data for each plant
    const [deduruoyaData] = await pool.execute(
      "SELECT SUM(revenue) AS total_revenue FROM (SELECT  revenue FROM deduruoya_data ORDER BY date DESC LIMIT 7) AS subquery"
    );

    const [biomedData] = await pool.execute(
      "SELECT SUM(revenue) AS total_revenue FROM (SELECT revenue FROM biomed_data ORDER BY date DESC LIMIT 7) AS subquery"
    );

    const [kumbalgamuwaData] = await pool.execute(
      "SELECT SUM(revenue) AS total_revenue FROM (SELECT revenue FROM kumbalgamuwa_data ORDER BY date DESC LIMIT 7) AS subquery"
    );

    return {
      deduruoyaWeekly: deduruoyaData[0].total_revenue || 0,
      biomedWeekly: biomedData[0].total_revenue || 0,
      kumbalgamuwaWeekly: kumbalgamuwaData[0].total_revenue || 0,
      totalWeeklyRevenue:
        (deduruoyaData[0].total_revenue || 0) +
        (biomedData[0].total_revenue || 0) +
        (kumbalgamuwaData[0].total_revenue || 0),
    };
  } catch (error) {
    console.error("Error fetching weekly revenue data:", error);
    throw error;
  }
};
