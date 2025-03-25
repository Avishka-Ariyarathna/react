import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";
import "./chartBox.scss";
import { FaMoneyBillWave } from "react-icons/fa";

// Replace this with your actual server URL

const API_BASE_URL = "http://localhost:4000/api";


type Props = {
  color: string;
  icon: string;
  title: string;
  dataKey: string;
  percentage: number;
  chartData: object[];
};

const ChartBox = (props: Props) => {
  const [totalRevenue, setTotalRevenue] = useState<number>(0);

  // Fetch revenue data from the backend
  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/revenue`, {
          headers: {
            'ngrok-skip-browser-warning': 'true'
           },
        });
        console.log("API Response:", response.data);

        // Extract revenue for each plant
        const { deduruoya, biomed, kumbalgamuwa } = response.data;

        // Calculate total revenue
        const total = Number(deduruoya) + Number(biomed) + Number(kumbalgamuwa);
        setTotalRevenue(total);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      }
    };

    fetchRevenueData();
  }, []);

  // Format the total revenue with commas
  const formattedRevenue = totalRevenue.toLocaleString();

  return (
    <div className="chartBox">
      <div className="boxInfo">
        <div className="title">
          <FaMoneyBillWave size={24} color="#00C853" />
          <span>Daily Revenue</span>
        </div>
        {/* Displaying the total revenue with commas */}
        <h1>{formattedRevenue}</h1>
        <Link to="" style={{ color: props.color }}>
          View all
        </Link>
      </div>
      <div className="chartInfo">
        <div className="chart">
          <ResponsiveContainer width="99%" height="80%">
            <LineChart data={props.chartData}>
              <Tooltip
                contentStyle={{ background: "transparent", border: "none" }}
                labelStyle={{ display: "none" }}
                position={{ x: 10, y: 70 }}
              />
              <Line
                type="monotone"
                dataKey={props.dataKey}
                stroke={props.color}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="texts">
          <span className="duration">Today</span>
        </div>
      </div>
    </div>
  );
};

export default ChartBox;