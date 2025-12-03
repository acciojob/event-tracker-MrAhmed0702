import React from "react";
import Calendar from "./components/Calendar";
import "./styles/App.css";

const App = () => {
  return (
    <div className="app">
      <h1>Event Tracker Calendar</h1>
      <Calendar />
    </div>
  );
};

export default App;
