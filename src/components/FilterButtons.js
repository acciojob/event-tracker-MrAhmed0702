import React from "react";

function FilterButtons({ setFilter }) {
  return (
    <div className="filter-buttons">
      <button onClick={() => setFilter(null)}>All</button>
      <button onClick={() => setFilter("work")}>Work</button>
      <button onClick={() => setFilter("personal")}>Personal</button>
      <button onClick={() => setFilter("other")}>Other</button>
    </div>
  );
}

export default FilterButtons;
