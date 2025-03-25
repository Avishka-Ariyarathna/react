import PlantDataModel from "../models/plantDataModel.js";

// Controller to fetch all daily production data
export const getAllDailyData = async (req, res) => {
  try {
    const data = await PlantDataModel.getDailyDataForAllPlants();
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};