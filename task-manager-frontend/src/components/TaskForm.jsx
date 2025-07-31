// TaskForm.jsx
import React, { useState, useEffect, useRef } from 'react';
import { API_PATHS } from '../apiPaths';
import CategoryDropdown from './CategoryDropdown';

function TaskForm({ task, onClose, onTaskCreated, onTaskUpdated, onCategoryAdded }) {
  const [title, setTitle] = useState(task ? task.title : '');
  const [description, setDescription] = useState(task ? task.description : '');
  const [categoryId, setCategoryId] = useState(task ? task.categoryId : '');
  const [deadline, setDeadline] = useState(task ? task.deadline : '');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [errors, setErrors] = useState({});
  const categoryDropdownRef = useRef();

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setCategoryId(task.categoryId);
      setDeadline(task.deadline);
    }
  }, [task]);

  const validate = () => {
    const errs = {};
    if (!title.trim()) errs.title = 'Title is required';
    if (description.length > 100) errs.description = 'Max 100 characters allowed';
    if (!categoryId) errs.categoryId = 'Category is required';
    if (!deadline) errs.deadline = 'Deadline is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const clearError = (field) => {
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleAddCategory = () => {
  if (!newCategoryName.trim()) return;

  fetch(API_PATHS.CATEGORIES, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: newCategoryName.trim() }),
  })
    .then(res => res.json())
    .then(newCat => {
      setCategoryId(newCat.id);
      setShowNewCategoryInput(false);
      setNewCategoryName('');
      categoryDropdownRef.current?.refresh();
      clearError('categoryId');
      if (onCategoryAdded) onCategoryAdded();  //  Tell App.js to refresh categories
    })
    .catch(() => alert('Failed to add category'));
};


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const taskPayload = {
      title,
      description,
      categoryId,
      deadline,
      completed: task ? task.completed : false,
    };

    const requestOptions = {
      method: task ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskPayload),
    };

    const endpoint = task ? API_PATHS.TASKS_BY_ID(task.id) : API_PATHS.TASKS;

    fetch(endpoint, requestOptions)
      .then(res => {
        if (!res.ok) throw new Error(`Failed to ${task ? 'update' : 'create'} task`);
        return res.json();
      })
      .then(savedTask => {
        task ? onTaskUpdated?.(savedTask) : onTaskCreated?.(savedTask);
        onClose();
      })
      .catch(err => alert(err.message));
  };

  return (
    <div className="modal show d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit} className="p-4">
            <h5 className="modal-title mb-3">{task ? 'Update Task' : 'Create Task'}</h5>

            <div className="mb-3">
              <label className="form-label">Title*</label>
              <input
                type="text"
                className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                value={title}
                onChange={e => {
                  setTitle(e.target.value);
                  if (e.target.value.trim()) clearError('title');
                }}
              />
              {errors.title && <div className="invalid-feedback">{errors.title}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">Description (max 100 chars)</label>
              <textarea
                className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                value={description}
                onChange={e => {
                  setDescription(e.target.value);
                  if (e.target.value.length <= 100) clearError('description');
                }}
                maxLength={100}
              />
              {errors.description && <div className="invalid-feedback">{errors.description}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">Category*</label>
              <div className={`form-select-wrapper ${errors.categoryId ? 'is-invalid' : ''}`}>
                <CategoryDropdown
                  ref={categoryDropdownRef}
                  value={categoryId}
                  onChange={e => {
                    const val = e.target.value;
                    if (val === 'add_new') {
                      setShowNewCategoryInput(true);
                      setCategoryId('');
                    } else {
                      setShowNewCategoryInput(false);
                      setCategoryId(val);
                      if (val) clearError('categoryId');
                    }
                  }}
                  includeAddNew={true}
                />
              </div>
              {errors.categoryId && <div className="invalid-feedback d-block">{errors.categoryId}</div>}
            </div>

            {showNewCategoryInput && (
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="New category name"
                  value={newCategoryName}
                  onChange={e => setNewCategoryName(e.target.value)}
                />
                <button
                  type="button"
                  className="custom-filter-btn"
                  onClick={handleAddCategory}
                >
                  Add Category
                </button>
              </div>
            )}

            <div className="mb-3">
              <label className="form-label">Deadline*</label>
              <input
                type="date"
                className={`form-control ${errors.deadline ? 'is-invalid' : ''}`}
                value={deadline}
                onChange={e => {
                  setDeadline(e.target.value);
                  if (e.target.value) clearError('deadline');
                }}
                min={todayStr}
              />
              {errors.deadline && <div className="invalid-feedback">{errors.deadline}</div>}
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button type="submit" className="custom-filter-btn">
                {task ? 'Update Task' : 'Create Task'}
              </button>
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TaskForm;
