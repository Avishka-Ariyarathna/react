import express from "express";
import multer from "multer";
import path from "path";
import plantController from "../controllers/plantController.js";

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Destination directory for uploaded images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // File naming convention
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

// Route to add a plant
router.post("/", upload.single("img"), plantController.addPlant);

// Route to fetch all plants
router.get("/", plantController.getAllPlants);

// Route to fetch a specific plant by ID
router.get("/:id", plantController.getPlantDetails); // New route for plant details

// Route to assign a manager to a plant
router.post("/assign-manager", plantController.assignManagerToPlant);

export default router;
