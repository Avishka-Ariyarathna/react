// routes/machineRoutes.js
import express from "express";
import {
  getMachines,
  updateMachine,
} from "../controllers/mempmachineController.js";

const router = express.Router();

// Route to fetch all machines
router.get("/", getMachines);

// Route to update machine status and details
router.put("/", updateMachine);

export default router;
