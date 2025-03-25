import React, { useState, useEffect } from "react";
import axios from "axios";
import classNames from "classnames";
import "../scss/daily.scss";

// Replace this with your actual server URL

const API_BASE_URL = "http://localhost:4000/api";
const Image_Based_URL = "http://localhost:4000";

const DailyImg = () => {
  const [images, setImages] = useState([]);
  const [date, setDate] = useState("");
  const [file, setFile] = useState(null);
  const [editImageId, setEditImageId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = () => {
    axios
      .get(`${API_BASE_URL}/deduru-daily-images`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      })
      .then((response) => {
        setImages(response.data);
      })
      .catch((error) => {
        console.error("Error fetching images:", error);
      });
  };

  const handleAddImage = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", file);
    formData.append("date", date);

    axios
      .post(`${API_BASE_URL}/deduru-daily-images`, formData)
      .then((response) => {
        console.log(response.data.message);
        setDate("");
        setFile(null);
        fetchImages();
      })
      .catch((error) => {
        console.error("Error adding image:", error);
      });
  };

  const handleUpdateImage = (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (file) formData.append("image", file);
    formData.append("date", date);

    axios
      .put(`${API_BASE_URL}/deduru-daily-images/${editImageId}`, formData)
      .then((response) => {
        console.log(response.data.message);
        setDate("");
        setFile(null);
        setEditImageId(null);
        setIsModalOpen(false);
        fetchImages();
      })
      .catch((error) => {
        console.error("Error updating image:", error);
      });
  };

  const handleEditImage = (image) => {
    setEditImageId(image.id);
    setDate(image.date);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditImageId(null);
    setDate("");
    setFile(null);
  };

  return (
    <div className={classNames("daily-img-container")}>
      <h1 className={classNames("heading")}>Daily Images</h1>

      {/* Card View for Images */}
      <div className={classNames("image-grid")}>
        {images.map((image) => (
          <div key={image.id} className={classNames("image-card")}>
            <img
              src={`${Image_Based_URL}${image.image_url}`}
              alt="Daily"
              className={classNames("card-image")}
            />
            <div className={classNames("card-content")}>
              <p className={classNames("card-date")}>{image.date}</p>
              <button
                onClick={() => handleEditImage(image)}
                className={classNames("edit-button")}
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Form to Add a New Image */}
      <div className={classNames("image-form")}>
        <h2 className={classNames("subheading")}>Add a New Daily Image</h2>
        <form onSubmit={handleAddImage} className={classNames("form")}>
          <div className={classNames("form-group")}>
            <label htmlFor="date" className={classNames("label")}>
              Date:
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={classNames("input")}
            />
          </div>
          <div className={classNames("form-group")}>
            <label htmlFor="file" className={classNames("label")}>
              Image File:
            </label>
            <input
              type="file"
              id="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className={classNames("input")}
            />
          </div>
          <button type="submit" className={classNames("submit-button")}>
            Add Image
          </button>
        </form>
      </div>

      {/* Popup Modal for Editing */}
      {isModalOpen && (
        <div className={classNames("modal-overlay")}>
          <div className={classNames("modal")}>
            <h2 className={classNames("modal-heading")}>Update Daily Image</h2>
            <form onSubmit={handleUpdateImage} className={classNames("form")}>
              <div className={classNames("form-group")}>
                <label htmlFor="date" className={classNames("label")}>
                  Date:
                </label>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={classNames("input")}
                />
              </div>
              <div className={classNames("form-group")}>
                <label htmlFor="file" className={classNames("label")}>
                  Image File:
                </label>
                <input
                  type="file"
                  id="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files[0])}
                  className={classNames("input")}
                />
              </div>
              <button type="submit" className={classNames("submit-button")}>
                Update Image
              </button>
              <button
                type="button"
                onClick={handleCloseModal}
                className={classNames("cancel-button")}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyImg;
