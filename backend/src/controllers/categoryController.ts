import { Request, Response } from "express";
import * as categoryService from "../services/categoryService";
import { CustomRequest } from "../types/CustomRequest";

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

// Controller to fetch a category by its ID
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Extract category ID from request parameters
    const category = await categoryService.getCategoryById(parseInt(id)); // Fetch category by ID
    res.json(category); // Respond with the category
  } catch (error) {
    // Handle errors if the category is not found
    res.status(404).json({ message: "Category not found", error });
  }
};

// Controller to update a category by its ID
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Extract category ID from request parameters
    const { name } = req.body; // Extract new category name from request body

    // Validate that the category name is provided
    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    // Call service to update the category
    const category = await categoryService.updateCategory(parseInt(id), name);
    res.json(category); // Respond with the updated category
  } catch (error) {
    // Handle errors if the category is not found
    res.status(404).json({ message: "Category not found", error });
  }
};

// Controller to delete a category by its ID
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Extract category ID from request parameters
    await categoryService.deleteCategory(parseInt(id)); // Call service to delete the category
    res.status(200).json({ message: "Category deleted successfully" }); // Respond with success message
  } catch (error) {
    // Handle errors if the category is not found
    res.status(404).json({ message: "Category not found", error });
  }
};

// Controller to fetch categories associated with a specific note
export const getCategoriesByNote = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const { noteId } = req.params; // Extract note ID from request parameters
    const categories = await categoryService.getCategoriesByNote(
      parseInt(noteId)
    ); // Fetch categories associated with the note
    res.json(categories); // Respond with the list of categories
  } catch (error) {
    // Handle any errors during fetching categories by note
    res
      .status(500)
      .json({ message: "Error fetching categories by note", error });
  }
};

// Controller to fetch categories not associated with a specific note
export const getCategoriesNotInNote = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const { noteId } = req.params; // Extract note ID from request parameters
    const categories = await categoryService.getCategoriesNotInNote(
      parseInt(noteId)
    ); // Fetch categories not associated with the note
    res.json(categories); // Respond with the list of categories
  } catch (error) {
    // Handle any errors during fetching categories not in note
    res
      .status(500)
      .json({ message: "Error fetching categories not in note", error });
  }
};
