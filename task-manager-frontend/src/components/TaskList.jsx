import React, { useEffect, useState } from 'react';
import TaskCard from './TaskCard';
import { API_PATHS } from '../apiPaths';

function TaskList({ tasks,categories,onEdit,onRefresh }) {
  // categoryId -> categoryName

  // Fetch tasks based on filters
  
  
  return (
    <div className="task-list">
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          categoryName={categories[task.categoryId] || 'Unknown'}
          onEdit={onEdit}
          onRefresh={onRefresh}
        />
      ))}
    </div>
  );
}

export default TaskList;