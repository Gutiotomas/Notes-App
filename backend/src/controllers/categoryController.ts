import { Response } from "express";
import * as categoryService from "../services/categoryService";
import { CustomRequest } from "../types/CustomRequest";

// The services signal "absent or not yours" by throwing; anything else is a
// genuine server fault and must not be reported to the client as a 404.
const isNotFound = (error: unknown) =>
  error instanceof Error &&
  (error.message === "Category not found" || error.message === "Note not found");

// Controller to create a new category
export const createCategory = async (req: CustomRequest, res: Response) => {
  try {
    const { name } = req.body; // Extract category name from request body
    const userId = req.user!.id; // Extract user ID from authenticated user

    // Validate that the category name is provided
    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    // Call service to create the category
    const category = await categoryService.createCategory(name, userId);
    res.status(201).json(category); // Respond with the created category
  } catch (error) {
    // Handle any errors during category creation
    res.status(500).json({ message: "Error creating category", error });
  }
};

// Controller to fetch all categories for a user
export const getCategories = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user!.id; // Extract user ID from authenticated user
    const categories = await categoryService.getCategories(userId); // Fetch categories
    res.json(categories); // Respond with the list of categories
  } catch (error) {
    // Handle any errors during fetching categories
    res.status(500).json({ message: "Error fetching categories", error });
  }
};

// Controller to fetch one of the authenticated user's categories by its ID
export const getCategoryById = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params; // Extract category ID from request parameters
    const userId = req.user!.id; // Only the owner may read it
    const category = await categoryService.getCategoryById(parseInt(id), userId);
    res.json(category); // Respond with the category
  } catch (error) {
    // A missing category and one owned by somebody else answer alike, so the
    // response cannot be used to probe which ids exist.
    if (isNotFound(error)) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(500).json({ message: "Error fetching category" });
  }
};

// Controller to rename one of the authenticated user's categories
export const updateCategory = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params; // Extract category ID from request parameters
    const { name } = req.body; // Extract new category name from request body
    const userId = req.user!.id; // Only the owner may rename it

    // Validate that the category name is provided
    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    // Call service to update the category
    const category = await categoryService.updateCategory(
      parseInt(id),
      name,
      userId,
    );
    res.json(category); // Respond with the updated category
  } catch (error) {
    if (isNotFound(error)) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(500).json({ message: "Error updating category" });
  }
};

// Controller to delete one of the authenticated user's categories
export const deleteCategory = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params; // Extract category ID from request parameters
    const userId = req.user!.id; // Only the owner may delete it
    await categoryService.deleteCategory(parseInt(id), userId);
    res.status(200).json({ message: "Category deleted successfully" }); // Respond with success message
  } catch (error) {
    if (isNotFound(error)) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(500).json({ message: "Error deleting category" });
  }
};

// Controller to fetch categories associated with a specific note
export const getCategoriesByNote = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const { noteId } = req.params; // Extract note ID from request parameters
    const userId = req.user!.id; // The note must belong to the caller
    const categories = await categoryService.getCategoriesByNote(
      parseInt(noteId),
      userId
    ); // Fetch categories associated with the note
    res.json(categories); // Respond with the list of categories
  } catch (error) {
    if (isNotFound(error)) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.status(500).json({ message: "Error fetching categories by note" });
  }
};

// Controller to fetch categories not associated with a specific note
export const getCategoriesNotInNote = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const { noteId } = req.params; // Extract note ID from request parameters
    const userId = req.user!.id; // The note must belong to the caller
    const categories = await categoryService.getCategoriesNotInNote(
      parseInt(noteId),
      userId
    ); // Fetch categories not associated with the note
    res.json(categories); // Respond with the list of categories
  } catch (error) {
    if (isNotFound(error)) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.status(500).json({ message: "Error fetching categories not in note" });
  }
};
