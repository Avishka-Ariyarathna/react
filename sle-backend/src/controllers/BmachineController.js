// controllers/machineController.js
import MachineModel from "../models/BmachineModel.js";

// Controller to fetch all machines
export const getMachines = async (req, res) => {
  try {
    const machines = await MachineModel.getAllMachines();
    res.json(machines);
  } catch (error) {
    console.error("Error fetching machines:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Controller to update machine status and details
export const updateMachine = async (req, res) => {
  try {
    const { id, status, details } = req.body;
    if (!id || !status || !details) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const updatedMachine = await MachineModel.updateMachine(
      id,
      status,
      details
    );
    res.json({
      message: "Machine updated successfully",
      machine: updatedMachine,
    });
  } catch (error) {
    console.error("Error updating machine:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
