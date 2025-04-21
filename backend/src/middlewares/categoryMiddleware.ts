import { Request, Response, NextFunction } from "express";

// Middleware to validate the category data in the request body
export const validateCategory = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Extract the 'name' field from the request body
  const { name } = req.body;

  // Check if 'name' is missing, not a string, or an empty string
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    // If validation fails, respond with a 400 status and an error message
    return res.status(400).json({
      message: "Category name is required and must be a non-empty string.",
    });
  }

  // If validation passes, proceed to the next middleware or route handler
  next();
};
