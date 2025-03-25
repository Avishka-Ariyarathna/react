import express from "express";
import {
  getAllProjectSummaries,
  updateProjectSummaryByName,
} from "../controllers/projectSummaryController.js";

const router = express.Router();

// Route to fetch all project summaries
router.get("/", getAllProjectSummaries);

// Route to update project summary by name
router.put("/", updateProjectSummaryByName);

export default router;