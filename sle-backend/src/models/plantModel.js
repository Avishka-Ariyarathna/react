import { pool } from "../config/db.js";

// Function to add a plant to the database
const addPlant = async (name, efficiency, category, img) => {
  const query =
    "INSERT INTO plants (name, efficiency, category, img) VALUES (?, ?, ?, ?)";
  const [result] = await pool.execute(query, [name, efficiency, category, img]);
  return result.insertId;
};

// Function to fetch all plants from the database
const getAllPlants = async () => {
  const queryPlants = `
    SELECT plants.id, plants.name, plants.efficiency, plants.category, plants.img, plants.manager_id, users.name AS manager_name
    FROM plants
    LEFT JOIN users ON plants.manager_id = users.id
  `;
  const [plants] = await pool.execute(queryPlants);

  const queryManagers = "SELECT id, name FROM users WHERE isManager = '1'"; // Fetch only managers (admins)
  const [managers] = await pool.execute(queryManagers);

  return { plants, managers };
};

// Function to assign a manager to a plant
const assignManagerToPlant = async (plantId, managerId) => {
  const query = "UPDATE plants SET manager_id = ? WHERE id = ?";
  const [results] = await pool.execute(query, [managerId, plantId]);
  return results;
};

// Function to fetch a specific plant by its ID
const getPlantById = async (id) => {
  const query = `
    SELECT plants.id, plants.name, plants.efficiency, plants.category, plants.img, users.name AS manager_name
    FROM plants
    LEFT JOIN users ON plants.manager_id = users.id
    WHERE plants.id = ?;
  `;
  const [plant] = await pool.execute(query, [id]);
  return plant[0]; // Return the first (and only) plant object
};

export default { addPlant, getAllPlants, assignManagerToPlant, getPlantById };
