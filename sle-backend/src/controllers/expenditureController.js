import ExpenditureModel from "../models/expenditureModel.js";

// Controller to get all expenditures
export const getAllExpenditures = async (req, res) => {
  try {
    const data = await ExpenditureModel.getAllExpenditures();
    res.json(data);
  } catch (error) {
    console.error("Error fetching expenditures:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Controller to update expenditure by plant name
export const updateExpenditureByPlantName = async (req, res) => {
  try {
    const { plant_name, amount } = req.body;

    if (!plant_name || !amount) {
      return res.status(400).json({
        message: "Plant name and amount are required",
      });
    }

    // Update the expenditure in the database
    const result = await ExpenditureModel.updateExpenditureByPlantName(
      plant_name,
      amount
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Plant not found" });
    }

    res.status(200).json({ message: "Expenditure updated successfully" });
  } catch (error) {
    console.error("Error updating expenditure:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
