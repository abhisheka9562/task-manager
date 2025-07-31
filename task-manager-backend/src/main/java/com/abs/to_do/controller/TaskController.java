package com.abs.to_do.controller;

import com.abs.to_do.service.TaskService;
import com.abs.to_do.entity.Task;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/tasks")
public class TaskController {
    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public List<Task> getTasks(
            @RequestParam(required = false) Boolean completed,
            @RequestParam(required = false) Long categoryId) {

        return taskService.getTasksByFilter(completed, categoryId);
    }



    // Create a new task
    @PostMapping
    public ResponseEntity<Task> createTask(@Valid @RequestBody Task task) {
        Task createdTask = taskService.createTask(task);
        return ResponseEntity.ok(createdTask);
    }

    // Update existing task by ID
    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @Valid @RequestBody Task task) {
        Task updatedTask = taskService.updateTaskById(id, task);
        return ResponseEntity.ok(updatedTask);
    }

    // Update only the completed status of a task
    @PatchMapping("/{id}")
    public ResponseEntity<Task> updateTaskCompletionStatus(@PathVariable Long id, @RequestParam boolean completed) {
        Task updatedTask = taskService.updateCompletionStatus(id, completed);
        return ResponseEntity.ok(updatedTask);
    }


    // Delete task by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTaskById(id);
        return ResponseEntity.noContent().build();
    }
}
