import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  AiOutlineCheckCircle,
  AiOutlineWarning,
  AiOutlineCloseCircle,
  AiOutlinePlus,
} from "react-icons/ai";
import "./powerStationTiles.scss";

// Replace this with your actual server URL

const API_BASE_URL = "http://localhost:4000/api";
const Image_Based_URL = "http://localhost:4000";

// Function to determine the color, text, and icon based on plant_factor
const getEfficiencyDetails = (plantFactor) => {
  if (plantFactor > 60) {
    return {
      color: "green",
      text: "High Efficiency",
      icon: <AiOutlineCheckCircle />,
    };
  } else if (plantFactor > 50) {
    return {
      color: "yellow",
      text: "Moderate Efficiency",
      icon: <AiOutlineWarning />,
    };
  }
  return {
    color: "red",
    text: "Low Efficiency",
    icon: <AiOutlineCloseCircle />,
  };
};

const plantRoutes = {
  2: "/deduruoya",
  3: "/kumbalgamuwa",
  4: "/biomed",
  5: "/memp",
  6: "/aluminum",
  7: "/solor",
};

const plantApiMapping = {
  Deduruoya: `${API_BASE_URL}/deduruoya-data`,
  Kumbalgamuwa: `${API_BASE_URL}/kumbalgamuwa-data`,
  Biomed: `${API_BASE_URL}/biomed-data`,
};

const PowerStationsTable = () => {
  const [plants, setPlants] = useState([]);
  const [dailyData, setDailyData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/plants`, {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        });
        setPlants(response.data.plants);
        response.data.plants.forEach((plant) => {
          fetchDailyData(plant.name);
        });
      } catch (error) {
        console.error("Error fetching plants:", error);
      }
    };

    const fetchDailyData = async (plantName) => {
      try {
        // Normalize plant name to match keys in plantApiMapping
        const normalizedPlantName = plantName.trim(); // Trim whitespace
        const apiUrl = plantApiMapping[normalizedPlantName];
        if (apiUrl) {
          const response = await axios.get(apiUrl);
          const sortedData = response.data.sort((a, b) => {
            return new Date(b.date) - new Date(a.date); // Sort by most recent date
          });
          setDailyData((prevData) => ({
            ...prevData,
            [normalizedPlantName]: sortedData.slice(0, 5), // Set the latest 5 rows
          }));
        } else {
          console.warn(`No API URL found for plant: ${normalizedPlantName}`);
        }
      } catch (error) {
        console.error(`Error fetching daily data for ${plantName}:`, error);
      }
    };

    fetchPlants();
  }, []);

  const handleNavigation = (plantId) => {
    const route = plantRoutes[plantId];

    if (route) {
      navigate(route);
    } else {
      console.warn(`No route defined for plant ID: ${plantId}`);
    }
  };

  const categorizedPlants = {
    "Power Stations": plants.filter(
      (plant) => plant.category === "PowerStation"
    ),
    "Production Plants": plants.filter(
      (plant) => plant.category === "Production Plant"
    ),
  };

  return (
    <div className="powerStations">
      <h1 className="title">Plant Management</h1>
      <Link to="/addplants">
        <button className="addplantBtn">
          <AiOutlinePlus /> Add Plants
        </button>
      </Link>

      {Object.entries(categorizedPlants).map(([category, plantList]) => (
        <div key={category}>
          <div className="two">
            <h1>{category}</h1>
          </div>
          <div className="stationGrid">
            {plantList.length === 0 ? (
              <p>No {category} available.</p>
            ) : (
              plantList.map((plant) => {
                const plantData = dailyData[plant.name] || [];
                const plantFactor =
                  plantData.length > 0 ? plantData[0].plant_factor : 0;
                const { color, text, icon } = getEfficiencyDetails(plantFactor);

                return (
                  <div
                    key={plant.id}
                    className={`stationCard ${color}`}
                    onClick={() => handleNavigation(plant.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className={`cardHeader ${color}`}>
                      <div className="imageContainer">
                        <img
                          src={`${Image_Based_URL}/uploads/${plant.img}`}
                          alt={plant.name}
                          className="stationImage"
                        />
                      </div>
                      <div>
                        <h2 className="plantName">{plant.name}</h2>
                        <div className={`statusIcon ${color}`}>{icon}</div>
                      </div>
                    </div>
                    <div className="cardBody">
                      <p className="efficiencyText">
                        <strong>
                          {plantData.length > 0 ? `${plantFactor}%` : "N/A"}
                        </strong>
                      </p>
                      <p className="efficiencyStatus">{text}</p>
                      <p className="categoryText">
                        <strong>Category:</strong> {plant.category}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PowerStationsTable;
