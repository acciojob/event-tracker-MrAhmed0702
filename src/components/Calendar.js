import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Initialize the localizer
const localizer = momentLocalizer(moment);

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [filter, setFilter] = useState('all');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [editingEvent, setEditingEvent] = useState(null);

  // Load saved events from localStorage on component mount
  useEffect(() => {
    const savedEvents = JSON.parse(localStorage.getItem('events')) || [];
    setEvents(savedEvents);
  }, []);

  // Handle event creation
  const handleSaveEvent = () => {
    if (editingEvent) {
      // Update existing event
      const updatedEvents = events.map((event) =>
        event.id === editingEvent.id ? { ...event, title, location } : event
      );
      setEvents(updatedEvents);
      localStorage.setItem('events', JSON.stringify(updatedEvents));
    } else {
      // Create a new event
      const newEvent = {
        id: Date.now(),
        title,
        location,
        start: selectedDate,
        end: selectedDate,
      };
      const updatedEvents = [...events, newEvent];
      setEvents(updatedEvents);
      localStorage.setItem('events', JSON.stringify(updatedEvents));
    }

    // Close popup after saving
    setShowPopup(false);
    setTitle('');
    setLocation('');
    setEditingEvent(null);
  };

  // Handle event deletion
  const handleDeleteEvent = () => {
    const updatedEvents = events.filter((event) => event.id !== editingEvent.id);
    setEvents(updatedEvents);
    localStorage.setItem('events', JSON.stringify(updatedEvents));
    setShowPopup(false);
    setEditingEvent(null);
  };

  // Filter events based on the selected filter
  const filteredEvents = events.filter((event) => {
    if (filter === 'past') {
      return moment(event.start).isBefore(moment(), 'day');
    } else if (filter === 'upcoming') {
      return moment(event.start).isAfter(moment(), 'day');
    }
    return true;
  });

  // Style for events (color based on past or upcoming)
  const eventStyleGetter = (event) => {
    const backgroundColor = moment(event.start).isBefore(moment(), 'day')
      ? 'rgb(222, 105, 135)'  // Past events (pink)
      : 'rgb(140, 189, 76)';   // Upcoming events (green)
    return { style: { backgroundColor } };
  };

  // Handle date click (for adding or editing events)
  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowPopup(true);
    setTitle('');  // Reset title and location on new event creation
    setLocation('');
    setEditingEvent(null);
  };

  // Handle event click (for editing or deleting an existing event)
  const handleEventClick = (event) => {
    setSelectedDate(event.start);
    setShowPopup(true);
    setTitle(event.title);
    setLocation(event.location);
    setEditingEvent(event);  // Set the event to edit
  };

  return (
    <div>
      {/* Filter Buttons */}
      <div>
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('past')}>Past</button>
        <button onClick={() => setFilter('upcoming')}>Upcoming</button>
      </div>

      {/* Calendar */}
      <Calendar
        localizer={localizer}
        events={filteredEvents}
        onSelectSlot={({ start }) => handleDateClick(start)}  // Handle date click for event creation
        onSelectEvent={handleEventClick}  // Handle event click for editing/deleting
        selectable
        eventPropGetter={eventStyleGetter}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />

      {/* Event Popup for creating/editing events */}
      {showPopup && (
        <div className="popup">
          <h2>{editingEvent ? 'Edit Event' : 'Create Event'}</h2>
          <input
            type="text"
            placeholder="Event Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Event Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <div className="popup-footer">
            <button onClick={handleSaveEvent}>
              {editingEvent ? 'Save Changes' : 'Save Event'}
            </button>
            <button onClick={() => setShowPopup(false)}>Cancel</button>
            {editingEvent && (
              <button onClick={handleDeleteEvent} className="delete-btn">
                Delete Event
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarComponent;