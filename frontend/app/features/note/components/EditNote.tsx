import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/edit.css";
import {
  updateNote,
  getNoteById,
  addCategoryToNote,
  removeCategoryFromNote,
} from "../services/noteService";
import {
  getCategories,
  getCategoriesByNote,
} from "../services/categoryService"; // Import getCategories
import { Input } from "~/shared/components/Input";
import { Button } from "~/shared/components/Button";
import { TextArea } from "~/shared/components/TextArea";
import type { Category } from "../../home/utils/types";

type EditNoteProps = {
  id?: string;
};

export const EditNote: React.FC<EditNoteProps> = ({ id }) => {
  const [title, setTitle] = useState(""); // State for note title
  const [body, setBody] = useState(""); // State for note body
  const [value, setValue] = useState(""); // State for note value
  const [errors, setErrors] = useState<{
    title?: string;
    body?: string;
    value?: string;
  }>({}); // State for form validation errors
  const [categories, setCategories] = useState<Category[]>([]); // All available categories
  const [noteCategories, setNoteCategories] = useState<Category[]>([]); // Categories assigned to the note
  const [tempNoteCategories, setTempNoteCategories] = useState<number[]>([]); // Temporary state for category changes
  const [isLoading, setIsLoading] = useState(true); // Loading state for fetching data
  const navigate = useNavigate(); // Navigation hook

  // Fetch note data and categories when component mounts or ID changes
  useEffect(() => {
    const fetchNoteData = async () => {
      try {
        if (id) {
          const note = await getNoteById(parseInt(id)); // Fetch note details by ID
          setTitle(note.title); // Set note title
          setBody(note.content); // Set note body
          setValue(String(note.value ?? 0)); // Set note value

          const noteCategoriesData = await getCategoriesByNote(parseInt(id)); // Fetch categories assigned to the note
          setNoteCategories(noteCategoriesData); // Set note categories
          setTempNoteCategories(
            noteCategoriesData.map((cat: Category) => cat.id),
          ); // Initialize temporary category state

          const allCategories = await getCategories(); // Fetch all available categories
          setCategories(allCategories); // Set all categories
        }
      } catch (error) {
        console.error("Error fetching note data:", error); // Log errors
      } finally {
        setIsLoading(false); // Set loading state to false
      }
    };

    fetchNoteData();
  }, [id]);

  // Handle category checkbox changes
  const handleCategoryChange = (categoryId: number) => {
    if (tempNoteCategories.includes(categoryId)) {
      // Remove category if already selected
      setTempNoteCategories((prev) => prev.filter((id) => id !== categoryId));
    } else {
      // Add category if not selected
      setTempNoteCategories((prev) => [...prev, categoryId]);
    }
  };

  // Validate form fields
  const validateFields = () => {
    const newErrors: { title?: string; body?: string; value?: string } = {};

    if (!title.trim()) {
      newErrors.title = "Title is required"; // Title is required
    } else if (title.length > 20) {
      newErrors.title = "Title must not exceed 20 characters"; // Title length validation
    }

    if (!body.trim()) {
      newErrors.body = "Description is required"; // Body is required
    } else if (body.length > 600) {
      newErrors.body = "Description must not exceed 600 characters"; // Body length validation
    }

    if (value.trim()) {
      const parsedValue = Number(value);
      if (Number.isNaN(parsedValue) || parsedValue < 0) {
        newErrors.value = "Value must be a valid non-negative number";
      }
    }

    setErrors(newErrors); // Set validation errors
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission

    if (!validateFields()) {
      return; // Exit if validation fails
    }

    try {
      if (id) {
        const parsedValue = value.trim() ? Number(value) : 0;
        await updateNote(
          parseInt(id),
          title,
          body,
          tempNoteCategories,
          parsedValue,
        ); // Update note details

        // Determine categories to add and remove
        const categoriesToAdd = tempNoteCategories.filter(
          (catId) => !noteCategories.some((cat) => cat.id === catId),
        );
        const categoriesToRemove = noteCategories
          .filter((cat) => !tempNoteCategories.includes(cat.id))
          .map((cat) => cat.id);

        // Add new categories to the note
        for (const categoryId of categoriesToAdd) {
          await addCategoryToNote(parseInt(id), categoryId);
        }

        // Remove unselected categories from the note
        for (const categoryId of categoriesToRemove) {
          await removeCategoryFromNote(parseInt(id), categoryId);
        }

        // Update note categories state
        setNoteCategories(
          categories.filter((cat) => tempNoteCategories.includes(cat.id)),
        );
        navigate("/home"); // Navigate back to home
      }
    } catch (error) {
      console.error("Error updating note:", error); // Log errors
    }
  };

  return (
    <div className="note-container">
      <h1>Edit Note</h1>
      <form onSubmit={handleSubmit}>
        {/* Input for note title */}
        <Input
          label="Title"
          name="title"
          type="text"
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={20}
        />
        {errors.title && <p className="error-text">{errors.title}</p>}

        <Input
          label="Value"
          name="value"
          type="number"
          placeholder="Note value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          min={0}
          step="0.01"
        />
        {errors.value && <p className="error-text">{errors.value}</p>}

        {/* TextArea for note description */}
        <TextArea
          label="Description"
          name="description"
          rows={3}
          cols={30}
          maxLength={600}
          placeholder="Note description"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        />
        {errors.body && <p className="error-text">{errors.body}</p>}

        {/* Categories section */}
        <div className="categories">
          <h3>Categories</h3>
          {isLoading ? (
            <p>Loading categories...</p> // Show loading message
          ) : (
            <>
              {/* Categories already assigned to the note */}
              <div className="categories-have">
                <h4>Already has:</h4>
                {categories.length === 0 ? (
                  <p>You don't have any categories created.</p> // No categories available
                ) : noteCategories.length > 0 ? (
                  <div className="categories-list">
                    {noteCategories.map((category) => (
                      <div key={category.id} className="category-item">
                        <input
                          type="checkbox"
                          id={`category-${category.id}`}
                          value={category.id}
                          checked={tempNoteCategories.includes(category.id)}
                          onChange={() => handleCategoryChange(category.id)}
                        />
                        <label htmlFor={`category-${category.id}`}>
                          {category.name}
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>You don't have any categories assigned to this note.</p> // No categories assigned
                )}
              </div>

              {/* Categories available to assign */}
              <div className="categories-dont-have">
                <h4>Available:</h4>
                {categories.length === 0 ? (
                  <p>You don't have any categories created.</p> // No categories available
                ) : categories.filter(
                    (cat) => !noteCategories.some((nc) => nc.id === cat.id),
                  ).length > 0 ? (
                  <div className="categories-list">
                    {categories
                      .filter(
                        (cat) => !noteCategories.some((nc) => nc.id === cat.id),
                      )
                      .map((category) => (
                        <div key={category.id} className="category-item">
                          <input
                            type="checkbox"
                            id={`category-${category.id}`}
                            value={category.id}
                            checked={tempNoteCategories.includes(category.id)}
                            onChange={() => handleCategoryChange(category.id)}
                          />
                          <label htmlFor={`category-${category.id}`}>
                            {category.name}
                          </label>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p>
                    You already have all the categories assigned to this note.
                  </p> // All categories assigned
                )}
              </div>
            </>
          )}
        </div>

        {/* Submit button */}
        <Button text="Update Note" type="submit" className="btn-primary" />
      </form>
    </div>
  );
};
