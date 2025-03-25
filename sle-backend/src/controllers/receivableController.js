import Receivable from "../models/receivableModel.js";

// Controller to update receivable data
const updateReceivable = async (req, res) => {
  const { plant_name, amount } = req.body;

  if (!plant_name || !amount) {
    return res
      .status(400)
      .json({ message: "Plant name and amount are required" });
  }

  try {
    const result = await Receivable.updateReceivable(plant_name, amount);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Plant not found" });
    }
    res.status(200).json({ message: "Receivable updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating receivable", error });
  }
};

// Controller to fetch all receivables data
const getAllReceivables = async (req, res) => {
  try {
    const data = await Receivable.getAllReceivables();
    res.status(200).json(data); // Ensure data includes plant_name
  } catch (error) {
    res.status(500).json({ message: "Error fetching receivables", error });
  }
};

export { updateReceivable, getAllReceivables };
