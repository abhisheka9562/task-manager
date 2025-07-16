import React from 'react';

function FilterButtons({ selected, onChange }) {
  return (
    <div className="filter-buttons">
      {['Uncompleted', 'Completed', 'All'].map((label) => (
        <button
          key={label}
          onClick={() => onChange(label)}
          className={selected === label ? 'active' : ''}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default FilterButtons;