import plantModel from "../models/plantModel.js";

// Function to handle plant addition
const addPlant = async (req, res) => {
  const { name, efficiency, category } = req.body;
  const img = req.file ? req.file.filename : null;

  if (!name || !efficiency || !category || !img) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const plantId = await plantModel.addPlant(name, efficiency, category, img); // Pass category
    res.status(201).json({
      message: "Plant added successfully!",
      plantId,
    });
  } catch (error) {
    console.error("Error adding plant:", error);
    res.status(500).json({ error: "Failed to add plant" });
  }
};

// Function to fetch all plants
const getAllPlants = async (req, res) => {
  try {
    const { plants, managers } = await plantModel.getAllPlants();
    res.status(200).json({ plants, managers });
  } catch (error) {
    console.error("Error fetching plants:", error);
    res.status(500).json({ error: "Failed to fetch plants" });
  }
};

// Function to assign manager to a plant
export const assignManagerToPlant = async (req, res) => {
  const { plantId, managerId } = req.body;

  try {
    if (!plantId || !managerId) {
      return res
        .status(400)
        .json({ message: "Plant ID and Manager ID are required." });
    }

    const result = await plantModel.assignManagerToPlant(plantId, managerId);

    if (result.affectedRows > 0) {
      return res
        .status(200)
        .json({ message: "Manager assigned successfully." });
    } else {
      return res.status(404).json({ message: "Plant not found." });
    }
  } catch (error) {
    console.error("Error assigning manager:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Function to fetch a specific plant by its ID
const getPlantDetails = async (req, res) => {
  const { id } = req.params; // Get plant ID from the URL

  try {
    const plant = await plantModel.getPlantById(id); // Fetch plant by ID
    if (!plant) {
      return res.status(404).json({ error: "Plant not found" });
    }
    res.status(200).json(plant);
  } catch (error) {
    console.error("Error fetching plant details:", error);
    res.status(500).json({ error: "Failed to fetch plant details" });
  }
};

export default {
  addPlant,
  getAllPlants,
  assignManagerToPlant,
  getPlantDetails,
};
