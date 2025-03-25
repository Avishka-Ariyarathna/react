import express from "express";
import multer from "multer";
import path from "path";
import solorControllerImage from "../controllers/solorImageController.js";

// Set up multer for file uploads (if needed)
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

// Route to add a new daily image
router.post("/", upload.single("image"), solorControllerImage.addDailyImage);

// Route to fetch all daily images
router.get("/", solorControllerImage.getAllDailyImages);

// Route to fetch a specific daily image by ID
router.get("/:id", solorControllerImage.getDailyImageDetails);

router.put(
  "/:id",
  upload.single("image"),
  solorControllerImage.updateDailyImage
);

export default router;
