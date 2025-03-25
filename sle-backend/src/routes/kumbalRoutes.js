import express from "express";
import {
  addDailyData,
  getAllDailyData,
  deleteDailyData,
} from "../controllers/kumbalController.js";

const router = express.Router();

// Route to add daily data
router.post("/", addDailyData);

// Route to fetch all daily data
router.get("/", getAllDailyData);

// Route to delete daily data by ID
router.delete("/:id", deleteDailyData);

export default router;
