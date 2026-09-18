import Note from "../models/noteModel";
import Category from "../models/categoryModel";

// Creates a new note for a specific user
export const createNote = async (
  userId: number,
  title: string,
  content: string,
  value: number = 0,
  installments: number | null = null,
) => {
  return await Note.create({
    userId,
    title,
    content,
    value,
    installments,
    archived: false,
  });
};

// Retrieves all non-archived notes for a specific user
export const getNotes = async (userId: number) => {
  return await Note.findAll({ where: { userId, archived: false } });
};

// Retrieves a specific note by its ID for a specific user, including its categories
export const getNoteById = async (userId: number, noteId: number) => {
  const note = await Note.findOne({
    where: { id: noteId, userId },
    include: [Category],
  });

  if (!note) throw new Error("Note not found");

  return note;
};

// Retrieves all archived notes for a specific user
export const getArchivedNotes = async (userId: number) => {
  return await Note.findAll({ where: { userId, archived: true } });
};

// Updates a specific note's title or content for a specific user
export const updateNote = async (
  userId: number,
  noteId: number,
  updates: {
    title?: string;
    content?: string;
    value?: number;
    installments?: number | null;
  },
) => {
  const note = await Note.findOne({ where: { id: noteId, userId } });
  if (!note) throw new Error("Note not found");
  return await note.update(updates);
};

// Deletes a specific note for a specific user
export const deleteNote = async (userId: number, noteId: number) => {
  const note = await Note.findOne({ where: { id: noteId, userId } });
  if (!note) throw new Error("Note not found");
  return await note.destroy();
};

// Toggles the archived status of a specific note for a specific user
export const toggleArchiveNote = async (userId: number, noteId: number) => {
  const note = await Note.findOne({ where: { id: noteId, userId } });
  if (!note) throw new Error("Note not found");
  note.archived = !note.archived;
  return await note.save();
};

// Adds one of the user's categories to one of the user's notes.
// Both sides are scoped to userId: otherwise a valid token could attach or
// detach categories on notes belonging to somebody else.
export const addCategoryToNote = async (
  noteId: number,
  categoryId: number,
  userId: number,
) => {
  const note = await Note.findOne({ where: { id: noteId, userId } });
  const category = await Category.findOne({ where: { id: categoryId, userId } });

  if (!note || !category) throw new Error("Note or Category not found");

  await note.$add("categories", category);
  return note;
};

// Removes one of the user's categories from one of the user's notes
export const removeCategoryFromNote = async (
  noteId: number,
  categoryId: number,
  userId: number,
) => {
  const note = await Note.findOne({ where: { id: noteId, userId } });
  const category = await Category.findOne({ where: { id: categoryId, userId } });

  if (!note || !category) throw new Error("Note or Category not found");

  await note.$remove("categories", category);
  return note;
};

// Retrieves all notes associated with a specific category for a specific user
export const getNotesByCategory = async (
  userId: number,
  categoryId: number,
) => {
  const category = await Category.findByPk(categoryId, {
    include: [
      {
        model: Note,
        where: { userId },
        required: false,
      },
    ],
  });

  if (!category) {
    throw new Error("Category not found");
  }

  return category.notes || [];
};
