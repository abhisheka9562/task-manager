import React, { useState, useEffect, useRef } from 'react';
import { API_PATHS } from '../apiPaths';
import CategoryDropdown from './CategoryDropdown';

function TaskForm({ task, onClose, onTaskCreated, onTaskUpdated }) {
  // State initialized empty or from existing task (edit mode)
  const [title, setTitle] = useState(task ? task.title : '');
  const [description, setDescription] = useState(task ? task.description : '');
  const [categoryId, setCategoryId] = useState(task ? task.categoryId : '');
  const [deadline, setDeadline] = useState(task ? task.deadline : '');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [errors, setErrors] = useState({});
  const categoryDropdownRef = useRef();

  const todayStr = new Date().toISOString().split('T')[0];

  // If task prop changes (e.g., opening form for different task), prefill inputs
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setCategoryId(task.categoryId);
      setDeadline(task.deadline);
    }
  }, [task]);

  // Validation logic
  const validate = () => {
    const errs = {};
    if (!title.trim()) errs.title = 'Title is required';
    if (description.length > 100) errs.description = 'Max 100 characters allowed';
    if (!categoryId) errs.categoryId = 'Category is required';
    if (!deadline) errs.deadline = 'Deadline is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Add new category POST
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
        categoryDropdownRef.current?.refresh(); // Optional if you implement refresh in dropdown
      })
      .catch(() => alert('Failed to add category'));
  };

  // Submit handler handles create or update based on presence of `task`
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const taskPayload = {
      title,
      description,
      categoryId,
      deadline,
      completed: task ? task.completed : false, // Keep existing completed if editing
    };

    if (task) {
      // Update existing task - PUT
      fetch(API_PATHS.TASKS_BY_ID(task.id), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskPayload),
      })
        .then(res => {
          if (!res.ok) throw new Error('Failed to update task');
          return res.json();
        })
        .then(updatedTask => {
          if (onTaskUpdated) onTaskUpdated(updatedTask);
          onClose();
        })
        .catch(err => alert(err.message));
    } else {
      // Create new task - POST
      fetch(API_PATHS.TASKS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskPayload),
      })
        .then(res => {
          if (!res.ok) throw new Error('Failed to create task');
          return res.json();
        })
        .then(createdTask => {
          if (onTaskCreated) onTaskCreated(createdTask);
          onClose();
        })
        .catch(err => alert(err.message));
    }
  };

  return (
    <div className="modal">
      <form onSubmit={handleSubmit} className="task-form">
        {/* Change title based on create or update */}
        <h2>{task ? 'Update Task' : 'Create Task'}</h2>

        <label>
          Title*:
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          {errors.title && <div className="error">{errors.title}</div>}
        </label>

        <label>
          Description (max 100 chars):
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            maxLength={100}
          />
          {errors.description && <div className="error">{errors.description}</div>}
        </label>

        <label>
          Category*:
          <CategoryDropdown
            ref={categoryDropdownRef}
            value={categoryId}
            onChange={e => {
              if (e.target.value === 'add_new') {
                setShowNewCategoryInput(true);
                setCategoryId('');
              } else {
                setShowNewCategoryInput(false);
                setCategoryId(e.target.value);
              }
            }}
            includeAddNew={true}
          />
          {errors.categoryId && <div className="error">{errors.categoryId}</div>}
        </label>

        {showNewCategoryInput && (
          <div>
            <input
              type="text"
              placeholder="New category name"
              value={newCategoryName}
              onChange={e => setNewCategoryName(e.target.value)}
            />
            <button type="button" onClick={handleAddCategory}>Add Category</button>
          </div>
        )}

        <label>
          Deadline*:
          <input
            type="date"
            value={deadline}
            onChange={e => setDeadline(e.target.value)}
            min={todayStr}
          />
          {errors.deadline && <div className="error">{errors.deadline}</div>}
        </label>

        <div className="form-buttons">
          {/* Button text changes based on create or update */}
          <button type="submit">{task ? 'Update Task' : 'Create Task'}</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default TaskForm;
