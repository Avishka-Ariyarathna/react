import express from "express";
import {
  addManpowerData,
  getAllManpower,
  getLatestManpowerData,
  getManpowerDataByYear,
  deleteManpowerData, // Add this
} from "../controllers/manpowerController.js";

const router = express.Router();

router.post("/", addManpowerData);
router.get("/", getAllManpower);
router.get("/latest", getLatestManpowerData);
router.get("/year/:year", getManpowerDataByYear);
router.delete("/:id", deleteManpowerData); // Add this DELETE route

export default router;
