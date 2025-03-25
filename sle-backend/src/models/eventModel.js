import { pool } from "../config/db.js";

// Function to add a new event
const addEvent = async (title, description, start, end, color) => {
  const query =
    "INSERT INTO events (title, description, start, end, color) VALUES (?, ?, ?, ?, ?)";
  const [result] = await pool.execute(query, [
    title,
    description,
    start,
    end,
    color,
  ]);
  return result.insertId; // Return the ID of the inserted event
};

// Function to get all events
const getAllEvents = async () => {
  const query = "SELECT * FROM events ORDER BY start ASC";
  const [rows] = await pool.execute(query);
  return rows;
};

// Function to delete an event by ID
const deleteEvent = async (id) => {
  const query = "DELETE FROM events WHERE id = ?";
  const [result] = await pool.execute(query, [id]);
  return result.affectedRows > 0; // Return true if event is deleted
};

export default { addEvent, getAllEvents, deleteEvent };
