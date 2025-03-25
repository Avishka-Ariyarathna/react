import express from "express";
import { getAllDailyData } from "../controllers/plantDataController.js";

const router = express.Router();

// Route to fetch all daily production data
router.get("/", getAllDailyData);

export default router;
