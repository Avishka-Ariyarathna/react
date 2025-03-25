import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaDollarSign, FaArrowRight, FaTimes } from "react-icons/fa";
import "./receive.scss";

// Replace this with your actual server URL

const API_BASE_URL = "http://139.59.251.39:4000/api";

const Receivables = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [receivablesData, setReceivablesData] = useState([]);

  // Fetch all receivables data when the component mounts
  useEffect(() => {
    fetchReceivables();
  }, []);

  const fetchReceivables = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/receivable`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });
      setReceivablesData(response.data);
    } catch (error) {
      setErrorMessage("Error fetching receivables data");
      console.error("Error fetching data:", error);
    }
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setSelectedPlant(item.plant_name); // Use plant_name
    setAmount(item.amount); // Set the amount
    setIsPopupOpen(true);
  };

  const handleArrowClick = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedPlant("");
    setAmount("");
    setErrorMessage(""); // Reset error message
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(""); // Reset error message on form submission

    const data = {
      plant_name: selectedPlant,
      amount: parseFloat(amount),
    };

    console.log("Submitting data:", data); // Log the data being sent

    try {
      // Make PUT request to update receivable data
      await axios.put(`${API_BASE_URL}/receivable`, data);

      // Reset form after successful submission
      setSelectedPlant("");
      setAmount("");
      setIsPopupOpen(false);
      alert("Receivable updated successfully");

      // Fetch updated data and update the state
      fetchReceivables();
    } catch (error) {
      setErrorMessage("Error updating receivable");
      console.error("Error updating data:", error);
    } finally {
      setIsLoading(false); // Stop loading animation
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat().format(amount);
  };

  return (
    <div className="receivables">
      <div className="card">
        <div className="card-header">
          <div className="title">
            <FaDollarSign className="icon" />
            <span>Total Receivables</span>
          </div>
          <FaArrowRight className="arrow-icon" onClick={handleArrowClick} />
        </div>
        <ul className="receivables-list">
          {receivablesData.map((item, index) => (
            <li
              key={index}
              className={`receivables-item ${
                selectedItem && selectedItem.plant_name === item.plant_name
                  ? "active"
                  : ""
              }`}
              onClick={() => handleItemClick(item)}
            >
              {item.plant_name} {/* Use plant_name */}
              <span className="amount">{formatAmount(item.amount)} LKR</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Popup Form */}
      {isPopupOpen && (
        <div className="popup-overlay">
          <div className="popup">
            <div className="popup-header">
              <h3>Update Receivable</h3>
              <FaTimes className="close-icon" onClick={handleClosePopup} />
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Select Plant</label>
                <select
                  value={selectedPlant}
                  onChange={(e) => setSelectedPlant(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Choose a plant
                  </option>
                  {receivablesData.map((item, index) => (
                    <option key={index} value={item.plant_name}>
                      {item.plant_name} {/* Use plant_name */}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Amount (LKR)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  required
                />
              </div>
              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit"}
              </button>
              {errorMessage && <p className="error">{errorMessage}</p>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Receivables;
