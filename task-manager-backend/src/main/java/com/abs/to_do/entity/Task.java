package com.abs.to_do.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;


import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name= "tasks")
public class Task
{
    public Task(Long id, String title, String description, Long categoryId, LocalDate deadline, boolean completed) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.categoryId = categoryId;
        this.deadline = deadline;
        this.completed = completed;
    }

    public Task() {
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title is required")
    @Size(max = 50, message = "Title should not exceed 50 characters")
    private String title;

    @Size(max = 100, message = "Description should not exceed 100 characters")
    private String description;

    @NotNull(message = "Category is required")
    private Long categoryId;

    @NotNull(message = "Deadline is required")
    private LocalDate deadline;

    private boolean completed=false;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public @NotBlank(message = "Title is required") @Size(max = 50, message = "Title should not exceed 50 characters") String getTitle() {
        return title;
    }

    public void setTitle(@NotBlank(message = "Title is required") @Size(max = 50, message = "Title should not exceed 50 characters") String title) {
        this.title = title;
    }

    public @Size(max = 100, message = "Description should not exceed 100 characters") String getDescription() {
        return description;
    }

    public void setDescription(@Size(max = 100, message = "Description should not exceed 100 characters") String description) {
        this.description = description;
    }

    public @NotNull(message = "Category is required") Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(@NotNull(message = "Category is required") Long categoryId) {
        this.categoryId = categoryId;
    }

    public @NotNull(message = "Deadline is required") LocalDate getDeadline() {
        return deadline;
    }

    public void setDeadline(@NotNull(message = "Deadline is required") LocalDate deadline) {
        this.deadline = deadline;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }
}
