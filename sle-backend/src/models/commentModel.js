import { pool } from "../config/db.js";

const addComment = async (
  userId,
  userName,
  text,
  plantId,
  timestamp,
  parentCommentId = null
) => {
  const query =
    "INSERT INTO comments (user_id, user_name, text, plant_id, timestamp, parent_comment_id) VALUES (?, ?, ?, ?, ?, ?)";
  const [result] = await pool.execute(query, [
    userId,
    userName,
    text,
    plantId,
    timestamp,
    parentCommentId,
  ]);
  return result.insertId;
};

const getCommentsByPlant = async (plantId) => {
  const query = `
    SELECT 
      c.id, 
      c.user_id, 
      c.user_name, 
      c.text, 
      c.timestamp, 
      c.parent_comment_id,
      p.user_name AS parent_user_name,
      p.text AS parent_text
    FROM comments c
    LEFT JOIN comments p ON c.parent_comment_id = p.id
    WHERE c.plant_id = ?
    ORDER BY c.timestamp DESC
  `;
  const [rows] = await pool.execute(query, [plantId]);
  return rows;
};

const getUserById = async (userId) => {
  const query = "SELECT name FROM users WHERE id = ?";
  const [rows] = await pool.execute(query, [userId]);
  return rows.length > 0 ? rows[0] : null;
};

const getCommentById = async (commentId) => {
  const query = "SELECT * FROM comments WHERE id = ?";
  const [rows] = await pool.execute(query, [commentId]);
  return rows.length > 0 ? rows[0] : null;
};

const updateComment = async (commentId, text) => {
  const query = "UPDATE comments SET text = ? WHERE id = ?";
  const [result] = await pool.execute(query, [text, commentId]);
  return result;
};

const deleteComment = async (commentId) => {
  const query = "DELETE FROM comments WHERE id = ?";
  const [result] = await pool.execute(query, [commentId]);
  return result;
};

export default {
  addComment,
  getCommentsByPlant,
  getUserById,
  getCommentById,
  updateComment,
  deleteComment,
};
