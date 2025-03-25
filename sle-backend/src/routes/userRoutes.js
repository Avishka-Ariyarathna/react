import express from "express";
import {
  getAllUsers,
  createUser,
  addManager,
  getUserTypeByEmail,
  deleteUser, // New import
  updateUser, // New import
} from "../controllers/userController.js";

const router = express.Router();

router.get("/get-user", getAllUsers);
router.post("/create-user", createUser);
router.put("/add-manager/:userId", addManager);
router.post("/get-user-type", getUserTypeByEmail);
router.delete("/delete-user/:userId", deleteUser); // New route
router.put("/update-user/:userId", updateUser); // New route

export default router;
