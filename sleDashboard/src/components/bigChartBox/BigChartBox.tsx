import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import "./bigChartBox.scss";


const API_BASE_URL = "http://localhost:4000/api";


const BigChartBox = () => {
  const [data, setData] = useState([]);

  // Fetch daily production data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/plant-data`, {
        headers: {
          'ngrok-skip-browser-warning': 'true'
         },
      });
        console.log("Fetched Data:", response.data); // Log fetched data
  
        // Sort data by date in descending order (newest first)
        const sortedData = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
  
        // Get the latest 5 days of data
        const latest5DaysData = sortedData.slice(0, 5);
  
        // Format the fetched data for the chart
        const formattedData = latest5DaysData.map((entry) => ({
          name: new Date(entry.date).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          }), // Format date as "Sun, Oct 1"
          Deduruoya: Number(entry.deduruoya_production), // Ensure data is numeric
          Kumbalgamuwa: Number(entry.kumbalgamuwa_production), // Ensure data is numeric
          Biomed: Number(entry.biomed_production), // Ensure data is numeric
        }));
  
        console.log("Formatted Data:", formattedData); // Log formatted data
        setData(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, []);

  // Function to format numbers with commas
  const formatNumberWithCommas = (number) => {
    return number.toLocaleString();
  };

  return (
    <div className="bigChartBox">
      <h1 style={{ color: "#333" }}>Daily Generations (KWh)</h1>

      <div className="chart">
        <ResponsiveContainer width="130%" height={300}>
          <BarChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 50 }}
            barCategoryGap="10%"  // Space between days (categories)
            barGap={4}            // Space between bars within the same day
          >
            <XAxis
              dataKey="name"
              tick={{ fill: "#333", fontSize: 12 }} // Adjust font size
              tickLine={{ stroke: "#ccc" }} // Optional: add a light stroke for ticks
              interval={0} // Ensure all labels are shown
              textAnchor="end" // Align text to the end
            />
            <YAxis 
              tick={{ fill: "#333" }} 
              domain={[0, 25000]} 
              tickFormatter={(value) => formatNumberWithCommas(value)} // Format Y-axis ticks
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#222",
                color: "#fff",
                borderRadius: "8px",
              }}
              formatter={(value) => formatNumberWithCommas(value)} // Format values in Tooltip
            />
            <Legend
              wrapperStyle={{
                color: "#333",
                position: "absolute",
                top: "-60px",  // Move it down a bit
                right: "140px",
                paddingBottom: "20px",  // Add space below the legend
              }}
              layout="vertical"
              verticalAlign="top"
              align="right"
            />
            <Bar dataKey="Deduruoya" fill="rgb(13, 122, 165)" /> {/* Deep Blue */}
            <Bar dataKey="Kumbalgamuwa" fill="#D97706" /> {/* Dark Orange */}
            <Bar dataKey="Biomed" fill="#16A34A" /> {/* Dark Green */}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BigChartBox;
