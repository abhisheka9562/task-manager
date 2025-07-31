import React, { useState,useEffect,useRef } from 'react';
import Header from './components/Header';
import AddTaskButton from './components/AddTaskButton';
import TaskForm from './components/TaskForm';
import FilterButtons from './components/FilterButtons';
import CategoryDropdown from './components/CategoryDropdown';
import TaskList from './components/TaskList';
import { API_PATHS } from './apiPaths';
import './App.css';

function App() {
  const [isTaskFormOpen, setTaskFormOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('Uncompleted');
  const [categoryId, setCategoryId] = useState('');
  const [editingTask, setEditingTask] = useState(null);

  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState({}); 
  const categoryDropdownRef = useRef(); 
  const fetchTasks = () => {
    let url = API_PATHS.TASKS;
    const params = [];
    if (filterStatus !== 'All') params.push(`completed=${filterStatus === 'Completed'}`);
    if (categoryId) params.push(`categoryId=${categoryId}`);
    if (params.length) url += '?' + params.join('&');

    fetch(url)
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch(() => alert('Failed to load tasks'));
  };

  // Fetch category list and convert to map
  const fetchCategories = () => {
    fetch(API_PATHS.CATEGORIES)
      .then(res => res.json())
      .then(data => {
        const categoryMap = {};
        data.forEach(cat => {
          categoryMap[cat.id] = cat.name;
        });
        setCategories(categoryMap);
        categoryDropdownRef.current?.refresh(); 
      })
      .catch(() => alert('Failed to load categories'));
  };

 
  
  const openNewTaskForm = () => {
    setEditingTask(null);
    setTaskFormOpen(true);
  };


  const handleTaskSaved = () => {
    setTaskFormOpen(false);
    setEditingTask(null);
    fetchTasks();
  };

  const handleCloseForm = () => {
    setTaskFormOpen(false);
    setEditingTask(null);
  };

  const handleEditTask = (task) => {
  setEditingTask(task);
  setTaskFormOpen(true);
};



   useEffect(() => {
    fetchTasks();
  }, [filterStatus, categoryId]);

  useEffect(() => {
    fetchCategories();
  }, []);


  return (
    <>
      <Header />

      <main className="container px-3">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="h4 mb-0">Your Tasks</h2>
          <AddTaskButton onClick={openNewTaskForm} />
        </div>

        {isTaskFormOpen && (
          <TaskForm
            task={editingTask}
            onClose={handleCloseForm}
            onTaskCreated={handleTaskSaved}
            onTaskUpdated={handleTaskSaved}
            onCategoryAdded={fetchCategories}
          />
        )}

        <div className="d-flex flex-wrap gap-3 mb-4">
          <FilterButtons selected={filterStatus} onChange={setFilterStatus} />
          <CategoryDropdown
            ref={categoryDropdownRef}
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)
  
            }
          />
        </div>

        <TaskList
          tasks={tasks}
          categories={categories}
          onRefresh={fetchTasks}
          onEdit={handleEditTask}
        />
      </main>
    </>
  );
}

export default App;