import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProjectsSummary.scss";

// Replace this with your actual server URL

const API_BASE_URL = "http://139.59.251.39:4000/api";

const ProjectsSummary = () => {
  const [projectSummaries, setProjectSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [formData, setFormData] = useState({
    status: "",
    completionPercentage: "",
    lastUpdated: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const statusColors = [
    "#4CAF50",
    "#2196F3",
    "#FFC107",
    "#9C27B0",
    "#F44336",
    "#00BCD4",
    "#FF9800",
    "#3F51B5",
    "#E91E63",
    "#673AB7",
  ];

  useEffect(() => {
    fetchProjectSummaries();
  }, []);

  const fetchProjectSummaries = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/project-summary`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });
      const dataWithColors = response.data.map((project) => ({
        ...project,
        badgeColor:
          statusColors[Math.floor(Math.random() * statusColors.length)],
      }));
      setProjectSummaries(dataWithColors);
      // Only log during initial fetch or if debugging is needed
      console.log("Fetched data (initial load):", dataWithColors);
    } catch (error) {
      setErrorMessage("Error fetching project summary data");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const openUpdateModal = (project) => {
    setSelectedProject(project);
    setFormData({
      status: project.status,
      completionPercentage: project.completion_percentage,
      lastUpdated: project.last_updated.split("T")[0],
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: selectedProject.name,
      status: formData.status,
      completionPercentage: parseInt(formData.completionPercentage),
      lastUpdated: formData.lastUpdated,
    };
    console.log("Sending update payload:", payload);

    try {
      const response = await axios.put(
        `${API_BASE_URL}/project-summary`,
        payload
      );
      console.log("Update response:", response.data);

      if (response.status === 200) {
        const updatedProject = {
          ...selectedProject,
          status: formData.status,
          completion_percentage: parseInt(formData.completionPercentage),
          last_updated: formData.lastUpdated,
        };
        const updatedSummaries = projectSummaries.map((project) =>
          project.name === selectedProject.name ? updatedProject : project
        );
        setProjectSummaries(updatedSummaries);
        console.log("Updated project:", updatedProject); // Log only the updated project
        setShowModal(false);
        setSelectedProject(null);
        setErrorMessage("");
        // Fetch fresh data to confirm update
        await fetchProjectSummaries(); // Still fetches but logging is controlled
      }
    } catch (error) {
      setErrorMessage("Error updating project summary: " + error.message);
      console.error("Error updating data:", error.response?.data || error);
    }
  };

  return (
    <div className="ps-container">
      <div className="ps-header">
        <h2>Project Status</h2>
      </div>

      {loading ? (
        <div className="ps-loading">
          <div className="ps-spinner"></div>
          Loading...
        </div>
      ) : (
        <>
          {errorMessage && <div className="ps-error">{errorMessage}</div>}
          <ul className="ps-plants-list">
            {projectSummaries.map((project, index) => (
              <li key={index} className="ps-plant-item">
                <div className="ps-plant-header">
                  <span className="ps-plant-name">{project.name}</span>
                  <div>
                    <span
                      className="ps-status-badge"
                      style={{ backgroundColor: project.badgeColor }}
                    >
                      {project.status}
                    </span>
                  </div>
                </div>
                <div className="ps-progress-section">
                  <div className="ps-progress-label">
                    Completion: {project.completion_percentage}%
                  </div>
                  <div className="ps-progress-bar">
                    <div
                      className="ps-progress-fill"
                      style={{ width: `${project.completion_percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="ps-details">
                  <span className="ps-detail-item">{project.type}</span>
                  <span className="ps-detail-item">
                    Updated: {formatDate(project.last_updated)}
                  </span>
                </div>
                <button
                  className="ps-update-btn"
                  onClick={() => openUpdateModal(project)}
                  title="Edit"
                >
                  ✏️
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {showModal && (
        <div className="ps-modal-overlay">
          <div className="ps-modal">
            <h3>Update {selectedProject?.name}</h3>
            {errorMessage && <div className="ps-error">{errorMessage}</div>}
            <form onSubmit={handleSubmit}>
              <div className="ps-form-group">
                <label>Status:</label>
                <input
                  type="text"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter status"
                />
              </div>
              <div className="ps-form-group">
                <label>Completion (%):</label>
                <input
                  type="number"
                  name="completionPercentage"
                  value={formData.completionPercentage}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  required
                />
              </div>
              <div className="ps-form-group">
                <label>Last Updated:</label>
                <input
                  type="date"
                  name="lastUpdated"
                  value={formData.lastUpdated}
                  onChange={handleInputChange}
                  required
                  max={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div className="ps-modal-buttons">
                <button type="submit" className="ps-modal-btn ps-save-btn">
                  Save
                </button>
                <button
                  type="button"
                  className="ps-modal-btn ps-cancel-btn"
                  onClick={() => setShowModal(false)}
                >
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

export default ProjectsSummary;
