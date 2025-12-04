import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Modal from "react-modal";
import "./App.css";

const localizer = momentLocalizer(moment);
Modal.setAppElement("#root");

function App() {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("all");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({ title: "", location: "" });

  useEffect(() => {
    const savedEvents = localStorage.getItem("calendarEvents");
    if (savedEvents) {
      const parsedEvents = JSON.parse(savedEvents).map((event) => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
      }));
      setEvents(parsedEvents);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("calendarEvents", JSON.stringify(events));
  }, [events]);

  const handleSelectSlot = ({ start }) => {
    setSelectedDate(start);
    setSelectedEvent(null);
    setIsEditMode(false);
    setFormData({ title: "", location: "" });
    setModalIsOpen(true);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setIsEditMode(true);
    setFormData({ title: event.title, location: event.location || "" });
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedEvent(null);
    setIsEditMode(false);
    setFormData({ title: "", location: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title && selectedDate) {
      if (isEditMode && selectedEvent) {
        updateEvent(selectedEvent, formData.title, formData.location);
      } else {
        createEvent(formData.title, formData.location);
      }
      closeModal();
    }
  };

  const createEvent = (title, location) => {
    const newEvent = {
      id: Date.now(),
      title,
      location,
      start: selectedDate,
      end: selectedDate,
      isPast: moment(selectedDate).isBefore(moment(), "day"),
    };
    setEvents([...events, newEvent]);
  };

  const updateEvent = (event, newTitle, newLocation) => {
    const updatedEvents = events.map((e) =>
      e.id === event.id ? { ...e, title: newTitle, location: newLocation } : e
    );
    setEvents(updatedEvents);
  };

  const deleteEvent = (event) => {
    setEvents(events.filter((e) => e.id !== event.id));
    closeModal();
  };

  const getFilteredEvents = () => {
    const today = moment().startOf("day");

    switch (filter) {
      case "past":
        return events.filter((event) =>
          moment(event.start).isBefore(today, "day")
        );
      case "upcoming":
        return events.filter((event) =>
          moment(event.start).isSameOrAfter(today, "day")
        );
      default:
        return events;
    }
  };

  const eventStyleGetter = (event) => {
    const isPast = moment(event.start).isBefore(moment(), "day");
    return {
      style: {
        backgroundColor: isPast ? "rgb(222, 105, 135)" : "rgb(140, 189, 76)",
        color: "white",
        border: "none",
        borderRadius: "4px",
      },
    };
  };

  return (
    <div className="App">
      <h1>Event Tracker Calendar</h1>

      <div className="filter-buttons">
        <button
          className="btn"
          onClick={() => setFilter("all")}
          style={{ backgroundColor: filter === "all" ? "#007bff" : "#6c757d" }}
        >
          All
        </button>
        <button
          className="btn"
          onClick={() => setFilter("past")}
          style={{ backgroundColor: filter === "past" ? "#007bff" : "#6c757d" }}
        >
          Past
        </button>
        <button
          className="btn"
          onClick={() => setFilter("upcoming")}
          style={{
            backgroundColor: filter === "upcoming" ? "#007bff" : "#6c757d",
          }}
        >
          Upcoming
        </button>
      </div>

      <div className="calendar-container">
        <Calendar
          localizer={localizer}
          events={getFilteredEvents()}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          selectable
          eventPropGetter={eventStyleGetter}
          popup
        />
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <div className="modal-header">
          <h2>{isEditMode ? "Edit Event" : "Create Event"}</h2>
          <button className="close-btn" onClick={closeModal}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <input
            type="text"
            placeholder="Event Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="event-input"
            required
          />
          <input
            type="text"
            placeholder="Event Location"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            className="event-input"
          />

          <div className="modal-buttons">
            {isEditMode && (
              <button
                type="button"
                className="mm-popup__btn--danger"
                onClick={() => deleteEvent(selectedEvent)}
              >
                Delete
              </button>
            )}
            <div className="mm-popup__box__footer__right-space">
              <button
                type="button"
                className="mm-popup__btn"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button type="submit" className="mm-popup__btn">
                Save
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default App;
