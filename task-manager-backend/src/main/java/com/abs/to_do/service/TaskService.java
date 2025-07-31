package com.abs.to_do.service;

import com.abs.to_do.entity.Task;

import java.util.List;

public interface TaskService
{
    public List<Task> getTasksByFilter(Boolean completed, Long categoryId);
    public Task createTask(Task task);
    public void deleteTaskById(Long id);
    public Task updateTaskById(Long id, Task updatedTask);
    public Task updateCompletionStatus(Long id, boolean completed);
}
