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
import MUpdateMachinePopup from "../MUpdateMachinePopup";
import { Link } from "react-router-dom";
import Memp_Production from "./Memp_Production";

// Replace this with your actual server URL

const API_BASE_URL = "http://139.59.251.39:4000/api";
const Image_Based_URL = "http://139.59.251.39:4000";

const Memp = () => {
  const plant_id = 5;
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSlider, setShowSlider] = useState(false);
  const [sliderIndex, setSliderIndex] = useState(0);
  const [dailyData, setDailyData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    dispatch: "",
    manufactured: "",
    good_covers: "",
    good_bases: "",
    good_shutters: "",
    defect_covers: "",
    defect_bases: "",
    defect_shutters: "",
  });
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
        alert("Failed to fetch plant details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const fetchDailyData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/memp-data`, {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        });
        const sortedData = response.data.sort((a, b) => {
          return new Date(b.date) - new Date(a.date);
        });
        setDailyData(sortedData);
        setFilteredData(sortedData.slice(0, 5));
      } catch (error) {
        console.error("Error fetching daily data:", error);
        alert("Failed to fetch daily data. Please try again later.");
      }
    };

    const fetchImages = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/memp-daily-images`, {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        });
        setSliderImages(response.data.slice(0, 4));
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };
    fetchImages();
    fetchPlantDetails();
    fetchDailyData();
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

    const selectedDate = new Date(formData.date);
    const currentDate = new Date();
    if (selectedDate > currentDate) {
      alert("Date cannot be in the future.");
      return;
    }

    const numericFields = [
      "dispatch",
      "manufactured",
      "good_covers",
      "good_bases",
      "good_shutters",
      "defect_covers",
      "defect_bases",
      "defect_shutters",
    ];
    for (const field of numericFields) {
      if (formData[field] < 0) {
        alert(`${field} cannot be negative.`);
        return;
      }
    }

    try {
      await axios.post(`${API_BASE_URL}/memp-data`, formData);
      setShowForm(false);
      setFormData({
        date: "",
        dispatch: "",
        manufactured: "",
        good_covers: "",
        good_bases: "",
        good_shutters: "",
        defect_covers: "",
        defect_bases: "",
        defect_shutters: "",
      });

      const response = await axios.get(`${API_BASE_URL}/memp-data`);
      const sortedData = response.data.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
      setDailyData(sortedData);
      setFilteredData(sortedData.slice(0, 5));
    } catch (error) {
      console.error("Error adding data:", error);
      alert("Failed to add data. Please try again later.");
    }
  };

  const handleOrderByClick = () => {
    setShowOrderByForm(true);
  };

  const handleOrderBySubmit = async (e) => {
    e.preventDefault();
    const filtered = dailyData.filter(
      (entry) => formatDate(entry.date) === formatDate(selectedDate)
    );
    setFilteredData(filtered);
    setShowOrderByForm(false);
  };

  const handleOrderByCancel = () => {
    setShowOrderByForm(false);
    setFilteredData(dailyData.slice(0, 5));
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        console.log("Attempting to delete ID:", id); // Debug log
        const response = await axios.delete(`${API_BASE_URL}/memp-data/${id}`);
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

  const toggleChatBox = () => {
    setShowChatBox(!showChatBox);
  };

  if (loading) return <div>Loading...</div>;

  const chartData = dailyData
    .slice(0, 10)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((entry) => ({
      date: formatDate(entry.date),
      units: entry.dispatch,
    }));

  return (
    <div className="power-plant-container">
      <h1 className="plant-name">{plant?.name}</h1>

      <Link to="/Mdaily">
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
          <p>{plant?.efficiency}%</p>
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
        <h2>Stock Table</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Dispatch</th>
              <th>Manufactured</th>
              <th>Good Covers</th>
              <th>Good Bases</th>
              <th>Good Shutters</th>
              <th>Defect Covers</th>
              <th>Defect Bases</th>
              <th>Defect Shutters</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((entry) => (
              <tr key={entry.id}>
                <td>{formatDate(entry.date)}</td>
                <td>{entry.dispatch}</td>
                <td>{entry.manufactured}</td>
                <td>{entry.good_covers}</td>
                <td>{entry.good_bases}</td>
                <td>{entry.good_shutters}</td>
                <td>{entry.defect_covers}</td>
                <td>{entry.defect_bases}</td>
                <td>{entry.defect_shutters}</td>
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

      <Memp_Production/>
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
              {[
                "dispatch",
                "manufactured",
                "good_covers",
                "good_bases",
                "good_shutters",
                "defect_covers",
                "defect_bases",
                "defect_shutters",
              ].map((field) => (
                <div key={field}>
                  <label>{field.replace(/_/g, " ")}:</label>
                  <input
                    type="number"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    required
                  />
                </div>
              ))}
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
                    src={`${Image_Based_URL}${image.image_url}`} // Updated image URL
                    alt={`Plant image ${index}`}
                    className="popup-image"
                  />
                </div>
              ))}
            </Slider>
          </div>
        </div>
      )}

      <MUpdateMachinePopup />
    </div>
  );
};

export default Memp;
