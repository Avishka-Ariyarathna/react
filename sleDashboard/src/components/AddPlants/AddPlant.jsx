import { useState } from "react";
import axios from "axios";
import "./addplant.scss";

// Replace this with your actual server URL

const API_BASE_URL = "http://139.59.251.39:4000/api";

const AddPlants = () => {
  const [plantDetails, setPlantDetails] = useState({
    name: "",
    efficiency: 0,
    category: "",
    img: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlantDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setPlantDetails((prevDetails) => ({
      ...prevDetails,
      img: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !plantDetails.name ||
      plantDetails.efficiency <= 0 ||
      !plantDetails.category ||
      !plantDetails.img
    ) {
      alert("Please fill all fields correctly.");
      return;
    }

    const formData = new FormData();
    formData.append("name", plantDetails.name);
    formData.append("efficiency", plantDetails.efficiency);
    formData.append("category", plantDetails.category);
    formData.append("img", plantDetails.img);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/plants`, // Updated API endpoint
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Plant added:", response.data);
      alert("Plant added successfully!");
    } catch (error) {
      console.error(
        "Error adding plant:",
        error.response?.data || error.message
      );
      alert("Error adding plant. Please try again.");
    }
  };

  return (
    <div className="add-plant-wrapper">
      <h1 className="add-plant-title">Add New Plant</h1>
      <form className="add-plant-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Plant Name:</label>
          <input
            type="text"
            name="name"
            value={plantDetails.name}
            onChange={handleInputChange}
            required
            placeholder="Enter plant name"
          />
        </div>

        <div className="form-group">
          <label>Efficiency:</label>
          <input
            type="number"
            name="efficiency"
            value={plantDetails.efficiency}
            onChange={handleInputChange}
            required
            placeholder="Enter efficiency"
          />
        </div>

        <div className="form-group">
          <label>Category:</label>
          <select
            name="category"
            value={plantDetails.category}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Category</option>
            <option value="PowerStation">PowerStation</option>
            <option value="Production Plant">Production Plant</option>
            <option value="Mini Hydro Plants">Mini Hydro Plants</option>
          </select>
        </div>

        <div className="form-group">
          <label>Image:</label>
          <input type="file" onChange={handleFileChange} required />
        </div>

        <button
          className="add-plant-button"
          type="submit"
          disabled={
            !plantDetails.name ||
            plantDetails.efficiency <= 0 ||
            !plantDetails.category ||
            !plantDetails.img
          }
        >
          Add Plant
        </button>
      </form>
    </div>
  );
};

export default AddPlants;
