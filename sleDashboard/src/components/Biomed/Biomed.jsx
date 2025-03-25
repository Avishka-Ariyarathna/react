import { useState, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ChatBox from "../chatbox/ChatBox";
import "../../scss/plantdetailcommon.scss";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import BUpdateMachinePopup from "../BUpdateMachinePopup";
import { Link } from "react-router-dom";

// Replace this with your actual server URL

const API_BASE_URL = "http://localhost:4000/api";
const Image_Based_URL = "http://localhost:4000";

const Biomed = () => {
  const plant_id = 4;
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSlider, setShowSlider] = useState(false);
  const [sliderIndex, setSliderIndex] = useState(0);
  const [dailyData, setDailyData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ date: "", units: "" });
  const [showOrderByForm, setShowOrderByForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [showChatBox, setShowChatBox] = useState(false);
  const [sliderImages, setSliderImages] = useState([]);

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
      } finally {
        setLoading(false);
      }
    };

    const fetchDailyData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/biomed-data`, {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        });
        const sortedData = response.data.sort((a, b) => {
          return new Date(b.date) - new Date(a.date); // Sort by most recent date
        });
        setDailyData(sortedData);
        setFilteredData(sortedData.slice(0, 5)); // Set the latest 5 rows
      } catch (error) {
        console.error("Error fetching daily data:", error);
      }
    };

    const fetchImages = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/biomed-daily-images`,
          {
            headers: {
              "ngrok-skip-browser-warning": "true",
            },
          }
        );
        setSliderImages(response.data.slice(0, 4)); // Fetch only the first 4 images
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchPlantDetails();
    fetchDailyData();
    fetchImages();
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    fade: true,
  };

  const handleTileClick = (index) => {
    setSliderIndex(index);
    setShowSlider(true);
  };

  const closeSlider = () => {
    setShowSlider(false);
  };

  const openForm = () => setShowForm(true);
  const closeForm = () => setShowForm(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/biomed-data`, formData);
      setShowForm(false);
      setFormData({ date: "", units: "" });

      // Refresh data after submission
      const response = await axios.get(`${API_BASE_URL}/biomed-data`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });
      const sortedData = response.data.sort((a, b) => {
        return new Date(b.date) - new Date(a.date); // Sort by most recent date
      });
      setDailyData(sortedData);
      setFilteredData(sortedData.slice(0, 5)); // Update the filtered data to the latest 5 rows
    } catch (error) {
      console.error("Error adding data:", error);
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

  const toggleChatBox = () => {
    setShowChatBox(!showChatBox); // Toggle chat box visibility
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        console.log("Attempting to delete ID:", id); // Debug log
        const response = await axios.delete(
          `${API_BASE_URL}/biomed-data/${id}`
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

  // Format data for the chart
  const chartData = dailyData
    .slice(0, 10) // Get the latest 10 entries
    .sort((a, b) => new Date(a.date) - new Date(b.date)) // Sort in ascending order
    .map((entry) => ({
      date: formatDate(entry.date),
      units: entry.units,
    }));

  return (
    <div className="power-plant-container">
      <h1 className="plant-name">{plant?.name}</h1>

      <Link to="/Bdaily">
        <button className="imgbtn">Update Image</button>
      </Link>

      <div className="image-tiles">
        {sliderImages.map((image, index) => (
          <div
            key={index}
            className="image-tile"
            onClick={() => handleTileClick(index)}
          >
            <img
              src={`${Image_Based_URL}${image.image_url}`} // Updated image URL
              alt={`Plant ${index}`}
              className="tile-image"
            />
          </div>
        ))}
      </div>

      <div className="details">
        <div className="detail-box">
          <h3>Efficiency</h3>
          <p>
            {filteredData.length > 0
              ? `${filteredData[0].plant_factor}%`
              : "N/A"}
          </p>
        </div>
        <div className="detail-box">
          <h3>Plant Type</h3>
          <p>{plant?.category}</p>
        </div>
        <div className="detail-box">
          <h3>Manager</h3>
          <p>{`Mr: ${plant?.manager_name}`}</p>
        </div>
      </div>

      <div className="daily-data">
        <h2>Daily Data</h2>
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
              <th>Units</th>
              <th>Revenue</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((entry) => (
              <tr key={entry.id}>
                <td>{formatDate(entry.date)}</td>
                <td>{entry.units} kWh</td>
                <td>{entry.revenue} Lkr</td>
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

      <div className="bar-chart-container">
        <h2>Units by Date</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: "#333",
                borderRadius: "5px",
                padding: "10px",
                color: "#fff",
              }}
              itemStyle={{ color: "#FEA116" }}
            />
            <Legend />
            <Bar dataKey="units" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
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
              <label>Units:</label>
              <input
                type="number"
                name="units"
                value={formData.units}
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

      <button className="chat-box-toggle-btn" onClick={toggleChatBox}>
        💬
      </button>

      <div
        className={`overlay ${showChatBox ? "open" : ""}`}
        onClick={toggleChatBox}
      ></div>

      <div className={`chat-box-container ${showChatBox ? "open" : ""}`}>
        <ChatBox plantId={plant_id} />
      </div>

      {showSlider && (
        <div className="slider-popup" onClick={closeSlider}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <Slider {...sliderSettings} initialSlide={sliderIndex}>
              {sliderImages.map((image, index) => (
                <div key={index}>
                  <img
                    src={`${API_BASE_URL}${image.image_url}`} // Updated image URL
                    alt={`Plant image ${index}`}
                    className="popup-image"
                  />
                </div>
              ))}
            </Slider>
          </div>
        </div>
      )}

      <BUpdateMachinePopup />
    </div>
  );
};

export default Biomed;
