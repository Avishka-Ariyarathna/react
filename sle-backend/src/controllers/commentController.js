import CommentModel from "../models/commentModel.js";

export const addComment = async (req, res) => {
  try {
    const { userId, text, plantId, timestamp, parentCommentId } = req.body;

    if (!userId || !text || !plantId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await CommentModel.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const insertId = await CommentModel.addComment(
      userId,
      user.name,
      text,
      plantId,
      timestamp,
      parentCommentId
    );

    res.status(201).json({
      message: "Comment added successfully",
      commentId: insertId,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getCommentsByPlant = async (req, res) => {
  try {
    const { plantId } = req.params;

    if (!plantId) {
      return res.status(400).json({ message: "Plant ID is required" });
    }

    const comments = await CommentModel.getCommentsByPlant(plantId);
    res.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await CommentModel.getUserById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ name: user.name });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text, userId } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Text is required" });
    }

    const comment = await CommentModel.getCommentById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.user_id !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to edit this comment" });
    }

    await CommentModel.updateComment(commentId, text);
    res.json({ message: "Comment updated successfully" });
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId } = req.body;

    const comment = await CommentModel.getCommentById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.user_id !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this comment" });
    }

    await CommentModel.deleteComment(commentId);
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
