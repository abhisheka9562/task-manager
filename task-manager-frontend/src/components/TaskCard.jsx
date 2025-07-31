import React from 'react';
import { API_PATHS } from '../apiPaths';

function TaskCard({ task, categoryName, onEdit, onRefresh, onDelete, onCompleteChange }) {
  const isOverdue = new Date(task.deadline) < new Date() && !task.completed;

  const handleCheckboxChange = () => {
    fetch(API_PATHS.TASKS_UPDATE_COMPLETED(task.id, !task.completed), { method: 'PATCH' })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to update');
        }
        if (onCompleteChange) onCompleteChange(task.id);
        if (onRefresh) onRefresh(); // only refresh if successful
      })
      .catch(() => alert('Failed to update completion'));
  };

  const handleDelete = () => {
    fetch(API_PATHS.TASKS_BY_ID(task.id), { method: 'DELETE' })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to delete');
        }
        if (onDelete) onDelete(task.id);
        if (onRefresh) onRefresh(); // only refresh if successful
      })
      .catch(() => alert('Failed to delete task'));
  };


  return (
    <div className={`card mb-3 ${isOverdue ? 'border border-danger bg-light' : ''}`}>
      <div className="card-body d-flex align-items-start">
        <input
          type="checkbox"
          className="form-check-input me-3 mt-1"
          checked={task.completed}
          onChange={handleCheckboxChange}
          style={{ accentColor: '#11bcb0' }}
        />
        <div className="flex-grow-1">
          <h5 className="card-title mb-1">{task.title}</h5>
          <p className="card-text mb-1">{task.description}</p>
          <small className="text-muted d-block">Category: {categoryName}</small>
          <small className="text-muted d-block">Deadline: {task.deadline}</small>
        </div>
        <div className="ms-3 d-flex flex-column gap-2">
          <button
            className="btn btn-sm"
            style={{ border: '1px solid #11bcb0', color: '#11bcb0' }}
            onClick={() => onEdit(task)}
          >
            <i className="bi bi-pencil-fill"></i>
          </button>
          <button
            className="btn btn-sm"
            style={{ border: '1px solid #11bcb0', color: '#11bcb0' }}
            onClick={handleDelete}
          >
            <i className="bi bi-trash-fill"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;  