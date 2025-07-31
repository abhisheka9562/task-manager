package com.abs.to_do.service;

import com.abs.to_do.entity.Category;

import java.util.List;

public interface CategoryService {
    public List<Category> getAll();
    public Category createCategory(Category category);
}
