import Category from "../models/categoryModel";
import Note from "../models/noteModel";
import { Op } from "sequelize";

// Every lookup below is scoped to the owning user. Without the userId in the
// WHERE clause a valid token for any account could read or modify another
// account's categories, since the ids are sequential and guessable.

// Creates a new category for a specific user
export const createCategory = async (name: string, userId: number) => {
  return await Category.create({ name, userId });
};

// Retrieves all categories associated with a specific user
export const getCategories = async (userId: number) => {
  return await Category.findAll({ where: { userId } });
};

// Retrieves one of the user's categories, throws an error if not found
export const getCategoryById = async (id: number, userId: number) => {
  const category = await Category.findOne({ where: { id, userId } });
  if (!category) throw new Error("Category not found");
  return category;
};

// Renames one of the user's categories, throws an error if not found
export const updateCategory = async (
  id: number,
  name: string,
  userId: number,
) => {
  const category = await Category.findOne({ where: { id, userId } });
  if (!category) throw new Error("Category not found");
  category.name = name;
  return await category.save();
};

// Deletes one of the user's categories, throws an error if not found
export const deleteCategory = async (id: number, userId: number) => {
  const category = await Category.findOne({ where: { id, userId } });
  if (!category) throw new Error("Category not found");
  return await category.destroy();
};

// Retrieves the categories of one of the user's notes
export const getCategoriesByNote = async (noteId: number, userId: number) => {
  const note = await Note.findOne({
    where: { id: noteId, userId },
    include: [Category],
  });

  if (!note) throw new Error("Note not found");

  return note.categories;
};

// Retrieves the user's categories that are not yet assigned to one of their notes
export const getCategoriesNotInNote = async (
  noteId: number,
  userId: number,
) => {
  const note = await Note.findOne({
    where: { id: noteId, userId },
    include: [Category],
  });

  if (!note) throw new Error("Note not found");

  const noteCategoryIds = note.categories.map((category) => category.id);

  // Op.notIn with an empty array makes Sequelize drop the condition entirely,
  // so only add it when the note actually has categories.
  return await Category.findAll({
    where: {
      userId,
      ...(noteCategoryIds.length > 0
        ? { id: { [Op.notIn]: noteCategoryIds } }
        : {}),
    },
  });
};
