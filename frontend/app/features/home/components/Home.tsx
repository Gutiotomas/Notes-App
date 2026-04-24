import React, { useState, useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/home.css";
import {
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
  const location = useLocation();
  const lastFocusedNoteIdRef = useRef<number | null>(null);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

  const getNotesTotalValue = (notes: any[]) =>
    notes.reduce((sum, note) => sum + Number(note.value ?? 0), 0);

  // State to store categories
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    [],
  );

  // State to store active notes
  const [activeNotes, setActiveNotes] = useState<any[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);

  const isFiltering = selectedCategoryIds.length > 0;

  const activeFilterCategories = useMemo(
    () =>
      categories.filter((category) =>
        selectedCategoryIds.includes(category.id),
      ),
    [categories, selectedCategoryIds],
  );

  const availableFilterCategories = useMemo(
    () =>
      categories.filter(
        (category) => !selectedCategoryIds.includes(category.id),
      ),
    [categories, selectedCategoryIds],
  );

  const displayedNotes = useMemo(() => {
    if (!isFiltering) {
      return activeNotes;
    }

    return activeNotes.filter((note: any) => {
      const noteCategoryIds = new Set(
        (note.categories || []).map((category: Category) =>
          Number(category.id),
        ),
      );

      // Note must contain all selected categories
      return selectedCategoryIds.every((categoryId) =>
        noteCategoryIds.has(Number(categoryId)),
      );
    });
  }, [activeNotes, selectedCategoryIds, isFiltering]);

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

  // Restore viewport focus to the edited note when returning from edit page
  useEffect(() => {
    const focusNoteId = (location.state as { focusNoteId?: number } | null)
      ?.focusNoteId;

    if (!focusNoteId) {
      lastFocusedNoteIdRef.current = null;
      return;
    }

    if (lastFocusedNoteIdRef.current === focusNoteId) {
      return;
    }

    const noteElement = document.getElementById(`note-card-${focusNoteId}`);
    if (!noteElement) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      noteElement.scrollIntoView({ behavior: "smooth", block: "center" });
      lastFocusedNoteIdRef.current = focusNoteId;
    });

    return () => window.cancelAnimationFrame(frame);
  }, [location.state, displayedNotes]);

  // Archive a note and update the state
  const handleArchiveNote = async (noteId: number) => {
    try {
      await archiveNote(noteId);

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

      // Update active notes
      setActiveNotes((prev) => prev.filter((note) => note.id !== noteId));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const addCategoryFilter = (categoryId: number) => {
    const normalizedId = Number(categoryId);
    setSelectedCategoryIds((prev) =>
      prev.includes(normalizedId) ? prev : [...prev, normalizedId],
    );
  };

  const removeCategoryFilter = (categoryId: number) => {
    const normalizedId = Number(categoryId);
    setSelectedCategoryIds((prev) => prev.filter((id) => id !== normalizedId));
  };

  const handleClearAllFilters = () => {
    setSelectedCategoryIds([]);
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
      <div className="categories">
        {categories.length > 0 ? (
          <>
            <div className="filter-group">
              <h3>Category filters</h3>
              <div className="filter-buttons">
                {availableFilterCategories.length > 0 ? (
                  availableFilterCategories.map((category) => (
                    <Button
                      text={category.name}
                      key={category.id}
                      onClick={() => addCategoryFilter(category.id)}
                      className="category-btn"
                    />
                  ))
                ) : (
                  <p>All categories are active.</p>
                )}
              </div>
            </div>

            {activeFilterCategories.length > 0 && (
              <div className="filter-group">
                <h3>Active filters</h3>
                <div className="filter-buttons">
                  {activeFilterCategories.map((category) => (
                    <Button
                      text={category.name}
                      key={category.id}
                      onClick={() => removeCategoryFilter(category.id)}
                      className="active-category-btn"
                    />
                  ))}
                </div>
              </div>
            )}

            {isFiltering && (
              <Button
                text="Clear All"
                onClick={handleClearAllFilters}
                className="clear-filter-btn"
              />
            )}
          </>
        ) : (
          <p>You don't have any categories created.</p>
        )}
      </div>

      {isFiltering ? (
        <>
          <h2>Filtered Notes</h2>
          <div className="totals-box">
            <strong>Total category value:</strong>{" "}
            {formatCurrency(getNotesTotalValue(displayedNotes))}
          </div>
          <div className="notes-list">
            {displayedNotes.length > 0 ? (
              displayedNotes.map((note) => (
                <div
                  id={`note-card-${note.id}`}
                  key={note.id}
                  className="note-card"
                >
                  <h3>{note.title}</h3>
                  <p>{note.content}</p>
                  <p className="note-value">
                    {formatCurrency(Number(note.value ?? 0))}
                  </p>
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
                      onClick={() =>
                        navigate(`/edit/${note.id}`, {
                          state: {
                            from: location.pathname,
                            focusNoteId: note.id,
                          },
                        })
                      }
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
              <p className="no-active">
                You don't have active notes in this category.
              </p>
            )}
          </div>
        </>
      ) : (
        <>
          <h2>Active Notes</h2>
          <div className="totals-box">
            <strong>Total notes value:</strong>{" "}
            {formatCurrency(getNotesTotalValue(displayedNotes))}
          </div>
          <div className="notes-list">
            {displayedNotes.length > 0 ? (
              displayedNotes.map((note) => (
                <div
                  id={`note-card-${note.id}`}
                  key={note.id}
                  className="note-card"
                >
                  <h3>{note.title}</h3>
                  <p>{note.content}</p>
                  <p className="note-value">
                    {formatCurrency(Number(note.value ?? 0))}
                  </p>
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
                      onClick={() =>
                        navigate(`/edit/${note.id}`, {
                          state: {
                            from: location.pathname,
                            focusNoteId: note.id,
                          },
                        })
                      }
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
