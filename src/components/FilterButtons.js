import React from "react";

const FilterButtons = ({ setFilter }) => {
  return (
    <div className="filter-buttons">
      <button className="btn" onClick={() => setFilter("all")}>
        All
      </button>
      <button className="btn" onClick={() => setFilter("past")}>
        Past
      </button>
      <button className="btn" onClick={() => setFilter("upcoming")}>
        Upcoming
      </button>
    </div>
  );
};

export default FilterButtons;
