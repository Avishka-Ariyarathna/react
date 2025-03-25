import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import axios from "axios"; // Added axios import
import "../scss/navbar.scss";
import img1 from "../assets/img1.png";
import logo from "../assets/energieslogo1.png";

// Replace this with your actual server URL

const API_BASE_URL = "http://139.59.251.39:4000/api";

const Navbar = () => {
  const [userData, setUserData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async (id) => {
      try {
        const response = await axios.get(`${API_BASE_URL}/getusers/${id}`, {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        });
        setUserData(response.data); // Update user data with API response
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const storedUserData = sessionStorage.getItem("userData");

    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);
      setUserData(parsedData); // Set initial user data from session storage

      // Fetch updated user data from the API
      if (parsedData.id) {
        fetchUserData(parsedData.id);
      }
    }
  }, [location]);

  const logout = () => {
    sessionStorage.clear();
    setUserData(null);
    navigate("/login");
  };

  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  let greeting = "";

  if (currentHour >= 5 && currentHour < 12) {
    greeting = "Morning";
  } else if (currentHour >= 12 && currentHour < 17) {
    greeting = "Afternoon";
  } else {
    greeting = "Evening";
  }

  return (
    <div className="navbar">
      <div className="logo">
        <img src={logo} alt="Sri Lanka Energies Logo" className="logo-imgN" />{" "}
        <span>Sri Lanka Energies</span>
      </div>
      <div className="navbar-links">
        <h1 className="greet">Good {greeting}!</h1>
      </div>
      {/* Show User Info if Logged In */}
      <div className="icons">
        {userData && (
          <>
            <div className="user-profile">
              <img
                src={userData.profilePic || img1}
                alt="User"
                className="profile-photo"
              />
              <span className="username">{userData.name || "Guest"}</span>
            </div>
            <div className="logout" onClick={logout}>
              <FiLogOut className="logout-icon" /> {/* Logout Icon */}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
