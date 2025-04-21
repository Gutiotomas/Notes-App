import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/note.css";
import { createNote } from "../services/noteService";
import { getCategories } from "../services/categoryService";
import { Button } from "~/shared/components/Button";
import { Input } from "~/shared/components/Input";
import { TextArea } from "~/shared/components/TextArea";

// Component for creating a new note
export const Note: React.FC = () => {
  // State variables for form fields, categories, and errors
  const [title, setTitle] = useState(""); // Note title
  const [body, setBody] = useState(""); // Note description
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  ); // List of categories
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]); // Selected category IDs
  const [errors, setErrors] = useState<{ title?: string; body?: string }>({}); // Validation errors
  const [isLoading, setIsLoading] = useState(true); // Loading state for categories
  const navigate = useNavigate(); // Navigation hook

  // Fetch categories when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories(); // Fetch categories from the service
        setCategories(data); // Set categories in state
      } catch (error) {
        console.error("Error fetching categories:", error); // Log any errors
      } finally {
        setIsLoading(false); // Set loading to false after fetching
      }
    };
    fetchCategories();
  }, []);

  // Handle category selection/deselection
  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategories(
      (prev) =>
        prev.includes(categoryId)
          ? prev.filter((id) => id !== categoryId) // Remove category if already selected
          : [...prev, categoryId] // Add category if not selected
    );
  };

  // Validate form fields
  const validateFields = () => {
    const newErrors: { title?: string; body?: string } = {};

    // Validate title
    if (!title.trim()) {
      newErrors.title = "Title is required";
    } else if (title.length > 20) {
      newErrors.title = "Title must not exceed 20 characters";
    }

    setErrors(newErrors); // Set validation errors in state
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission

    if (!validateFields()) {
      return; // Exit if validation fails
    }

    try {
      await createNote(title, body, selectedCategories); // Create note using the service
      navigate("/home"); // Navigate to the home page on success
    } catch (error) {
      console.error("Error creating note:", error); // Log any errors
    }
  };

  return (
    <div className="note-container">
      <h1>Create Note</h1>
      <form onSubmit={handleSubmit}>
        {/* Input for note title */}
        <Input
          label="Title"
          type="text"
          name="title"
          placeholder="Enter note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={20}
        />
        {errors.title && <p className="error-text">{errors.title}</p>}

        {/* Text area for note description */}
        <TextArea
          label="Description"
          name="body"
          placeholder="Enter note description"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          rows={3}
          cols={30}
          maxLength={600}
        />

        {/* Category selection */}
        <div className="categories">
          <h3>Categories</h3>
          {isLoading ? (
            <p>Loading categories...</p> // Show loading message while fetching
          ) : categories.length > 0 ? (
            <div className="categories-list">
              {categories.map((category) => (
                <div key={category.id} className="category-item">
                  <input
                    type="checkbox"
                    id={`category-${category.id}`}
                    value={category.id}
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => handleCategoryChange(category.id)}
                  />
                  <label htmlFor={`category-${category.id}`}>
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          ) : (
            <p>You don't have any categories created.</p> // Show message if no categories
          )}
        </div>

        {/* Submit button */}
        <Button text="Create Note" type="submit" className="btn-primary" />
      </form>
    </div>
  );
};
