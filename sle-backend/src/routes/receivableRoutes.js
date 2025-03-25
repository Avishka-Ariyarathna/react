// routes/receivableRoutes.js

import express from "express";
import { updateReceivable, getAllReceivables } from "../controllers/receivableController.js";

const router = express.Router();

// Route to update receivable data
router.put("/", updateReceivable);

// Route to fetch all receivables data
router.get("/", getAllReceivables);

export default router;
