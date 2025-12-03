import React, { useState, useEffect } from "react";
import moment from "moment";
import Popup from "react-popup";

const EventPopup = ({ selectedDate, onClose, onSave, eventToEdit }) => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    if (eventToEdit) {
      setTitle(eventToEdit.title);
      setLocation(eventToEdit.location);
    }
  }, [eventToEdit]);

  const handleSave = () => {
    const newEvent = {
      id: eventToEdit ? eventToEdit.id : Date.now(),
      title,
      location,
      start: selectedDate,
      end: selectedDate,
    };
    onSave(newEvent);
    onClose();
  };

  return (
    <Popup open={true} closeOnDocumentClick onClose={onClose}>
      <div className="popup-content">
        <h2>{eventToEdit ? "Edit Event" : "Create Event"}</h2>
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
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </Popup>
  );
};

export default EventPopup;
