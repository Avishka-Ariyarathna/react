import React, { useState, useEffect } from "react";
import axios from "axios";
import "../scss/UpdateMachine.scss";

// Replace this with your actual server URL

const API_BASE_URL = "http://localhost:4000/api";

const DUpdateMachinePopup = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [updatedStatus, setUpdatedStatus] = useState("");
  const [updatedDetails, setUpdatedDetails] = useState("");
  const [machines, setMachines] = useState([]);

  // Fetch machine data from the backend when the component loads
  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/machines`, {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        });
        setMachines(response.data);
      } catch (error) {
        console.error("Error fetching machines:", error);
      }
    };

    fetchMachines();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Running":
        return "#4CAF50";
      case "Average":
        return "#FFC107";
      case "Shut Down":
        return "#F44336";
      default:
        return "#9E9E9E";
    }
  };

  const filteredMachines = machines.filter(
    (machine) =>
      machine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      machine.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openPopup = (machine) => {
    setSelectedMachine(machine);
    setUpdatedStatus(machine.status);
    setUpdatedDetails(machine.details);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedMachine(null);
  };

  const handleUpdate = async () => {
    if (!updatedStatus || !updatedDetails) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.put(`${API_BASE_URL}/machines`, {
        id: selectedMachine.id,
        status: updatedStatus,
        details: updatedDetails,
      });
      alert(response.data.message);
      setIsPopupOpen(false);
      setMachines((prevMachines) =>
        prevMachines.map((machine) =>
          machine.id === selectedMachine.id
            ? { ...machine, status: updatedStatus, details: updatedDetails }
            : machine
        )
      );
    } catch (error) {
      console.error("Error updating machine:", error);
      alert("Error updating machine.");
    }
  };

  return (
    <div className="machine-status-container">
      <h2 className="machinetitle">Machine Status Overview</h2>
      <div className="machine-overview">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by name or status..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="machines-grid">
          {filteredMachines.map((machine) => (
            <div
              key={machine.id}
              className="machine-card"
              onClick={() => openPopup(machine)}
            >
              <div className="status-indicator-container">
                <div
                  className="status-indicator"
                  style={{ backgroundColor: getStatusColor(machine.status) }}
                ></div>
                <div className="tooltip">
                  <span>{machine.details}</span>
                </div>
              </div>
              <div className="machine-info">
                <h3>{machine.name}</h3>
                <p>
                  Status: <span>{machine.status}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isPopupOpen && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Update Machine</h2>
            <label>Name:</label>
            <input type="text" value={selectedMachine.name} disabled />

            <label>Status:</label>
            <select
              value={updatedStatus}
              onChange={(e) => setUpdatedStatus(e.target.value)}
            >
              <option value="Running">Running</option>
              <option value="Average">Average</option>
              <option value="Shut Down">Shut Down</option>
            </select>

            <label>Details:</label>
            <textarea
              value={updatedDetails}
              onChange={(e) => setUpdatedDetails(e.target.value)}
            />

            <button onClick={handleUpdate}>Update</button>
            <button onClick={closePopup} className="close-btn">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DUpdateMachinePopup;
