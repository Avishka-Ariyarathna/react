import EventModel from "../models/eventModel.js";

// Controller to add an event
export const addEvent = async (req, res) => {
  try {
    const { title, description, start, end, color } = req.body;
    if (!title || !start || !end || !color) {
      return res.status(400).json({
        message: "Title, start, end, and color are required",
      });
    }

    const insertId = await EventModel.addEvent(
      title,
      description,
      start,
      end,
      color
    );
    res.status(201).json({ message: "Event added successfully", id: insertId });
  } catch (error) {
    console.error("Error adding event:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Controller to fetch all events
export const getAllEvents = async (req, res) => {
  try {
    const events = await EventModel.getAllEvents();
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Controller to delete an event by ID
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const isDeleted = await EventModel.deleteEvent(id);
    if (isDeleted) {
      res.status(200).json({ message: "Event deleted successfully" });
    } else {
      res.status(404).json({ message: "Event not found" });
    }
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
