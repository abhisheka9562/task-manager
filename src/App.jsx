import React, { useState } from 'react';
import Header from './components/Header';
import AddTaskButton from './components/AddTaskButton';
import TaskForm from './components/TaskForm';
import FilterButtons from './components/FilterButtons';
import CategoryDropdown from './components/CategoryDropdown';
import TaskList from './components/TaskList';
import './App.css';

function App() {
  // Controls whether the task form popup is open
  const [isTaskFormOpen, setTaskFormOpen] = useState(false);
  
  // Current filter for completed/uncompleted/all tasks
  const [filterStatus, setFilterStatus] = useState('Uncompleted');
  
  // Current filter for category by ID
  const [categoryId, setCategoryId] = useState('');
  
  // Holds the task object when editing, null when creating a new task
  const [editingTask, setEditingTask] = useState(null);

  // Called when "Add Task" button is clicked — opens form for creating new task
  const openNewTaskForm = () => {
    setEditingTask(null); // clear editing task (create mode)
    setTaskFormOpen(true);
  };

  // Called when edit button is clicked on a task — opens form with task data to edit
  const handleEditTask = (task) => {
    setEditingTask(task);
    setTaskFormOpen(true);
  };

  // Called after a task is created or updated successfully
  // Closes the form and can trigger refreshing task list if needed
  const handleTaskSaved = () => {
    setTaskFormOpen(false);
    setEditingTask(null);
    // You can add refresh logic here if your TaskList fetches externally
  };

  // Close form without saving, reset editing state
  const handleCloseForm = () => {
    setTaskFormOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="app-container">
      <Header title="Task Manager" />
      
      {/* Button to open task form for new task */}
      <AddTaskButton onClick={openNewTaskForm} />
      
      {/* Task form popup for creating or editing tasks */}
      {isTaskFormOpen && (
        <TaskForm
          task={editingTask}          // Pass task to edit or null to create
          onClose={handleCloseForm}   // Close form handler
          onTaskCreated={handleTaskSaved} // Callback for create success
          onTaskUpdated={handleTaskSaved} // Callback for update success
        />
      )}

      {/* Filter buttons for task completion status */}
      <FilterButtons selected={filterStatus} onChange={setFilterStatus} />
      
      {/* Dropdown to filter tasks by category */}
      <CategoryDropdown value={categoryId} onChange={e => setCategoryId(e.target.value)} />
      
      {/* Task list showing filtered tasks, passes edit handler */}
      <TaskList
        filterStatus={filterStatus}
        categoryId={categoryId}
        onEdit={handleEditTask}    // Pass edit handler to TaskList
      />
    </div>
  );
}

export default App;
