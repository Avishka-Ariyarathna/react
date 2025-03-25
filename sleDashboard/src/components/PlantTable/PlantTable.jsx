import { useEffect, useState } from "react";
import axios from "axios";
import "./planttable.scss";

// Replace this with your actual server URL

const API_BASE_URL = "http://localhost:4000/api";

const Image_Based_URL = "http://localhost:4000";

const PlantsGrid = () => {
  const [plants, setPlants] = useState([]);
  const [managers, setManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null);
  const [selectedPlant, setSelectedPlant] = useState(null);

  useEffect(() => {
    const fetchPlantsAndManagers = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/plants`, {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        });
        setPlants(response.data.plants);
        setManagers(response.data.managers);
      } catch (error) {
        console.error("Error fetching plants:", error);
      }
    };

    fetchPlantsAndManagers();
  }, []);

  const handleAssignManager = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/plants/assign-manager`,
        {
          plantId: selectedPlant,
          managerId: selectedManager,
        }
      );
      alert(response.data.message);

      const updatedPlants = plants.map((plant) =>
        plant.id === selectedPlant
          ? { ...plant, manager_id: selectedManager }
          : plant
      );
      setPlants(updatedPlants);
    } catch (error) {
      console.error("Error assigning manager:", error);
      alert("Failed to assign manager");
    }
  };

  return (
    <div className="plants-container">
      {plants.map((plant) => (
        <div className="plant-card" key={plant.id}>
          <img
            src={`${Image_Based_URL}/uploads/${plant.img}`} // Updated image URL
            alt={plant.name}
          />
          <div className="card-content">
            <h2>{plant.name}</h2>
            <p>Efficiency: {plant.efficiency}%</p>
            <p>Category: {plant.category}</p>
            <button
              className="assign-btn"
              onClick={() => {
                setSelectedPlant(plant.id);
                setSelectedManager(plant.manager_id || managers[0]?.id);
              }}
            >
              Assign Manager
            </button>
            {selectedPlant === plant.id && (
              <div className="dropdown">
                <select
                  value={selectedManager || ""}
                  onChange={(e) => setSelectedManager(e.target.value)}
                >
                  <option value="">Select Manager</option>
                  {managers.map((manager) => (
                    <option key={manager.id} value={manager.id}>
                      {manager.name}
                    </option>
                  ))}
                </select>
                <button className="submit-btn" onClick={handleAssignManager}>
                  Submit
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlantsGrid;
