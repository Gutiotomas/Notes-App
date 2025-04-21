import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";
import {
  getNotesByCategory,
  getAllNotes,
  archiveNote,
  deleteNote,
} from "../../note/services/noteService";
import { getCategories } from "../../note/services/categoryService";
import type { Category } from "../utils/types";
import { Button } from "../../../shared/components/Button";

// Home component: Displays the main page with notes and categories
export const Home: React.FC = () => {
  const navigate = useNavigate();

  // State to store categories
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );

  // State to store active notes
  const [activeNotes, setActiveNotes] = useState<any[]>([]);

  // State to store filtered notes when a category filter is applied
  const [filteredActiveNotes, setFilteredActiveNotes] = useState<any[]>([]);

  // State to store a message when filtering
  const [filterMessage, setFilterMessage] = useState<string | null>(null);

  // State to indicate if filtering is active
  const [isFiltering, setIsFiltering] = useState<boolean>(false);

  // Fetch categories and notes when the component is mounted
  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories();
      if (Array.isArray(data)) {
        setCategories(data);
      } else {
        console.error("Categories response is not an array:", data);
        setCategories([]);
      }
    };

    const fetchNotes = async () => {
      const allNotes = await getAllNotes();
      const active = allNotes.filter((note: any) => !note.archived);
      setActiveNotes(active);
    };

    fetchCategories();
    fetchNotes();
  }, []);

  // Archive a note and update the state
  const handleArchiveNote = async (noteId: number) => {
    try {
      await archiveNote(noteId);

      // Update filtered notes if filtering is active
      if (isFiltering) {
        setFilteredActiveNotes((prev) =>
          prev.filter((note) => note.id !== noteId)
        );
      }

      // Update active notes
      setActiveNotes((prev) => prev.filter((note) => note.id !== noteId));
    } catch (error) {
      console.error("Error archiving note:", error);
    }
  };

  // Delete a note and update the state
  const handleDeleteNote = async (noteId: number) => {
    try {
      await deleteNote(noteId);

      // Update filtered notes if filtering is active
      if (isFiltering) {
        setFilteredActiveNotes((prev) =>
          prev.filter((note) => note.id !== noteId)
        );
      }

      // Update active notes
      setActiveNotes((prev) => prev.filter((note) => note.id !== noteId));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  // Filter notes by category
  const handleFilterByCategory = async (categoryId: number) => {
    try {
      const filteredNotes = await getNotesByCategory(categoryId);

      // Handle case where no notes are found
      if (!Array.isArray(filteredNotes) || filteredNotes.length === 0) {
        setFilteredActiveNotes([]);
        setIsFiltering(true);
        return;
      }

      // Filter active notes
      const active = filteredNotes.filter((note: any) => !note.archived);

      setFilteredActiveNotes(active);
      setFilterMessage(null);
      setIsFiltering(true);
    } catch (error) {
      console.error("Error fetching notes by category:", error);
    }
  };

  // Clear the category filter
  const handleClearFilter = () => {
    setIsFiltering(false);
    setFilteredActiveNotes([]);
  };

  return (
    <div className="home-container">
      <h1>My Notes</h1>
      <div className="home-actions">
        {/* Button to navigate to the categories management page */}
        <Button
          text="Categories"
          onClick={() => navigate("/categories")}
          className="manage-categories-btn"
        />
        {/* Button to navigate to the note creation page */}
        <Button
          text="Create Note"
          onClick={() => navigate("/notes")}
          className="create-btn"
        />
      </div>
      <h2>Category filters</h2>
      <div className="categories">
        {/* Render category buttons */}
        {categories.length > 0 ? (
          categories.map((category) => (
            <Button
              text={category.name}
              key={category.id}
              onClick={() => handleFilterByCategory(category.id)}
              className="category-btn"
            />
          ))
        ) : (
          <p>You don't have any categories created.</p>
        )}
        {/* Button to clear the filter if filtering is active */}
        {isFiltering && (
          <Button
            text="Clear Filter"
            onClick={handleClearFilter}
            className="clear-filter-btn"
          />
        )}
      </div>

      {/* Render filtered notes if filtering is active */}
      {isFiltering ? (
        <>
          {filterMessage && <p className="filter-message">{filterMessage}</p>}

          <h2>Filtered Notes</h2>
          <div className="notes-list">
            {filteredActiveNotes.length > 0 ? (
              filteredActiveNotes.map((note) => (
                <div key={note.id} className="note-card">
                  <h3>{note.title}</h3>
                  <p>{note.content}</p>
                  {/* Render categories associated with the note */}
                  {note.categories && note.categories.length > 0 && (
                    <div className="note-categories">
                      <strong>Categories:</strong>
                      <ul>
                        {note.categories.map((category: Category) => (
                          <li key={category.id}>{category.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="note-actions">
                    {/* Buttons for editing, archiving, and deleting the note */}
                    <Button
                      text="Edit"
                      onClick={() => navigate(`/edit/${note.id}`)}
                      className="edit-btn"
                    />
                    <Button
                      text="Archive"
                      onClick={() => handleArchiveNote(note.id)}
                      className="archive-btn"
                    />
                    <Button
                      text="Delete"
                      onClick={() => handleDeleteNote(note.id)}
                      className="delete-btn"
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="no-active">You don't have active notes in this category.</p>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Render active notes if no filter is applied */}
          <h2>Active Notes</h2>
          <div className="notes-list">
            {activeNotes.length > 0 ? (
              activeNotes.map((note) => (
                <div key={note.id} className="note-card">
                  <h3>{note.title}</h3>
                  <p>{note.content}</p>
                  {/* Render categories associated with the note */}
                  {note.categories && note.categories.length > 0 && (
                    <div className="note-categories">
                      <strong>Categories:</strong>
                      <ul>
                        {note.categories.map((category: Category) => (
                          <li key={category.id}>{category.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="note-actions">
                    {/* Buttons for editing, archiving, and deleting the note */}
                    <Button
                      text="Edit"
                      onClick={() => navigate(`/edit/${note.id}`)}
                      className="edit-btn"
                    />
                    <Button
                      text="Archive"
                      onClick={() => handleArchiveNote(note.id)}
                      className="archive-btn"
                    />
                    <Button
                      text="Delete"
                      onClick={() => handleDeleteNote(note.id)}
                      className="delete-btn"
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="no-notes">You don't have active notes.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};
