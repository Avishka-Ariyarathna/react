import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ChatBox from "../chatbox/ChatBox";
import "./powerplantDetail.scss";

// Import images from src/assets folder
import BiomedImage from "../../assets/Biomed_6.jpeg";
import DeduruOyaImage from "../../assets/DeduruOya.jpg";
import GaligamuwaImage from "../../assets/Galigamuwa.png";
import KubalgamaImage from "../../assets/Kubalgama.png";
import BannerImage from "../../assets/banner3.webp";

// Replace this with your actual server URL

const API_BASE_URL = "http://139.59.251.39:4000/api";

const PowerPlantGallery = () => {
  const { id } = useParams(); // Get plant ID from URL
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSlider, setShowSlider] = useState(false); // To control the image slider popup
  const [sliderIndex, setSliderIndex] = useState(0); // Index to control which image in the slider

  // Manually added images from src/assets folder
  const sliderImages = [
    BiomedImage,
    DeduruOyaImage,
    GaligamuwaImage,
    KubalgamaImage,
    BannerImage,
  ];

  useEffect(() => {
    const fetchPlantDetails = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/plants/${id}`, // Fetch plant details by ID
          {
            headers: {
              "ngrok-skip-browser-warning": "true",
            },
          }
        );
        setPlant(response.data);
      } catch (error) {
        console.error("Error fetching plant details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlantDetails();
  }, [id]);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    fade: true, // Adds smooth fade transition between images
  };

  const handleTileClick = (index) => {
    setSliderIndex(index);
    setShowSlider(true);
  };

  const closeSlider = () => {
    setShowSlider(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="power-plant-container">
      <h1 className="plant-name">{plant?.name}</h1>

      {/* Image Tiles */}
      <div className="image-tiles">
        {sliderImages.slice(0, 4).map((image, index) => (
          <div
            key={index}
            className="image-tile"
            onClick={() => handleTileClick(index)}
          >
            <img src={image} alt={`Plant ${index}`} className="tile-image" />
          </div>
        ))}
      </div>

      {/* Detail Boxes */}
      <div className="details">
        <div className="detail-box">
          <h3>Efficiency</h3>
          <p>{plant?.efficiency}%</p>
        </div>
        <div className="detail-box">
          <h3>Plant Type</h3>
          <p>{plant?.category}</p>
        </div>
        <div className="detail-box">
          <h3>Manager</h3>
          <p>{`Mr: ${plant?.manager_name}`}</p>
        </div>
      </div>

      {/* Chatbox */}
      <ChatBox />

      {/* Slider Popup */}
      {showSlider && (
        <div className="slider-popup" onClick={closeSlider}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <Slider {...sliderSettings} initialSlide={sliderIndex}>
              {sliderImages.map((image, index) => (
                <div key={index}>
                  <img
                    src={image}
                    alt={`Plant image ${index}`}
                    className="popup-image"
                  />
                </div>
              ))}
            </Slider>
          </div>
        </div>
      )}
    </div>
  );
};

export default PowerPlantGallery;
