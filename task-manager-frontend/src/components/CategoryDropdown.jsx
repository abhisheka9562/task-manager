// CategoryDropdown.jsx
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { API_PATHS } from '../apiPaths';

const CategoryDropdown = forwardRef(({ value, onChange, includeAddNew = false,  }, ref) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = () => {
    setLoading(true);
    fetch(API_PATHS.CATEGORIES)
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching categories:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCategories(); // fetch only once when dropdown mounts
  }, []);

  useImperativeHandle(ref, () => ({
    refresh: fetchCategories
  }));

  if (loading) {
    return <select disabled><option>Loading...</option></select>;
  }

  return (
    <select className="form-select custom-select" value={value} onChange={onChange}>
      <option value="">-- Select Category --</option>
      {categories.map(cat => (
        <option key={cat.id} value={cat.id}>{cat.name}</option>
      ))}
      {includeAddNew && <option value="add_new">+ Add new category</option>}
    </select>
  );
});

export default CategoryDropdown;
