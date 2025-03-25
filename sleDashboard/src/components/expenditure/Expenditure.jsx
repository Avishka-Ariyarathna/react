import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaChartLine, FaArrowRight, FaTimes } from "react-icons/fa";
import "./expenditure.scss";

// Replace this with your actual server URL

const API_BASE_URL = "http://139.59.251.39:4000/api";

const Expenditure = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [expenditureData, setExpenditureData] = useState([]);

  useEffect(() => {
    fetchExpenditures();
  }, []);

  const fetchExpenditures = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/expenditure`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });
      setExpenditureData(response.data);
    } catch (error) {
      setErrorMessage("Error fetching expenditure data");
      console.error("Error fetching data:", error);
    }
  };

  const handleItemClick = (item) => {
    console.log("Selected item:", item);
    setSelectedItem(item);
    setSelectedPlant(item.plant_name);
    setAmount(item.amount);
    setIsPopupOpen(true);
  };

  const handleArrowClick = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedPlant("");
    setAmount("");
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    if (!selectedPlant || !amount) {
      setErrorMessage("Plant name and amount are required!");
      setIsLoading(false);
      return;
    }

    const data = {
      plant_name: selectedPlant,
      amount: parseFloat(amount),
    };

    console.log("Submitting data:", data);

    try {
      await axios.put(`${API_BASE_URL}/expenditure`, data);
      setSelectedPlant("");
      setAmount("");
      setIsPopupOpen(false);
      alert("Expenditure updated successfully");
      fetchExpenditures();
    } catch (error) {
      setErrorMessage("Error updating expenditure");
      console.error("Error updating data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat().format(amount);
  };

  return (
    <div className="expenditure">
      <div className="card">
        <div className="card-header">
          <div className="title">
            <FaChartLine className="icon" />
            <span>Weekly Expenditure</span>
          </div>
          <FaArrowRight className="arrow-icon" onClick={handleArrowClick} />
        </div>
        <ul className="expenditure-list">
          {expenditureData.map((item, index) => (
            <li
              key={index}
              className={`expenditure-item ${
                selectedItem === item ? "active" : ""
              }`}
              onClick={() => handleItemClick(item)}
            >
              {item.plant_name}
              <span className="amount">{formatAmount(item.amount)} LKR</span>
            </li>
          ))}
        </ul>
      </div>

      {isPopupOpen && (
        <div className="popup-overlay">
          <div className="popup">
            <div className="popup-header">
              <h3>Update Expenditure</h3>
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
                  {expenditureData.map((item, index) => (
                    <option key={index} value={item.plant_name}>
                      {item.plant_name}
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

export default Expenditure;
