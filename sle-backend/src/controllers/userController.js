import {
  getAllUsers as fetchAllUsers,
  addManager as addManagerService,
  getUserTypeByEmail as fetchUserTypeByEmail,
  deleteUser as deleteUserService, // New import
  updateUser as updateUserService, // New import
} from "../services/userService.js";

export const getAllUsers = async (req, res) => {
  try {
    const result = await fetchAllUsers();
    if (result.success) {
      return res.json(result.users);
    } else {
      return res.status(404).json({ message: result.message });
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addManager = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await addManagerService(userId);
    if (result.success) {
      return res.json({ success: true, message: result.message });
    } else {
      return res.status(404).json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error("Error adding manager:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const createUser = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  const newUser = { email, password };
  users.push(newUser);
  res
    .status(201)
    .json({ message: "User registered successfully", user: newUser });
};

export const getUserTypeByEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const result = await fetchUserTypeByEmail(email);
    if (result.success) {
      return res.json({ userType: result.userType });
    } else {
      return res.status(404).json({ message: result.message });
    }
  } catch (error) {
    console.error("Error fetching userType:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// New delete user controller
export const deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await deleteUserService(userId);
    if (result.success) {
      return res.json({ success: true, message: result.message });
    } else {
      return res.status(404).json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// New update user controller
export const updateUser = async (req, res) => {
  const { userId } = req.params;
  const { name, email, mobile, userType } = req.body;
  try {
    const result = await updateUserService(userId, {
      name,
      email,
      mobile,
      userType,
    });
    if (result.success) {
      return res.json({
        success: true,
        message: result.message,
        user: result.user,
      });
    } else {
      return res.status(404).json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
