import { Response } from "express";
import Note from "../models/noteModel";
import { CustomRequest } from "../types/CustomRequest";
import * as noteService from "../services/noteService";
import Category from "../models/categoryModel";

// Controller to create a new note
export const createNote = async (req: CustomRequest, res: Response) => {
  try {
    const { title, content, categories } = req.body;
    const userId = req.user!.id;

    // Create the note
    const note = await Note.create({ title, content, userId });

    // Associate categories with the note if provided
    if (categories && Array.isArray(categories)) {
      const categoryInstances = await Category.findAll({
        where: { id: categories },
      });
      await note.$set("categories", categoryInstances);
    }

    // Fetch the created note with its associated categories
    const createdNote = await Note.findByPk(note.id, {
      include: [Category],
    });

    res.status(201).json(createdNote);
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ message: "Failed to create note", error });
  }
};

// Controller to fetch all notes for the authenticated user
export const getNotes = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    // Fetch notes that are not archived
    const notes = await Note.findAll({
      where: { userId, archived: false },
      include: [Category],
    });

    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notes", error });
  }
};

// Controller to fetch a specific note by its ID
export const getNoteById = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    // Fetch the note by ID and user ID
    const note = await Note.findOne({
      where: { id, userId },
      include: [Category],
    });

    if (!note) return res.status(404).json({ message: "Note not found" });

    res.json(note);
  } catch (error) {
    res.status(500).json({ message: "Error fetching note", error });
  }
};

// Controller to fetch archived notes for the authenticated user
export const getArchivedNotes = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    // Fetch notes that are archived
    const notes = await Note.findAll({
      where: { userId, archived: true },
      include: [Category],
    });

    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching archived notes", error });
  }
};

// Controller to update an existing note
export const updateNote = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, categories } = req.body;

    // Find the note to update
    const note = await Note.findOne({
      where: { id, userId: req.user!.id },
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Update the note's title and content
    await note.update({ title, content });

    // Update the note's categories if provided
    if (categories && Array.isArray(categories)) {
      const categoryInstances = await Category.findAll({
        where: { id: categories },
      });
      await note.$set("categories", categoryInstances);
    }

    // Fetch the updated note with its associated categories
    const updatedNote = await Note.findByPk(note.id, {
      include: [Category],
    });

    res.status(200).json(updatedNote);
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ message: "Failed to update note", error });
  }
};

// Controller to delete a note
export const deleteNote = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    // Delete the note by ID and user ID
    const deleted = await Note.destroy({ where: { id, userId } });

    deleted
      ? res.status(200).json({ message: "Note deleted successfully" })
      : res.status(404).json({ message: "Note not found" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting note", error });
  }
};

// Controller to toggle the archive status of a note
export const toggleArchiveNote = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    // Find the note to toggle archive status
    const note = await Note.findOne({ where: { id, userId } });

    if (!note) return res.status(404).json({ message: "Note not found" });

    // Toggle the archived status
    note.archived = !note.archived;
    await note.save();

    res.json(note);
  } catch (error) {
    res.status(500).json({ message: "Error archiving note", error });
  }
};

// Controller to add a category to a note
export const addCategoryToNote = async (req: CustomRequest, res: Response) => {
  try {
    const { noteId, categoryId } = req.body;

    // Use the service to add the category to the note
    const note = await noteService.addCategoryToNote(noteId, categoryId);

    res.json(note);
  } catch (error) {
    res.status(500).json({ message: "Error adding category to note", error });
  }
};

// Controller to remove a category from a note
export const removeCategoryFromNote = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const { noteId, categoryId } = req.body;

    // Use the service to remove the category from the note
    const note = await noteService.removeCategoryFromNote(noteId, categoryId);

    res.json(note);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error removing category from note", error });
  }
};

// Controller to fetch notes by category for the authenticated user
export const getNotesByCategory = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { categoryId } = req.params;

    // Fetch notes associated with the specified category
    const notes = await Note.findAll({
      where: { userId },
      include: [
        {
          model: Category,
          where: { id: categoryId },
        },
      ],
    });

    res.status(200).json(notes);
  } catch (error) {
    if (error instanceof Error && error.message === "Category not found") {
      return res.status(404).json({ message: "Category not found" });
    }
    res
      .status(500)
      .json({ message: "Error fetching notes by category", error });
  }
};
