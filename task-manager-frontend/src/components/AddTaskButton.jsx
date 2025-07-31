import React from 'react';

function AddTaskButton({ onClick }) {
  return (
    <button
      className="custom-filter-btn"
      onClick={onClick}
    >
      Add Task
    </button>
  );
}

export default AddTaskButton;
