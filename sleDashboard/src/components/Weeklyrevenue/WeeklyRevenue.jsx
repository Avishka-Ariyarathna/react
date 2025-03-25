import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AiOutlineFund } from "react-icons/ai"; // New Icon for Revenue
import "./weeklyrevenue.scss";

// Replace this with your actual server URL

const API_BASE_URL = "http://localhost:4000/api";

const WeeklyRevenue = (props) => {
  const [weeklyRevenue, setWeeklyRevenue] = useState({
    deduruoyaWeekly: 0,
    biomedWeekly: 0,
    kumbalgamuwaWeekly: 0,
  });

  // Function to calculate total weekly revenue
  const calculateTotalRevenue = () => {
    return (
      weeklyRevenue.deduruoyaWeekly +
      weeklyRevenue.biomedWeekly +
      weeklyRevenue.kumbalgamuwaWeekly
    );
  };

  useEffect(() => {
    const fetchWeeklyRevenueData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/revenue/weekly`, {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        });
        console.log("Weekly Revenue API Response:", response.data);

        // Ensure the data is parsed as numbers
        const parsedData = {
          deduruoyaWeekly: parseFloat(response.data.deduruoyaWeekly),
          biomedWeekly: parseFloat(response.data.biomedWeekly),
          kumbalgamuwaWeekly: parseFloat(response.data.kumbalgamuwaWeekly),
        };

        setWeeklyRevenue(parsedData);
      } catch (error) {
        console.error("Error fetching weekly revenue data:", error);
      }
    };

    fetchWeeklyRevenueData();
  }, []);

  return (
    <div className="chartBox">
      <div className="boxInfo">
        <div className="title">
          <AiOutlineFund size={24} color="#2196F3" />
          {/* Green Dollar Icon */}
          <span>Weekly Revenue</span>
        </div>

        <h1>{calculateTotalRevenue().toLocaleString()}</h1>
        <Link to="">View all</Link>
      </div>
      <div className="chartInfo">
        <div className="chart"></div>
        <div className="texts">
          <span className="duration">Last 7 Days</span>
        </div>
      </div>
    </div>
  );
};

export default WeeklyRevenue;
