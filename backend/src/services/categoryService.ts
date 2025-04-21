import Category from "../models/categoryModel";
import Note from "../models/noteModel";
import { Op } from "sequelize";

// Creates a new category for a specific user
export const createCategory = async (name: string, userId: number) => {
  return await Category.create({ name, userId });
};

// Retrieves all categories associated with a specific user
export const getCategories = async (userId: number) => {
  return await Category.findAll({ where: { userId } });
};

// Retrieves a category by its ID, throws an error if not found
export const getCategoryById = async (id: number) => {
  const category = await Category.findByPk(id);
  if (!category) throw new Error("Category not found");
  return category;
};

// Updates the name of a category by its ID, throws an error if not found
export const updateCategory = async (id: number, name: string) => {
  const category = await Category.findByPk(id);
  if (!category) throw new Error("Category not found");
  category.name = name;
  return await category.save();
};

// Deletes a category by its ID, throws an error if not found
export const deleteCategory = async (id: number) => {
  const category = await Category.findByPk(id);
  if (!category) throw new Error("Category not found");
  return await category.destroy();
};

// Retrieves all categories associated with a specific note
export const getCategoriesByNote = async (noteId: number) => {
  const note = await Note.findByPk(noteId, {
    include: [Category],
  });

  if (!note) throw new Error("Note not found");

  return note.categories;
};

// Retrieves all categories that are not associated with a specific note
export const getCategoriesNotInNote = async (noteId: number) => {
  const note = await Note.findByPk(noteId, {
    include: [Category],
  });

  if (!note) throw new Error("Note not found");

  const noteCategoryIds = note.categories.map((category) => category.id);

  return await Category.findAll({
    where: {
      id: {
        [Op.notIn]: noteCategoryIds,
      },
    },
  });
};
