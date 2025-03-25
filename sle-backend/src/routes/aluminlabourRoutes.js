import express from "express";
import {
  addDailyData,
  getAllDailyData,
  deleteDailyData,
} from "../controllers/aluLabourController.js";

const router = express.Router();

// Route to add daily data
router.post("/", addDailyData);

// Route to get all daily data or filtered by date
router.get("/", getAllDailyData);
router.delete("/:id", deleteDailyData);

export default router;
