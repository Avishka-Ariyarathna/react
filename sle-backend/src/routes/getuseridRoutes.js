import express from "express";
import { getUserNameById } from "../controllers/getuseridController.js";

const router = express.Router();

// Route to get user name by ID
router.get("/:id", getUserNameById);

export default router;
