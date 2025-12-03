import React, { useState, useEffect } from "react";
import BigCalendar from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import EventPopup from "./EventPopup";
import FilterButtons from "./FilterButtons";

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    // Load events from local storage or an API
    const savedEvents = JSON.parse(localStorage.getItem("events")) || [];
    setEvents(savedEvents);
  }, []);

  const addEvent = (newEvent) => {
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents));
  };

  const updateEvent = (updatedEvent) => {
    const updatedEvents = events.map(event =>
      event.id === updatedEvent.id ? updatedEvent : event
    );
    setEvents(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents));
  };

  const deleteEvent = (eventId) => {
    const updatedEvents = events.filter(event => event.id !== eventId);
    setEvents(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents));
  };

  const filteredEvents = events.filter(event => {
    if (filter === "past") {
      return moment(event.start).isBefore(moment(), "day");
    } else if (filter === "upcoming") {
      return moment(event.start).isAfter(moment(), "day");
    }
    return true;
  });

  const eventStyleGetter = (event) => {
    const backgroundColor = moment(event.start).isBefore(moment(), "day")
      ? "rgb(222, 105, 135)"
      : "rgb(140, 189, 76)";
    return { style: { backgroundColor } };
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowPopup(true);
  };

  return (
    <div>
      <FilterButtons setFilter={setFilter} />
      <BigCalendar
        events={filteredEvents}
        onSelectSlot={({ start }) => handleDateClick(start)}
        selectable
        eventPropGetter={eventStyleGetter}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
      {showPopup && (
        <EventPopup
          selectedDate={selectedDate}
          onClose={() => setShowPopup(false)}
          onSave={addEvent}
        />
      )}
    </div>
  );
};

export default Calendar;
