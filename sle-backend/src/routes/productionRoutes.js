import express from "express";
import {
  getAllProduction,
  addProduction,
  deleteProduction,
} from "../controllers/productionController.js";

const router = express.Router();

router.get("/", getAllProduction);
router.post("/", addProduction);
router.delete("/:id", deleteProduction);

export default router;
