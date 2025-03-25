import ManpowerModel from "../models/manpowerModel.js";

// Controller to add manpower financial data
export const addManpowerData = async (req, res) => {
  try {
    const { year, month, workers, income, profit, salary } = req.body;
    if (!year || !month || !workers || !income || !profit || !salary) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const insertId = await ManpowerModel.addManpowerData(
      year,
      month,
      workers,
      income,
      profit,
      salary
    );
    res.status(201).json({ message: "Data added successfully", id: insertId });
  } catch (error) {
    console.error("Error adding manpower data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Controller to fetch all manpower data
export const getAllManpower = async (req, res) => {
  try {
    const data = await ManpowerModel.getAllManpower();
    res.json(data);
  } catch (error) {
    console.error("Error fetching manpower:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Controller to fetch the latest manpower data
export const getLatestManpowerData = async (req, res) => {
  try {
    const data = await ManpowerModel.getLatestManpowerData();
    res.json(data);
  } catch (error) {
    console.error("Error fetching latest manpower data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Controller to fetch manpower data by year
export const getManpowerDataByYear = async (req, res) => {
  try {
    const { year } = req.params;
    const data = await ManpowerModel.getManpowerDataByYear(year);
    res.json(data);
  } catch (error) {
    console.error("Error fetching manpower data by year:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteManpowerData = async (req, res) => {
  try {
    const { id } = req.params;
    await ManpowerModel.deleteManpowerData(id);
    res.json({ message: "Data deleted successfully" });
  } catch (error) {
    console.error("Error deleting manpower data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
