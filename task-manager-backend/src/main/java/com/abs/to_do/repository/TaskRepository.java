package com.abs.to_do.repository;

import com.abs.to_do.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findAllByOrderByDeadlineAsc();

    List<Task> findByCompletedOrderByDeadlineAsc(boolean completed);

    List<Task> findByCategoryIdOrderByDeadlineAsc(Long categoryId);

    List<Task> findByCompletedAndCategoryIdOrderByDeadlineAsc(boolean completed, Long categoryId);
}
