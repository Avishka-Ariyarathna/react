import express from "express";
import {
  addComment,
  getCommentsByPlant,
  getUserById,
  updateComment,
  deleteComment,
} from "../controllers/commentController.js";

const router = express.Router();

router.post("/", addComment);
router.get("/:plantId", getCommentsByPlant);
router.get("/user/:id", getUserById);
router.put("/:commentId", updateComment);
router.delete("/:commentId", deleteComment);

export default router;
