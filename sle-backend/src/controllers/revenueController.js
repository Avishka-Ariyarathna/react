import {
  getRevenueDataForPlants,
  getWeeklyRevenueData,
} from "../models/revenueModel.js";

// Controller to fetch daily revenue data
export const getRevenueData = async (req, res) => {
  try {
    const revenueData = await getRevenueDataForPlants();
    res.status(200).json(revenueData);
  } catch (error) {
    console.error("Error fetching revenue data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Controller to fetch weekly revenue data
export const getWeeklyRevenueDataController = async (req, res) => {
  try {
    const weeklyRevenueData = await getWeeklyRevenueData();
    res.status(200).json(weeklyRevenueData);
  } catch (error) {
    console.error("Error fetching weekly revenue data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
