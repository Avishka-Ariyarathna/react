import express from "express";
import {
  getAllExpenditures,
  updateExpenditureByPlantName, // Update based on plant name
} from "../controllers/expenditureController.js";

const router = express.Router();

// Route to fetch all expenditures
router.get("/", getAllExpenditures);

// Route to update expenditure by plant name
router.put("/", updateExpenditureByPlantName); // Use PUT to update

export default router;
