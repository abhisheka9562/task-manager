package com.abs.to_do.impl;

import com.abs.to_do.entity.Task;
import com.abs.to_do.repository.CategoryRepository;
import com.abs.to_do.repository.TaskRepository;
import com.abs.to_do.service.TaskService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskServiceImpl implements TaskService {
    private final TaskRepository taskRepository;
    private final CategoryRepository categoryRepository;

    public TaskServiceImpl(TaskRepository taskRepository, CategoryRepository categoryRepository) {
        this.taskRepository = taskRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<Task> getTasksByFilter(Boolean completed, Long categoryId) {
        if (completed != null && categoryId != null) {
            return taskRepository.findByCompletedAndCategoryIdOrderByDeadlineAsc(completed, categoryId);
        } else if (completed != null) {
            return taskRepository.findByCompletedOrderByDeadlineAsc(completed);
        } else if (categoryId != null) {
            return taskRepository.findByCategoryIdOrderByDeadlineAsc(categoryId);
        } else {
            return taskRepository.findAllByOrderByDeadlineAsc();
        }
    }

    // Create a new task
    @Override
    public Task createTask(Task task) {
        Long categoryId = task.getCategoryId();

        // Validate categoryId
        if (categoryId == null || !categoryRepository.existsById(categoryId)) {
            throw new IllegalArgumentException("Invalid categoryId: " + categoryId);
        }

        // Save the task
        return taskRepository.save(task);
    }

    // Delete task by ID
    @Override
    public void deleteTaskById(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new EntityNotFoundException("Task with ID " + id + " not found");
        }
        taskRepository.deleteById(id);
    }

    // Update task by ID
    @Override
    public Task updateTaskById(Long id, Task updatedTask) {
        Task existingTask = taskRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Task with ID " + id + " not found"));

        existingTask.setTitle(updatedTask.getTitle());
        existingTask.setDescription(updatedTask.getDescription());
        existingTask.setCategoryId(updatedTask.getCategoryId());
        existingTask.setDeadline(updatedTask.getDeadline());
        existingTask.setCompleted(updatedTask.isCompleted());
        return taskRepository.save(existingTask);
    }

    // Update task completion
    @Override
    public Task updateCompletionStatus(Long id, boolean completed){
        Task existingTask = taskRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Task with ID " + id + " not found"));
        existingTask.setCompleted(completed);
        return taskRepository.save(existingTask);
    }

}
