import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./chatbox.scss";

const API_BASE_URL = "http://localhost:4000/api";

const CommentBox = ({ plantId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const storedUserData = sessionStorage.getItem("userData");
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);
      setUserId(parsedData.id);
      fetchUserName(parsedData.id);
    }
    fetchComments();
  }, []);

  const fetchUserName = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getusers/${id}`);
      setUserName(response.data.name || "Unknown User");
    } catch (error) {
      console.error("Error fetching user name:", error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/comments/${plantId}`);
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleSendComment = async () => {
    if (newComment.trim() && userId && userName) {
      const commentData = {
        userId,
        userName,
        text: newComment,
        plantId,
        timestamp: new Date().toISOString(),
        parentCommentId: replyingTo,
      };

      try {
        await axios.post(`${API_BASE_URL}/comments`, commentData);
        setNewComment("");
        setReplyingTo(null);
        fetchComments();
      } catch (error) {
        console.error("Error sending comment:", error);
      }
    }
  };

  const handleUpdateComment = async (commentId) => {
    if (editText.trim()) {
      try {
        await axios.put(`${API_BASE_URL}/comments/${commentId}`, {
          text: editText,
          userId,
        });
        setEditingCommentId(null);
        setEditText("");
        fetchComments();
      } catch (error) {
        console.error("Error updating comment:", error);
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await axios.delete(`${API_BASE_URL}/comments/${commentId}`, {
          data: { userId },
        });
        fetchComments();
      } catch (error) {
        console.error("Error deleting comment:", error);
      }
    }
  };

  const handleReply = (commentId) => {
    setReplyingTo(commentId);
  };

  const handleEdit = (commentId, currentText) => {
    setEditingCommentId(commentId);
    setEditText(currentText);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [comments]);

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp)
      .toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
      .replace(/,/g, "");
  };

  return (
    <div className="chatbox">
      <div className="chatbox-header">
        <h3>Messages</h3>
      </div>
      <div className="chatbox-messages">
        {[...comments].reverse().map((comment) => (
          <div
            key={comment.id}
            className={`message ${
              comment.user_id === userId ? "message-user" : "message-other"
            } ${comment.parent_comment_id ? "message-reply" : ""}`}
          >
            {comment.parent_comment_id && (
              <div className="parent-message">
                <p className="parent-sender">
                  Replying to {comment.parent_user_name || "Unknown User"}
                </p>
                <p className="parent-text">{comment.parent_text}</p>
              </div>
            )}
            <p className="message-sender">{comment.user_name}</p>
            {editingCommentId === comment.id ? (
              <div className="edit-container">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button onClick={() => handleUpdateComment(comment.id)}>
                  Save
                </button>
                <button onClick={() => setEditingCommentId(null)}>
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <p className="message-text">{comment.text}</p>
                <span className="message-timestamp">
                  {formatTimestamp(comment.timestamp)}
                </span>
                <div className="message-actions">
                  <button
                    className="reply-button"
                    onClick={() => handleReply(comment.id)}
                  >
                    Reply
                  </button>
                  {comment.user_id === userId && (
                    <>
                      <button
                        className="edit-button"
                        onClick={() => handleEdit(comment.id, comment.text)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="chatbox-input">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={
            replyingTo ? "Type your reply..." : "Type your message..."
          }
        />
        <button onClick={handleSendComment}>
          {replyingTo ? "Send Reply" : "Send"}
        </button>
        {replyingTo && (
          <button onClick={() => setReplyingTo(null)}>Cancel Reply</button>
        )}
      </div>
    </div>
  );
};

export default CommentBox;
