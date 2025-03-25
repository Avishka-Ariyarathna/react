import mempModel from "../models/mempModel.js";
import MempModel from "../models/mempModel.js";

// Controller to add daily data
export const addDailyData = async (req, res) => {
  try {
    const {
      date,
      dispatch,
      manufactured,
      good_covers,
      good_bases,
      good_shutters,
      defect_covers,
      defect_bases,
      defect_shutters,
    } = req.body;

    if (
      !date ||
      !dispatch ||
      !manufactured ||
      !good_covers ||
      !good_bases ||
      !good_shutters ||
      !defect_covers ||
      !defect_bases ||
      !defect_shutters
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const insertId = await MempModel.addDailyData(
      date,
      dispatch,
      manufactured,
      good_covers,
      good_bases,
      good_shutters,
      defect_covers,
      defect_bases,
      defect_shutters
    );

    res.status(201).json({ message: "Data added successfully", id: insertId });
  } catch (error) {
    console.error("Error adding data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Controller to fetch all daily data or data filtered by date
export const getAllDailyData = async (req, res) => {
  try {
    const { date } = req.query;
    let data;

    if (date) {
      // If a date is provided, filter the records by date
      data = await MempModel.getDailyDataByDate(date);
    } else {
      // Fetch all daily data
      data = await MempModel.getAllDailyData();
    }

    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteDailyData = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }

    const affectedRows = await mempModel.deleteDailyData(id);
    if (affectedRows === 0) {
      return res.status(404).json({ message: "Data not found" });
    }

    res.json({ message: "Data deleted successfully" });
  } catch (error) {
    console.error("Error deleting data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
