import { pool } from "../config/db.js";

// Function to add a new daily image record to the database
const addDailyImage = async (imageUrl, date) => {
  const query = "INSERT INTO mempdaily_images (image_url, date) VALUES (?, ?)";
  const [result] = await pool.execute(query, [imageUrl, date]);
  return result.insertId;
};

// Function to fetch all daily images from the database
const getAllDailyImages = async () => {
  const query = "SELECT * FROM mempdaily_images";
  const [images] = await pool.execute(query);
  return images;
};

// Function to fetch a specific daily image by its ID
const getDailyImageById = async (id) => {
  const query = "SELECT * FROM mempdaily_images WHERE id = ?";
  const [image] = await pool.execute(query, [id]);
  return image[0];
};
// Function to update a daily image in the database
const updateDailyImage = async (id, imageUrl, date) => {
  let query;
  let params;

  if (imageUrl) {
    query = "UPDATE mempdaily_images SET image_url = ?, date = ? WHERE id = ?";
    params = [imageUrl, date, id];
  } else {
    query = "UPDATE mempdaily_images SET date = ? WHERE id = ?";
    params = [date, id];
  }

  const [result] = await pool.execute(query, params);
  if (result.affectedRows === 0) {
    return null; // No rows were updated
  }
  return { id, imageUrl, date };
};

export default {
  addDailyImage,
  getAllDailyImages,
  getDailyImageById,
  updateDailyImage, // Add this to the exports
};
