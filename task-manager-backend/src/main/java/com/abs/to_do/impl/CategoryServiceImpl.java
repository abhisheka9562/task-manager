package com.abs.to_do.impl;

import com.abs.to_do.entity.Category;
import com.abs.to_do.repository.CategoryRepository;
import com.abs.to_do.service.CategoryService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService
{
    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<Category> getAll(){
        return categoryRepository.findAllByOrderByNameAsc();
    }

    @Override
    public Category createCategory(Category category)
    {
        return categoryRepository.save(category);
    }


}
