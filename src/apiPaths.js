// src/apiPaths.js
const BASE_URL = 'http://localhost:8080/api';

export const API_PATHS = {
  TASKS: `${BASE_URL}/tasks`,
  TASKS_BY_ID: (id) => `${BASE_URL}/tasks/${id}`,
  TASKS_UPDATE_COMPLETED: (id, completed) => `${BASE_URL}/tasks/${id}?completed=${completed}`,
  CATEGORIES: `${BASE_URL}/categories`,
};
