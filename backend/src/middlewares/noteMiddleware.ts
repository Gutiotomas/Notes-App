import { Request, Response, NextFunction } from "express";

// Middleware to validate the structure and types of a note object in the request body
export const validateNote = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { title, content, archived, value, installments } = req.body;

  // Validate that 'title' exists and is a string
  if (!title || typeof title !== "string") {
    return res
      .status(400)
      .json({ message: "Title is required and must be a string." });
  }

  // Validate that 'content' exists and is a string
  if (!content || typeof content !== "string") {
    return res
      .status(400)
      .json({ message: "Content is required and must be a string." });
  }

  // Validate that 'archived', if provided, is a boolean
  if (archived !== undefined && typeof archived !== "boolean") {
    return res
      .status(400)
      .json({ message: "Archived must be a boolean value." });
  }

  // Validate that 'value', if provided, is a valid non-negative number
  if (
    value !== undefined &&
    (typeof value !== "number" || Number.isNaN(value) || value < 0)
  ) {
    return res.status(400).json({
      message: "Value must be a valid non-negative number.",
    });
  }

  // Validate that 'installments', if provided, is a positive integer
  if (
    installments !== undefined &&
    (!Number.isInteger(installments) || installments < 1)
  ) {
    return res.status(400).json({
      message: "Installments must be a positive integer.",
    });
  }

  // If all validations pass, proceed to the next middleware or route handler
  next();
};
