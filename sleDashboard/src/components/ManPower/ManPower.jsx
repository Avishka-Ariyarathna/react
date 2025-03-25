import React, { useState, useEffect } from "react";
import {
  FaUsers,
  FaMoneyBillWave,
  FaChartLine,
  FaHandHoldingUsd,
  FaTrash,
} from "react-icons/fa";
import CountUp from "react-countup";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./manpower.scss";

const API_BASE_URL = "http://139.59.251.39:4000/api";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const years = ["2023", "2024", "2025", "2026", "2027"];

const Manpower = () => {
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );
  const [selectedMonth, setSelectedMonth] = useState("");
  const [latestData, setLatestData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [stats, setStats] = useState({
    totalWorkers: 0,
    income: 0,
    profit: 0,
    salary: 0,
  });
  const [showModal, setShowModal] = useState(false);
  const [showAllDataModal, setShowAllDataModal] = useState(false);
  const [filterYear, setFilterYear] = useState("");
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    year: "",
    month: "",
    workers: "",
    income: "",
    profit: "",
    salary: "",
  });

  // Fetch latest data
  const fetchLatestData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/manpower/latest`);
      setLatestData(response.data);
      if (!selectedMonth) {
        setStats({
          totalWorkers: Number(response.data.workers) || 0,
          income: Number(response.data.income) || 0,
          profit: Number(response.data.profit) || 0,
          salary: Number(response.data.salary) || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching latest data:", error);
    }
  };

  // Fetch all data
  const fetchAllData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/manpower`);
      setAllData(response.data);
    } catch (error) {
      console.error("Error fetching all data:", error);
    }
  };

  // Fetch yearly data for chart
  const fetchYearlyData = async (year) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/manpower/year/${year}`);
      const formattedData = response.data.map((item) => ({
        month: item.month,
        income: Number(item.income) || 0,
        profit: Number(item.profit) || 0,
        salary: Number(item.salary) || 0,
      }));
      setChartData(formattedData);
      if (selectedMonth) updateStatsForMonth(selectedMonth, formattedData);
    } catch (error) {
      console.error("Error fetching yearly data:", error);
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  // Delete data
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await axios.delete(`${API_BASE_URL}/manpower/${id}`);
        fetchAllData();
        fetchLatestData();
        if (selectedYear) fetchYearlyData(selectedYear);
      } catch (error) {
        console.error("Error deleting data:", error);
      }
    }
  };

  const updateStatsForMonth = (month, data = chartData) => {
    const monthData = data.find((item) => item.month === month);
    if (monthData) {
      setStats({
        totalWorkers: Number(monthData.workers) || 0,
        income: Number(monthData.income) || 0,
        profit: Number(monthData.profit) || 0,
        salary: Number(monthData.salary) || 0,
      });
    } else {
      setStats({ totalWorkers: 0, income: 0, profit: 0, salary: 0 });
    }
  };

  useEffect(() => {
    fetchLatestData();
    fetchYearlyData(selectedYear);
    fetchAllData();
  }, [selectedYear]);

  useEffect(() => {
    if (selectedMonth) {
      updateStatsForMonth(selectedMonth);
    } else if (latestData) {
      setStats({
        totalWorkers: Number(latestData.workers) || 0,
        income: Number(latestData.income) || 0,
        profit: Number(latestData.profit) || 0,
        salary: Number(latestData.salary) || 0,
      });
    }
  }, [selectedMonth, chartData, latestData]);

  const percentageChange = (oldValue, newValue) =>
    oldValue && newValue
      ? (((newValue - oldValue) / oldValue) * 100).toFixed(2)
      : "N/A";

  const handleAddDataClick = () => setShowModal(true);
  const handleViewAllClick = () => {
    fetchAllData();
    setShowAllDataModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      year: "",
      month: "",
      workers: "",
      income: "",
      profit: "",
      salary: "",
    });
  };

  const handleCloseAllDataModal = () => setShowAllDataModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/manpower`, {
        ...formData,
        workers: Number(formData.workers),
        income: Number(formData.income),
        profit: Number(formData.profit),
        salary: Number(formData.salary),
      });
      setShowModal(false);
      fetchLatestData();
      fetchAllData();
      if (formData.year === selectedYear) fetchYearlyData(selectedYear);
    } catch (error) {
      console.error("Error adding data:", error);
    }
  };

  const filteredData = filterYear
    ? allData.filter((item) => item.year === filterYear)
    : allData;

  const prevMonthData =
    chartData.length >= 2 ? chartData[chartData.length - 2] : null;
  const currentMonthData = latestData;

  return (
    <div className="manpower-container">
      <div className="header">
        <div className="controls">
          <select
            onChange={(e) => setSelectedYear(e.target.value)}
            value={selectedYear}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <button onClick={handleAddDataClick}>Add Data</button>
          <button onClick={handleViewAllClick}>View All</button>
        </div>
      </div>
      {/* Existing Stats and Chart Sections remain mostly unchanged */}
      <div className="stats-section">
        <div className="stats-header">
          <h2>
            Statistics {selectedMonth ? `for ${selectedMonth}` : "(Latest)"}
          </h2>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="">Select Month (Latest)</option>
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
        <div className="stats-grid">
          <div className="stat-card1">
            <div className="card-content">
              <FaUsers className="icon users" />
              <h2 className="stat-label">Total Workers</h2>
              <CountUp
                start={0}
                end={stats.totalWorkers}
                duration={2.5}
                separator=","
                className="stat-value"
              />
            </div>
          </div>
          <div className="stat-card2">
            <div className="card-content">
              <FaMoneyBillWave className="icon income" />
              <h2 className="stat-label">CEB Income (LKR)</h2>
              <CountUp
                start={0}
                end={stats.income}
                duration={2.5}
                separator=","
                className="stat-value"
              />
            </div>
          </div>
          <div className="stat-card3">
            <div className="card-content">
              <FaChartLine className="icon profit" />
              <h2 className="stat-label">Total Profit (LKR)</h2>
              <CountUp
                start={0}
                end={stats.profit}
                duration={2.5}
                separator=","
                className="stat-value"
              />
            </div>
          </div>
          <div className="stat-card4">
            <div className="card-content">
              <FaHandHoldingUsd className="icon salary" />
              <h2 className="stat-label">Salary Paid (LKR)</h2>
              <CountUp
                start={0}
                end={stats.salary}
                duration={2.5}
                separator=","
                className="stat-value"
              />
            </div>
          </div>
        </div>
      </div>
      {prevMonthData && currentMonthData && (
        <div className="growth">
          <span>
            📈 CEB Income:{" "}
            {percentageChange(prevMonthData.income, currentMonthData.income)}%
            Growth
          </span>
          <span>
            💰 Profit:{" "}
            {percentageChange(prevMonthData.profit, currentMonthData.profit)}%
            Growth
          </span>
          <span>
            📉 Salaries Paid:{" "}
            {percentageChange(prevMonthData.salary, currentMonthData.salary)}%
            Change
          </span>
        </div>
      )}
      <div className="chart-container">
        <h2>📉 Annual Financial Trends ({selectedYear})</h2>
        {loading ? (
          <p>Loading chart data...</p>
        ) : chartData.length === 0 ? (
          <p>No data available for {selectedYear}</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#007bff"
                strokeWidth={2}
                name="CEB Income (LKR)"
              />
              <Line
                type="monotone"
                dataKey="profit"
                stroke="#439c40"
                strokeWidth={2}
                name="Total Profit (LKR)"
              />
              <Line
                type="monotone"
                dataKey="salary"
                stroke="#d47c2a"
                strokeWidth={2}
                name="Salary Paid (LKR)"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
      {/* Add Data Modal */}
      .Concurrent
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add New Data</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Year</label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Year</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Month</label>
                <select
                  name="month"
                  value={formData.month}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Month</option>
                  {months.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Total Workers</label>
                <input
                  type="number"
                  name="workers"
                  value={formData.workers}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>CEB Income (LKR)</label>
                <input
                  type="number"
                  name="income"
                  value={formData.income}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Profit (LKR)</label>
                <input
                  type="number"
                  name="profit"
                  value={formData.profit}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Salary (LKR)</label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="button" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* View All Data Modal */}
      {showAllDataModal && (
        <div className="modal-overlay">
          <div className="modal all-data-modal">
            <h2>All Manpower Data</h2>
            <div className="filter-section">
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
              >
                <option value="">All Years</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Month</th>
                    <th>Workers</th>
                    <th>Income (LKR)</th>
                    <th>Profit (LKR)</th>
                    <th>Salary (LKR)</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((item) => (
                      <tr key={item.id}>
                        <td>{item.year}</td>
                        <td>{item.month}</td>
                        <td>{item.workers}</td>
                        <td>{item.income.toLocaleString()}</td>
                        <td>{item.profit.toLocaleString()}</td>
                        <td>{item.salary.toLocaleString()}</td>
                        <td>
                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(item.id)}
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7">No data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="form-actions">
              <button onClick={handleCloseAllDataModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Manpower;
