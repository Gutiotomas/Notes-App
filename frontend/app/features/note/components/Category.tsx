import React, { useState, useEffect } from "react";
import "../styles/category.css";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../note/services/categoryService";
import { Button } from "~/shared/components/Button";
import { Input } from "~/shared/components/Input";

export const Category: React.FC = () => {
  // State to store the list of categories
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );

  // State to store the name of a new category being created
  const [newCategoryName, setNewCategoryName] = useState("");

  // State to store validation errors
  const [errors, setErrors] = useState<{ name?: string }>({});

  // State to store the category being edited
  const [editingCategory, setEditingCategory] = useState<{
    id: number;
    name: string;
  } | null>(null);

  // Fetch categories when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Function to validate form fields
  const validateFields = (name: string) => {
    const newErrors: { name?: string } = {};

    // Validate name field
    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (name.length > 20) {
      newErrors.name = "Name must not exceed 20 characters";
    } else if (
      categories.some(
        (category) =>
          category.name.toLowerCase() === name.trim().toLowerCase() &&
          (!editingCategory || category.id !== editingCategory.id)
      )
    ) {
      newErrors.name = "Name already exists";
    }

    // Update errors state
    setErrors(newErrors);

    // Return true if no errors, false otherwise
    return Object.keys(newErrors).length === 0;
  };

  // Handle creating a new category
  const handleCreateCategory = async () => {
    if (!validateFields(newCategoryName)) {
      return; // Exit if validation fails
    }

    try {
      const newCategory = await createCategory(newCategoryName);
      setCategories((prev) => [...prev, newCategory]); // Add new category to the list
      setNewCategoryName(""); // Clear input field
      setErrors({}); // Clear errors
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  // Handle updating an existing category
  const handleUpdateCategory = async () => {
    if (!editingCategory || !validateFields(editingCategory.name)) {
      return; // Exit if validation fails
    }

    try {
      const updatedCategory = await updateCategory(
        editingCategory.id,
        editingCategory.name
      );
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === updatedCategory.id ? updatedCategory : cat
        )
      ); // Update the category in the list
      setEditingCategory(null); // Exit edit mode
      setErrors({}); // Clear errors
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  // Handle deleting a category
  const handleDeleteCategory = async (categoryId: number) => {
    try {
      await deleteCategory(categoryId);
      setCategories((prev) => prev.filter((cat) => cat.id !== categoryId)); // Remove category from the list

      // If the deleted category is the one being edited, reset the editing state
      if (editingCategory && editingCategory.id === categoryId) {
        setEditingCategory(null); // Exit edit mode
        setErrors({}); // Clear errors
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div className="category-container">
      <h1>Manage Categories</h1>

      {/* List of categories */}
      <div className="category-list">
        {categories.map((category) => (
          <div key={category.id} className="cat-item">
            <span className="cat">{category.name}</span>
            <Button
              text="Edit"
              onClick={() => setEditingCategory(category)} // Enter edit mode
              className="edit-button"
            />
            <Button
              text="Delete"
              onClick={() => handleDeleteCategory(category.id)} // Delete category
              className="delete-button"
            />
          </div>
        ))}
      </div>

      {/* Edit category form */}
      {editingCategory ? (
        <div className="edit-category">
          <Input
            label="Name"
            placeholder="Edit category name"
            name="edit"
            type="text"
            value={editingCategory.name}
            onChange={(e) =>
              setEditingCategory({ ...editingCategory, name: e.target.value })
            }
            maxLength={20}
          />
          {errors.name && <p className="error-text">{errors.name}</p>}
          <Button
            text="Update"
            onClick={handleUpdateCategory} // Update category
            className="update-button"
          />
          <Button
            text="Cancel"
            className="cancel-button"
            onClick={() => {
              setEditingCategory(null); // Exit edit mode
              setErrors({}); // Clear errors
            }}
          />
        </div>
      ) : (
        // Create category form
        <div className="create-category">
          <Input
            label="Name"
            name="create"
            maxLength={20}
            type="text"
            placeholder="Enter category name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)} // Update input value
          />
          {errors.name && <p className="error-text">{errors.name}</p>}
          <Button
            text="Create"
            className="create-button"
            onClick={handleCreateCategory} // Create new category
          />
        </div>
      )}
    </div>
  );
};
