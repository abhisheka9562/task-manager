import React, { useEffect, useState } from 'react';
import TaskCard from './TaskCard';
import { API_PATHS } from '../apiPaths';

function TaskList({ filterStatus, categoryId, onEdit }) {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState({}); // categoryId -> categoryName

  // Fetch tasks based on filters
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
      })
      .catch(() => alert('Failed to load categories'));
  };

  useEffect(() => {
    fetchTasks();
  }, [filterStatus, categoryId]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCompleteChange = (id) =>
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));

  const handleDelete = (id) =>
    setTasks(prev => prev.filter(t => t.id !== id));

  return (
    <div className="task-list">
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          categoryName={categories[task.categoryId] || 'Unknown'}
          onCompleteChange={handleCompleteChange}
          onDelete={handleDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}

export default TaskList;
