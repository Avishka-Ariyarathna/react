import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import axios from "axios";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Grid,
  MenuItem,
  DialogActions,
} from "@mui/material";
import styles from "./CalendarScheduler.module.scss";

// Replace this with your actual server URL

const API_BASE_URL = "http://localhost:4000/api";

const localizer = momentLocalizer(moment);

const CalendarScheduler = () => {
  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: new Date(),
    end: new Date(),
    description: "",
    color: "#ffcc00",
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/events`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });
      setEvents(
        response.data.map((event) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        }))
      );
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleSelect = ({ start, end }) => {
    setNewEvent({ ...newEvent, start, end });
    setOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`${API_BASE_URL}/events`, newEvent);
      setOpen(false);
      fetchEvents();
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const handleDelete = async () => {
    if (!selectedEvent) return;
    try {
      await axios.delete(`${API_BASE_URL}/events/${selectedEvent.id}`);
      setSelectedEvent(null);
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  // Custom Toolbar Component
  const CustomToolbar = (toolbar) => {
    const goToToday = () => {
      toolbar.onNavigate("TODAY");
    };

    const goToPrevious = () => {
      toolbar.onNavigate("PREV");
    };

    const goToNext = () => {
      toolbar.onNavigate("NEXT");
    };

    return (
      <div className={styles.toolbar}>
        <Button onClick={goToToday} className={styles.toolbarButton}>
          Today
        </Button>
        <Button onClick={goToPrevious} className={styles.toolbarButton}>
          Back
        </Button>
        <Button onClick={goToNext} className={styles.toolbarButton}>
          Next
        </Button>
        <span className={styles.toolbarTitle}>
          {moment(toolbar.date).format("MMMM YYYY")}
        </span>
      </div>
    );
  };

  return (
    <div className={styles.calendarContainer}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelect}
        onSelectEvent={handleEventClick}
        style={{ height: "100%" }}
        components={{
          toolbar: CustomToolbar, // Use custom toolbar
        }}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: event.color,
            borderRadius: "8px",
            padding: "5px",
            color: "#fff",
            fontWeight: "bold",
          },
          className: styles.event,
        })}
        dayPropGetter={(date) => ({
          className: styles.dayCell, // Custom day cell class
          style: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            fontSize: "16px",
            fontWeight: "bold",
          },
          children: (
            <div className={styles.dayNumber}>
              {moment(date).format("D")} {/* Show day number */}
            </div>
          ),
        })}
      />

      {/* Add Event Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle className={styles.dialogTitle}>Add Event</DialogTitle>
        <DialogContent className={styles.dialogContent}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Event Title"
                name="title"
                value={newEvent.title}
                onChange={handleChange}
                required
                className={styles.textField}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Start Date"
                type="datetime-local"
                name="start"
                value={moment(newEvent.start).format("YYYY-MM-DDTHH:mm")}
                onChange={handleChange}
                required
                className={styles.textField}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="End Date"
                type="datetime-local"
                name="end"
                value={moment(newEvent.end).format("YYYY-MM-DDTHH:mm")}
                onChange={handleChange}
                required
                className={styles.textField}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={3}
                value={newEvent.description}
                onChange={handleChange}
                className={styles.textField}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Event Color"
                name="color"
                value={newEvent.color}
                onChange={handleChange}
                className={styles.colorPicker}
              >
                <MenuItem value="#4A90E2">Soft Blue</MenuItem>
                <MenuItem value="#B0B0B0">Light Gray</MenuItem>
                <MenuItem value="#7ED321">Soft Green</MenuItem>
                <MenuItem value="#6F7C99">Slate Blue</MenuItem>
                <MenuItem value="#9E9E9E">Warm Gray</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                fullWidth
                onClick={handleSubmit}
                className={styles.addButton}
              >
                Add Event
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      {/* Event Details Dialog */}
      <Dialog open={!!selectedEvent} onClose={() => setSelectedEvent(null)}>
        <DialogTitle className={styles.dialogTitle}>Event Details</DialogTitle>
        <DialogContent className={styles.dialogContent}>
          {selectedEvent && (
            <>
              <p>
                <strong>Title:</strong> {selectedEvent.title}
              </p>
              <p>
                <strong>Start:</strong>{" "}
                {moment(selectedEvent.start).format("MMMM Do YYYY, h:mm A")}
              </p>
              <p>
                <strong>End:</strong>{" "}
                {moment(selectedEvent.end).format("MMMM Do YYYY, h:mm A")}
              </p>
              <p>
                <strong>Description:</strong> {selectedEvent.description}
              </p>
            </>
          )}
        </DialogContent>
        <DialogActions className={styles.dialogActions}>
          <Button
            onClick={() => setSelectedEvent(null)}
            className={styles.closeButton}
          >
            Close
          </Button>
          <Button onClick={handleDelete} className={styles.deleteButton}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CalendarScheduler;
