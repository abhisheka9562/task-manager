import React from 'react';

function FilterButtons({ selected, onChange }) {
  const labels = ['Uncompleted', 'Completed', 'All'];

  return (
    <div className="filter-buttons">
      {labels.map((label) => (
        <button
          key={label}
          onClick={() => onChange(label)}
          className={`custom-filter-btn ${selected === label ? 'active' : ''}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default FilterButtons;
