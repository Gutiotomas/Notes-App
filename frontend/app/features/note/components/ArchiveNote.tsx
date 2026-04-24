import React, { useState, useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "~/shared/components/Button";
import {
  getArchivedNotes,
  unarchiveNote,
  deleteNote,
} from "../../note/services/noteService";
import { getCategories } from "../../note/services/categoryService";
import "../styles/archive.css";
import type { Category } from "~/features/home/utils/types";

// Archive component to manage and display archived notes
export const Archive: React.FC = () => {
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

  const getInstallmentAmount = (note: any) => {
    const installments = Math.max(1, Number(note.installments ?? 1));
    const value = Number(note.value ?? 0);

    return value / installments;
  };

  const getNotesTotalValue = (notes: any[]) =>
    notes.reduce((sum, note) => sum + Number(note.value ?? 0), 0);

  const getNotesMonthlyTotal = (notes: any[]) =>
    notes.reduce((sum, note) => {
      const installments = Math.max(1, Number(note.installments ?? 1));
      const value = Number(note.value ?? 0);

      return sum + value / installments;
    }, 0);

  // State to store categories
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    [],
  );

  // State to store all archived notes
  const [archivedNotes, setArchivedNotes] = useState<any[]>([]);
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

  const displayedArchivedNotes = useMemo(() => {
    if (!isFiltering) {
      return archivedNotes;
    }

    return archivedNotes.filter((note: any) => {
      const noteCategoryIds = new Set(
        (note.categories || []).map((category: Category) =>
          Number(category.id),
        ),
      );

      return selectedCategoryIds.every((categoryId) =>
        noteCategoryIds.has(Number(categoryId)),
      );
    });
  }, [archivedNotes, selectedCategoryIds, isFiltering]);

  // Fetch categories and archived notes on component mount
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

    const fetchArchivedNotes = async () => {
      const archived = await getArchivedNotes();
      setArchivedNotes(archived);
    };

    fetchCategories();
    fetchArchivedNotes();
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
  }, [location.state, displayedArchivedNotes]);

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

  // Unarchive a specific note
  const handleUnarchiveNote = async (noteId: number) => {
    try {
      await unarchiveNote(noteId);

      // Update the archived notes list
      setArchivedNotes((prev) => prev.filter((note) => note.id !== noteId));
    } catch (error) {
      console.error("Error unarchiving note:", error);
    }
  };

  // Delete a specific note
  const handleDeleteNote = async (noteId: number) => {
    try {
      await deleteNote(noteId);

      // Update the archived notes list
      setArchivedNotes((prev) => prev.filter((note) => note.id !== noteId));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  return (
    <div className="archive-container">
      <h1>My Archived Notes</h1>

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
          <h2>Filtered Archived Notes</h2>
          <div className="totals-box">
            <strong>Total archived category value:</strong>{" "}
            {formatCurrency(getNotesTotalValue(displayedArchivedNotes))}
            <br />
            <strong>Total monthly (filtered):</strong>{" "}
            {formatCurrency(getNotesMonthlyTotal(displayedArchivedNotes))}
          </div>
          <div className="notes-list">
            {displayedArchivedNotes.length > 0 ? (
              displayedArchivedNotes.map((note) => (
                <div
                  id={`note-card-${note.id}`}
                  key={note.id}
                  className="note-card archived"
                >
                  <h3>{note.title}</h3>
                  <p>{note.content}</p>
                  <p className="note-value">
                    {formatCurrency(Number(note.value ?? 0))}
                  </p>
                  <p className="note-installments">
                    Installments: {Math.max(1, Number(note.installments ?? 1))}{" "}
                    | Monthly payment:{" "}
                    {formatCurrency(getInstallmentAmount(note))}
                  </p>
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
                      text="Unarchive"
                      onClick={() => handleUnarchiveNote(note.id)}
                      className="unarchive-btn"
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
              <p className="no-archived">
                You don't have archived notes in this category.
              </p>
            )}
          </div>
        </>
      ) : (
        <>
          <h2>Archived Notes</h2>
          <div className="totals-box">
            <strong>Total archived value:</strong>{" "}
            {formatCurrency(getNotesTotalValue(displayedArchivedNotes))}
            <br />
            <strong>Total monthly:</strong>{" "}
            {formatCurrency(getNotesMonthlyTotal(displayedArchivedNotes))}
          </div>
          <div className="notes-list">
            {displayedArchivedNotes.length > 0 ? (
              displayedArchivedNotes.map((note) => (
                <div
                  id={`note-card-${note.id}`}
                  key={note.id}
                  className="note-card archived"
                >
                  <h3>{note.title}</h3>
                  <p>{note.content}</p>
                  <p className="note-value">
                    {formatCurrency(Number(note.value ?? 0))}
                  </p>
                  <p className="note-installments">
                    Installments: {Math.max(1, Number(note.installments ?? 1))}{" "}
                    | Monthly payment:{" "}
                    {formatCurrency(getInstallmentAmount(note))}
                  </p>
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
                      text="Unarchive"
                      onClick={() => handleUnarchiveNote(note.id)}
                      className="unarchive-btn"
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
              <p className="no-notes">You don't have archived notes.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};
