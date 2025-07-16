import React from 'react';
import { API_PATHS } from '../apiPaths';

function TaskCard({ task, categoryName, onCompleteChange, onDelete, onEdit }) {
  const isOverdue = new Date(task.deadline) < new Date() && !task.completed;

  const handleCheckboxChange = () => {
    fetch(API_PATHS.TASKS_UPDATE_COMPLETED(task.id, !task.completed), { method: 'PATCH' })
      .then(() => onCompleteChange(task.id))
      .catch(() => alert('Failed to update completion'));
  };

  const handleDelete = () => {
    fetch(API_PATHS.TASKS_BY_ID(task.id), { method: 'DELETE' })
      .then(() => onDelete(task.id))
      .catch(() => alert('Failed to delete task'));
  };

  return (
    <div className={`task-card ${isOverdue ? 'overdue' : ''}`}>
      <input type="checkbox" checked={task.completed} onChange={handleCheckboxChange} />
      <div className="task-content">
        <h4>{task.title}</h4>
        <p>{task.description}</p>
        <small>Category: {categoryName}</small>
        <small>Deadline: {task.deadline}</small>
      </div>
      <button onClick={() => onEdit(task)}>✏️</button>
      <button onClick={handleDelete}>🗑️</button>
    </div>
  );
}

export default TaskCard;
