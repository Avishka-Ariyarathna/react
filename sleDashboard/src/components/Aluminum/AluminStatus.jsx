import { useState, useEffect } from "react";
import axios from "axios";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "../../scss/plantdetailcommon.scss";

// Replace this with your actual server URL
// const API_BASE_URL = "https://2ece-124-43-4-17.ngrok-free.app/api";
const API_BASE_URL = "http://139.59.251.39:4000/api";

const Aluminum = () => {
  const plant_id = 6;
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);

  const [dailyData, setDailyData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    start: "",
    end: "",
    status: "",
  });
  const [showOrderByForm, setShowOrderByForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  // Format date to MM/DD/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  useEffect(() => {
    const fetchPlantDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/plants/${plant_id}`, {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        });
        setPlant(response.data);
      } catch (error) {
        console.error("Error fetching plant details:", error);
        alert("Failed to fetch plant details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const fetchDailyData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/aluminumstatus-data`);
        const sortedData = response.data.sort((a, b) => {
          return new Date(b.date) - new Date(a.date); // Sort by most recent date
        });
        setDailyData(sortedData);
        setFilteredData(sortedData.slice(0, 5)); // Set the latest 5 rows
      } catch (error) {
        console.error("Error fetching daily data:", error);
        alert("Failed to fetch daily data. Please try again later.");
      }
    };

    fetchPlantDetails();
    fetchDailyData();
  }, []);

  const openForm = () => setShowForm(true);
  const closeForm = () => setShowForm(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate date (ensure it's not in the future)
    const selectedDate = new Date(formData.date);
    const currentDate = new Date();
    if (selectedDate > currentDate) {
      alert("Date cannot be in the future.");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/aluminumstatus-data`, formData);
      setShowForm(false);
      setFormData({ date: "", start: "", end: "", status: "" });

      // Refresh data after submission
      const response = await axios.get(`${API_BASE_URL}/aluminumstatus-data`);
      const sortedData = response.data.sort((a, b) => {
        return new Date(b.date) - new Date(a.date); // Sort by most recent date
      });
      setDailyData(sortedData);
      setFilteredData(sortedData.slice(0, 5)); // Update the filtered data to the latest 5 rows
    } catch (error) {
      console.error("Error adding data:", error);
      alert("Failed to add data. Please try again later.");
    }
  };

  const handleOrderByClick = () => {
    setShowOrderByForm(true); // Show the Order By form
  };

  const handleOrderBySubmit = async (e) => {
    e.preventDefault();
    const filtered = dailyData.filter(
      (entry) => formatDate(entry.date) === formatDate(selectedDate)
    );
    setFilteredData(filtered); // Set the filtered data based on the selected date
    setShowOrderByForm(false); // Close the Order By form
  };

  const handleOrderByCancel = () => {
    setShowOrderByForm(false); // Close the Order By form
    setFilteredData(dailyData.slice(0, 5)); // Reset to show latest 5 rows
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        console.log("Attempting to delete ID:", id); // Debug log
        const response = await axios.delete(
          `${API_BASE_URL}/aluminumstatus-data/${id}`
        );
        console.log("Delete response:", response.data); // Debug log
        const updatedData = dailyData.filter((entry) => entry.id !== id);
        setDailyData(updatedData);
        setFilteredData(updatedData.slice(0, 5));
        alert("Record deleted successfully!");
      } catch (error) {
        console.error(
          "Error deleting data:",
          error.response?.data || error.message
        );
        alert(
          "Failed to delete record: " +
            (error.response?.data?.message || "Unknown error")
        );
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="power-plant-container">
      <div className="daily-data">
        <div className="buttons">
          <button className="add-data-btn" onClick={openForm}>
            Add Data
          </button>

          <button className="order-by-btn" onClick={handleOrderByClick}>
            Order By
          </button>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Start</th>
              <th>End</th>
              <th>Status</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((entry) => (
              <tr key={entry.id}>
                <td>{formatDate(entry.date)}</td>
                <td>{entry.start}</td>
                <td>{entry.end}</td>
                <td>{entry.status}</td>
                <td>
                  <span
                    className="delete-icon"
                    onClick={() => handleDelete(entry.id)}
                    style={{ cursor: "pointer", color: "red" }}
                  >
                    🗑️
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="popup-form show">
          <div className="form-content">
            <h3>Add Daily Data</h3>
            <form onSubmit={handleSubmit}>
              <label>Date:</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />

              <label>Start:</label>
              <input
                type="time"
                name="start"
                value={formData.start}
                onChange={handleChange}
                required
              />

              <label>End:</label>
              <input
                type="time"
                name="end"
                value={formData.end}
                onChange={handleChange}
                required
              />

              <label>Status:</label>
              <input
                type="text"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              />

              <div className="form-buttons">
                <button type="submit">Submit</button>
                <button type="button" onClick={closeForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showOrderByForm && (
        <div className="popup-form show">
          <div className="form-content">
            <h3>Order By Date</h3>
            <form onSubmit={handleOrderBySubmit}>
              <label>Select Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                required
              />
              <div className="form-buttons">
                <button type="submit">Filter</button>
                <button type="button" onClick={handleOrderByCancel}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Aluminum;
