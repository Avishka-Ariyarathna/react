import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../scss/mempProduction.scss";

const API_BASE_URL = "http://139.59.251.39:4000/api/memp-productn";

const Memp_Production = () => {
  const [productionData, setProductionData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showOrderByForm, setShowOrderByForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [formData, setFormData] = useState({
    date: "",
    Ceb: "",
    Leco: "",
    Ceb_Covers: "",
    Leco_Covers: "",
    Base: "",
    Shutters: "",
    Pc_kg: "",
    Cover_Beading: "",
    Shutter_Beading: "",
    Springs: "",
    Corrugated_Boxes: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProductionData();
  }, []);

  const fetchProductionData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(API_BASE_URL);
      setProductionData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      setError("Error fetching production data");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        setIsLoading(true);
        await axios.delete(`${API_BASE_URL}/${id}`);
        await fetchProductionData();
        alert("Record deleted successfully");
      } catch (error) {
        setError("Error deleting production data");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const openForm = () => setShowForm(true);
  const closeForm = () => {
    setShowForm(false);
    setFormData({
      date: "",
      Ceb: "",
      Leco: "",
      Ceb_Covers: "",
      Leco_Covers: "",
      Base: "",
      Shutters: "",
      Pc_kg: "",
      Cover_Beading: "",
      Shutter_Beading: "",
      Springs: "",
      Corrugated_Boxes: "",
    });
  };

  const handleOrderByClick = () => setShowOrderByForm(true);
  const handleOrderByCancel = () => setShowOrderByForm(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await axios.post(API_BASE_URL, formData);
      await fetchProductionData();
      closeForm();
      alert("Production data added successfully");
    } catch (error) {
      setError("Error adding production data");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOrderBySubmit = (e) => {
    e.preventDefault();
    const filtered = productionData.filter(
      (entry) => formatDate(entry.date) === formatDate(selectedDate)
    );
    setFilteredData(filtered);
    setShowOrderByForm(false);
  };

  return (
    <div className="daily-data">
      <div className="buttons">
        <button className="add-data-btn" onClick={openForm}>
          Add Data
        </button>
        <button className="order-by-btn" onClick={handleOrderByClick}>
          Order By
        </button>
      </div>

      <h2>Stock Table</h2>
      {error && <p className="error">{error}</p>}
      {isLoading && <p>Loading...</p>}
      <table className="data-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Ceb</th>
            <th>Leco</th>
            <th>Ceb Covers</th>
            <th>Leco Covers</th>
            <th>Base</th>
            <th>Shutters</th>
            <th>Pc kg</th>
            <th>Cover Beading</th>
            <th>Shutter Beading</th>
            <th>Springs</th>
            <th>Corrugated Boxes</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((entry) => (
            <tr key={entry.id}>
              <td>{formatDate(entry.date)}</td>
              <td>{entry.Ceb}</td>
              <td>{entry.Leco}</td>
              <td>{entry.Ceb_Covers}</td>
              <td>{entry.Leco_Covers}</td>
              <td>{entry.Base}</td>
              <td>{entry.Shutters}</td>
              <td>{entry.Pc_kg}</td>
              <td>{entry.Cover_Beading}</td>
              <td>{entry.Shutter_Beading}</td>
              <td>{entry.Springs}</td>
              <td>{entry.Corrugated_Boxes}</td>
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
                "Ceb",
                "Leco",
                "Ceb_Covers",
                "Leco_Covers",
                "Base",
                "Shutters",
                "Pc_kg",
                "Cover_Beading",
                "Shutter_Beading",
                "Springs",
                "Corrugated_Boxes",
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
                <button type="submit" disabled={isLoading}>
                  {isLoading ? "Submitting..." : "Submit"}
                </button>
                <button type="button" onClick={closeForm} disabled={isLoading}>
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

export default Memp_Production;
