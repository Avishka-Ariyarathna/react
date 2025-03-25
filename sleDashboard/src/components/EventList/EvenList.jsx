import React, { useState, useEffect } from "react";
import axios from "axios";
import "./eventlist.scss"; // Import the SCSS file for styling

// Replace this with your actual server URL

const API_BASE_URL = "http://localhost:4000/api";

const EventTable = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/events`, {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        });
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "Invalid Date";

    // Replace space with 'T' to ensure correct parsing
    const formattedString = dateTimeString.replace(" ", "T");
    const eventDate = new Date(formattedString);

    if (isNaN(eventDate.getTime())) return "Invalid Date";

    return eventDate.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="event-table-container">
      <h1 className="title">Upcoming Events</h1>

      <div className="event-list">
        {events.length > 0 ? (
          events.map((event) => (
            <div
              key={event.id}
              className="event-row"
              style={{ backgroundColor: event.color || "#f0f0f0" }}
            >
              <div className="event-info">
                <h2 className="event-name">{event.title}</h2>

                <p className="event-date">
                  <strong>Date:</strong> {formatDateTime(event.start)}
                </p>

                <p className="event-location">{event.location}</p>
                <p className="event-description">{event.description}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="no-events">No events found</p>
        )}
      </div>
    </div>
  );
};

export default EventTable;
