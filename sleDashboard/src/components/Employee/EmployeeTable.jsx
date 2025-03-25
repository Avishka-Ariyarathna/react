import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./employee.scss";
import defaultAvatar from "../../assets/img1.png";

const API_BASE_URL = "http://139.59.251.39:4000/api";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    userType: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/get-user`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const addAsManager = async (userId) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/users/add-manager/${userId}`
      );
      if (response.data.success) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, isManager: true } : user
          )
        );
      }
    } catch (error) {
      console.error("Error adding manager:", error);
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await axios.delete(
          `${API_BASE_URL}/users/delete-user/${userId}`
        );
        if (response.data.success) {
          setUsers((prevUsers) =>
            prevUsers.filter((user) => user.id !== userId)
          );
        }
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const openUpdateModal = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      userType: user.userType,
    });
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${API_BASE_URL}/users/update-user/${selectedUser.id}`,
        formData
      );
      if (response.data.success) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === selectedUser.id ? response.data.user : user
          )
        );
        setShowUpdateModal(false);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="user-card-container">
      <h1 className="title">Employees</h1>
      <Link to="/signup">
        <button className="Employeeaddbtn">Add Employees</button>
      </Link>
      <div className="user-cards">
        {users.length > 0 ? (
          users.map((user) => (
            <div className="user-card" key={user.id}>
              <div className="user-avatar">
                <img src={user.avatar || defaultAvatar} alt="Profile" />
              </div>
              <div className="user-info">
                <h2>{user.name}</h2>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Mobile:</strong> {user.mobile}
                </p>
                <p>
                  <strong>User Type:</strong> {user.userType}
                </p>
                <p>
                  <strong>Manager:</strong> {user.isManager ? "Yes" : "No"}
                </p>
              </div>
              <div className="user-actions">
                <button
                  className="add-manager-btn"
                  onClick={() => addAsManager(user.id)}
                  disabled={user.isManager}
                >
                  Promote to Manager
                </button>
                <button
                  className="update-btn"
                  onClick={() => openUpdateModal(user)}
                >
                  Update
                </button>
                <button
                  className="delete-btn"
                  onClick={() => deleteUser(user.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-users">No users found</p>
        )}
      </div>

      {/* Update Modal */}
      {showUpdateModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Update User</h2>
            <form onSubmit={handleUpdateSubmit}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Name"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                required
              />
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                placeholder="Mobile"
                required
              />
              <select
                name="userType"
                value={formData.userType}
                onChange={handleInputChange}
                required
              >
                <option value="">Select User Type</option>
                <option value="Employee">Employee</option>
                <option value="Manager">Manager</option>
              </select>
              <div className="modal-actions">
                <button type="submit">Save</button>
                <button type="button" onClick={() => setShowUpdateModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;
