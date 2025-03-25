import express from "express";
import {
  getRevenueData,
  getWeeklyRevenueDataController,
} from "../controllers/revenueController.js";

const router = express.Router();

// Route to fetch daily revenue data
router.get("/", getRevenueData);

// Route to fetch weekly revenue data
router.get("/weekly", getWeeklyRevenueDataController);

export default router;
