import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "~/shared/components/Button";
import {
  getArchivedNotes,
  getNotesByCategory,
  unarchiveNote,
  deleteNote,
} from "../../note/services/noteService";
import { getCategories } from "../../note/services/categoryService";
import "../styles/archive.css";
import type { Category } from "~/features/home/utils/types";

// Archive component to manage and display archived notes
export const Archive: React.FC = () => {
  const navigate = useNavigate();

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

  // State to store all archived notes
  const [archivedNotes, setArchivedNotes] = useState<any[]>([]);

  // State to store filtered archived notes
  const [filteredArchivedNotes, setFilteredArchivedNotes] = useState<any[]>([]);

  // State to track if filtering is active
  const [isFiltering, setIsFiltering] = useState<boolean>(false);

  // State to store filter-related messages
  const [filterMessage, setFilterMessage] = useState<string | null>(null);

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

  // Filter notes by category
  const handleFilterByCategory = async (categoryId: number) => {
    try {
      const filteredNotes = await getNotesByCategory(categoryId);

      if (!Array.isArray(filteredNotes) || filteredNotes.length === 0) {
        setFilteredArchivedNotes([]);
        setIsFiltering(true);
        return;
      }

      // Filter only archived notes from the category
      const archived = filteredNotes.filter((note: any) => note.archived);

      setFilteredArchivedNotes(archived);
      setFilterMessage(null);
      setIsFiltering(true);
    } catch (error) {
      console.error("Error fetching notes by category:", error);
    }
  };

  // Clear the applied filter
  const handleClearFilter = () => {
    setIsFiltering(false);
    setFilteredArchivedNotes([]);
    setFilterMessage(null);
  };

  // Unarchive a specific note
  const handleUnarchiveNote = async (noteId: number) => {
    try {
      await unarchiveNote(noteId);

      // Update filtered notes if filtering is active
      if (isFiltering) {
        setFilteredArchivedNotes((prev) =>
          prev.filter((note) => note.id !== noteId),
        );
      }

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

      // Update filtered notes if filtering is active
      if (isFiltering) {
        setFilteredArchivedNotes((prev) =>
          prev.filter((note) => note.id !== noteId),
        );
      }

      // Update the archived notes list
      setArchivedNotes((prev) => prev.filter((note) => note.id !== noteId));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  return (
    <div className="archive-container">
      <h1>My Archived Notes</h1>

      {/* Filters Section */}
      <h2>Category filters</h2>
      <div className="categories">
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
        {isFiltering && (
          <Button
            text="Clear Filter"
            onClick={handleClearFilter}
            className="clear-filter-btn"
          />
        )}
      </div>

      {/* Display filtered or all archived notes */}
      {isFiltering ? (
        <>
          {filterMessage && <p className="filter-message">{filterMessage}</p>}

          <h2>Filtered Archived Notes</h2>
          <div className="totals-box">
            <strong>Total archived category value:</strong>{" "}
            {formatCurrency(getNotesTotalValue(filteredArchivedNotes))}
          </div>
          <div className="notes-list">
            {filteredArchivedNotes.length > 0 ? (
              filteredArchivedNotes.map((note) => (
                <div key={note.id} className="note-card archived">
                  <h3>{note.title}</h3>
                  <p>{note.content}</p>
                  <p className="note-value">
                    {formatCurrency(Number(note.value ?? 0))}
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
            {formatCurrency(getNotesTotalValue(archivedNotes))}
          </div>
          <div className="notes-list">
            {archivedNotes.length > 0 ? (
              archivedNotes.map((note) => (
                <div key={note.id} className="note-card archived">
                  <h3>{note.title}</h3>
                  <p>{note.content}</p>
                  <p className="note-value">
                    {formatCurrency(Number(note.value ?? 0))}
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
