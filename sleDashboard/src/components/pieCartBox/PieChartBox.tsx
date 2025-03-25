import React, { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import axios from "axios";
import "./pieChartBox.scss";

// Replace this with your actual server URL

const API_BASE_URL = "http://139.59.251.39:4000/api";

const PieChartBox = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to check if it's a new day
  const isNewDay = () => {
    const lastUpdatedDate = localStorage.getItem("lastUpdatedDate");
    const currentDate = new Date().toLocaleDateString();

    if (lastUpdatedDate !== currentDate) {
      localStorage.setItem("lastUpdatedDate", currentDate); // Update the last updated date
      return true; // It's a new day
    }
    return false; // It's not a new day
  };

  // Fetch revenue data from the backend
  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        if (isNewDay()) {
          // Reset revenue data to 0 for a new day
          const resetData = [
            { name: "Deduruoya", value: 0, color: "#00C49F" },
            { name: "Kumbalgamuwa", value: 0, color: "#FFBB28" },
            { name: "Biomed Plant", value: 0, color: "#0088FE" },
          ];
          setRevenueData(resetData);
          setLoading(false);
          return;
        }

        // Fetch data from the API if it's not a new day
        const response = await axios.get(`${API_BASE_URL}/revenue`, {
          headers: {
            'ngrok-skip-browser-warning': 'true'
           },
        });
        console.log("API Response:", response.data); // Debugging

        // Ensure the response contains the expected data
        const { deduruoya, biomed, kumbalgamuwa } = response.data;

        // Format the data for the pie chart
        const formattedData = [
          { name: "Deduruoya", value: Number(deduruoya), color: "#00C49F" },
          { name: "Kumbalgamuwa", value: Number(kumbalgamuwa), color: "#FFBB28" },
          { name: "Biomed Plant", value: Number(biomed), color: "#0088FE" },
        ];

        setRevenueData(formattedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
        setError("Failed to fetch revenue data. Please try again later.");
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Function to format numbers with commas
  const formatNumberWithCommas = (number) => {
    return number.toLocaleString();
  };

  return (
    <div className="pieChartBox">
      <h1>Daily Revenue</h1>
      <div className="chartContainer">
        <div className="chart">
          <ResponsiveContainer width="100%" height={300} minWidth={100} minHeight={100}>
            <PieChart>
              {/* Tooltip to show values on hover */}
              <Tooltip contentStyle={{ background: "white", borderRadius: "5px" }} />
              <Pie data={revenueData} innerRadius={"70%"} outerRadius={"90%"} paddingAngle={5} dataKey="value">
                {revenueData.map((item) => (
                  <Cell key={item.name} fill={item.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="options">
          {revenueData.map((item) => (
            <div className="option" key={item.name}>
              <div className="title">
                <div className="dot" style={{ backgroundColor: item.color }} />
                <span>{item.name}</span>
              </div>
              {/* Format the revenue with commas */}
              <span>{formatNumberWithCommas(item.value)}</span> <span>{item.Date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PieChartBox;