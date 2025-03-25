import { pool } from "../config/db.js";

export const getAllUsers = async () => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, mobile, userType, isManager FROM users"
    );
    if (rows.length === 0) {
      return { success: false, message: "No users found" };
    }
    return { success: true, users: rows };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { success: false, message: "Failed to fetch users" };
  }
};

export const addManager = async (userId) => {
  try {
    const [result] = await pool.query(
      "UPDATE users SET isManager = 1 WHERE id = ?",
      [userId]
    );
    if (result.affectedRows > 0) {
      return { success: true, message: "User added as manager" };
    } else {
      return { success: false, message: "User not found" };
    }
  } catch (error) {
    console.error("Error adding manager:", error);
    return { success: false, message: "Failed to add manager" };
  }
};

export const getUserTypeByEmail = async (email) => {
  try {
    const [rows] = await pool.query(
      "SELECT userType FROM users WHERE email = ?",
      [email]
    );
    if (rows.length > 0) {
      return { success: true, userType: rows[0].userType };
    } else {
      return { success: false, message: "User not found" };
    }
  } catch (error) {
    console.error("Error fetching userType:", error);
    return { success: false, message: "Failed to fetch userType" };
  }
};

// New delete user service
export const deleteUser = async (userId) => {
  try {
    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [
      userId,
    ]);
    if (result.affectedRows > 0) {
      return { success: true, message: "User deleted successfully" };
    } else {
      return { success: false, message: "User not found" };
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, message: "Failed to delete user" };
  }
};

// New update user service
export const updateUser = async (userId, { name, email, mobile, userType }) => {
  try {
    const [result] = await pool.query(
      "UPDATE users SET name = ?, email = ?, mobile = ?, userType = ? WHERE id = ?",
      [name, email, mobile, userType, userId]
    );
    if (result.affectedRows > 0) {
      const [updatedRows] = await pool.query(
        "SELECT id, name, email, mobile, userType, isManager FROM users WHERE id = ?",
        [userId]
      );
      return {
        success: true,
        message: "User updated successfully",
        user: updatedRows[0],
      };
    } else {
      return { success: false, message: "User not found" };
    }
  } catch (error) {
    console.error("Error updating user:", error);
    return { success: false, message: "Failed to update user" };
  }
};
