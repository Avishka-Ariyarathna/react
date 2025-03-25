import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ChatBox from "../chatbox/ChatBox";
import "../../scss/plantdetailcommon.scss";

const API_BASE_URL = "http://localhost:4000/api";
const Image_Based_URL = "http://localhost:4000";

const Solor = () => {
  const plant_id = 7;
  const { id } = useParams(); // Get plant ID from URL
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSlider, setShowSlider] = useState(false); // To control the image slider popup
  const [sliderIndex, setSliderIndex] = useState(0); // Index to control which image in the slider
  const [showChatBox, setShowChatBox] = useState(false); // State for chat box visibility
  const [sliderImages, setSliderImages] = useState([]); // State for fetched images

  useEffect(() => {
    const fetchPlantDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/plants/${plant_id}`, {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        });
        setPlant(response.data);
      } catch (error) {
        console.error("Error fetching plant details:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchImages = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/solor-daily-images`, {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        });
        setSliderImages(response.data.slice(0, 4));
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };
    fetchImages();
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

  const toggleChatBox = () => {
    setShowChatBox(!showChatBox); // Toggle chat box visibility
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="power-plant-container">
      <h1 className="plant-name">{plant?.name}</h1>
      <Link to="/Sdaily">
        <button className="imgbtn">Update Image</button>
      </Link>

      <div className="image-tiles">
        {sliderImages.map((image, index) => (
          <div
            key={index}
            className="image-tile"
            onClick={() => handleTileClick(index)}
          >
            <img
              src={`${Image_Based_URL}${image.image_url}`} // Updated image URL
              alt={`Plant ${index}`}
              className="tile-image"
            />
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
      {/* Chat Box Toggle Button */}
      <button className="chat-box-toggle-btn" onClick={toggleChatBox}>
        💬
      </button>

      <div
        className={`overlay ${showChatBox ? "open" : ""}`}
        onClick={toggleChatBox}
      ></div>

      {/* Chat Box */}
      <div className={`chat-box-container ${showChatBox ? "open" : ""}`}>
        <ChatBox plantId={plant_id} />
      </div>

      {/* Slider Popup */}
      {showSlider && (
        <div className="slider-popup" onClick={closeSlider}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <Slider {...sliderSettings} initialSlide={sliderIndex}>
              {sliderImages.map((image, index) => (
                <div key={index}>
                  <img
                    src={`${Image_Based_URL}${image.image_url}`} // Updated image URL
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

export default Solor;
