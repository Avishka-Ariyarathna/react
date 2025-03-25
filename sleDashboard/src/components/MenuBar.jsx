import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; // Added Link
import axios from "axios";
import "../scss/menu.scss";

// Replace this with your actual server URL

const API_BASE_URL = "http://139.59.251.39:4000/api";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userType, setUserType] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserData = sessionStorage.getItem("userData");
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
      fetchUserType(parsedUserData.email);
    }
  }, []);

  const fetchUserType = async (email) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/users/get-user-type`, {
        email,
      });
      setUserType(response.data.userType || "Unknown");
    } catch (error) {
      console.error("Error fetching userType:", error);
      setUserType("Unknown");
    }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      {userData && <div className="sidebar-user"></div>}

      <div className="sidebar-header">
        <h2>Dashboard</h2>
      </div>

      <ul className="sidebar-menu">
        <li>
          <Link to="/dashboard">
            <span className="icon">🏠</span>
            <span className="text">Dashboard</span>
          </Link>
        </li>
        {userType === "admin" && (
          <li>
            <button className="dropdown-btn" onClick={toggleDropdown}>
              <span className="icon">🏭</span>
              <span className="text">Power Plants</span>
            </button>
            {isDropdownOpen && (
              <ul className="dropdown-menu">
                <li>
                  <Link to="/deduruoya">⚡ Deduruoya</Link>
                </li>
                <li>
                  <Link to="/kumbalgamuwa">💧 Kumbalgamuwa</Link>
                </li>
                <li>
                  <Link to="/biomed">🔋 Biomed plant</Link>
                </li>
                <li>
                  <Link to="/memp">🏭 Meter Manufacturing</Link>
                </li>
                <li>
                  <Link to="/aluminum">🔄 Aluminum Recycling</Link>
                </li>
                <li>
                  <Link to="/solar">☀️ Solar Department</Link>{" "}
                  {/* Fixed typo: solor -> solar */}
                </li>
                <li>
                  <Link to="#">🏗️ Algoda plant</Link>{" "}
                  {/* Placeholder, update if route exists */}
                </li>
                <li>
                  <Link to="#">💨 Dik Ella Plant</Link>{" "}
                  {/* Placeholder, update if route exists */}
                </li>
              </ul>
            )}
          </li>
        )}
        {userType === "admin" && (
          <li>
            <Link to="#">
              <span className="icon">💰</span>
              <span className="text">Finance Division</span>
            </Link>
          </li>
        )}
        <li>
          <Link to="/event">
            <span className="icon">📅</span>
            <span className="text">Calendar</span>
          </Link>
        </li>
        {userType === "admin" && (
          <li>
            <Link to="/employees">
              <span className="icon">👥</span>
              <span className="text">Employees</span>
            </Link>
          </li>
        )}
        {userType === "admin" && (
          <li>
            <Link to="/plants">
              <span className="icon">🏗️</span>
              <span className="text">Plants</span>
            </Link>
          </li>
        )}
        {userType === "admin" && (
          <li>
            <Link to="/manpower">
              <span className="icon">🧑‍🔧</span>
              <span className="text">Man Power</span>
            </Link>
          </li>
        )}
        <li>
          <Link to="#">
            <span className="icon">⚙️</span>
            <span className="text">Settings</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
