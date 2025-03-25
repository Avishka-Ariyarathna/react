import UserModel from "../models/getuseridModel.js";

// Controller to fetch user's name by ID
export const getUserNameById = async (req, res) => {
  const { id } = req.params; // Get user ID from URL parameter
  try {
    const user = await UserModel.getUserById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ name: user.name });
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
