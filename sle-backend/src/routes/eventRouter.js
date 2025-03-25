import express from "express";
import {
  addEvent,
  getAllEvents,
  deleteEvent,
} from "../controllers/eventController.js";

const router = express.Router();

// Route to add a new event
router.post("/", addEvent);

// Route to fetch all events
router.get("/", getAllEvents);

// Route to delete an event by ID
router.delete("/:id", deleteEvent);

export default router;
