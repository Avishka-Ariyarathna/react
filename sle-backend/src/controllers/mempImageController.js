import mempDailyImagesModel from "../models/mempImageModel.js";

// Function to handle adding a new daily image
const addDailyImage = async (req, res) => {
  const { date } = req.body;
  const imageUrl = `/uploads/${req.file.filename}`; // Save the relative path of the image

  if (!imageUrl || !date) {
    return res.status(400).json({ error: "Image URL and date are required" });
  }

  try {
    const imageId = await mempDailyImagesModel.addDailyImage(imageUrl, date);
    res.status(201).json({
      message: "Daily image added successfully!",
      imageId,
    });
  } catch (error) {
    console.error("Error adding daily image:", error);
    res.status(500).json({ error: "Failed to add daily image" });
  }
};

// Function to fetch all daily images
const getAllDailyImages = async (req, res) => {
  try {
    const images = await mempDailyImagesModel.getAllDailyImages();
    res.status(200).json(images);
  } catch (error) {
    console.error("Error fetching daily images:", error);
    res.status(500).json({ error: "Failed to fetch daily images" });
  }
};

// Function to fetch a specific daily image by its ID
const getDailyImageDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const image = await mempDailyImagesModel.getDailyImageById(id);
    if (!image) {
      return res.status(404).json({ error: "Daily image not found" });
    }
    res.status(200).json(image);
  } catch (error) {
    console.error("Error fetching daily image:", error);
    res.status(500).json({ error: "Failed to fetch daily image" });
  }
};
// Function to update a daily image
const updateDailyImage = async (req, res) => {
  const { id } = req.params;
  const { date } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const updatedImage = await mempDailyImagesModel.updateDailyImage(
      id,
      imageUrl,
      date
    );
    if (!updatedImage) {
      return res.status(404).json({ error: "Daily image not found" });
    }
    res.status(200).json({
      message: "Daily image updated successfully!",
      updatedImage,
    });
  } catch (error) {
    console.error("Error updating daily image:", error);
    res.status(500).json({ error: "Failed to update daily image" });
  }
};

export default {
  addDailyImage,
  getAllDailyImages,
  getDailyImageDetails,
  updateDailyImage, // Add this to the exports
};
