import { Request, Response } from "express";
import * as authService from "../services/authService";
import jwt from "jsonwebtoken";

// Controller function to handle user registration
export const register = async (req: Request, res: Response) => {
  try {
    // Extract user details from the request body
    const { name, email, password } = req.body;

    // Call the authService to register the user
    const { user } = await authService.register(name, email, password);

    // Generate a JWT token for the newly registered user
    const token = jwt.sign(
      { id: user.id, email: user.email }, // Payload
      process.env.JWT_SECRET!, // Secret key
      {
        expiresIn: "2h", // Token expiration time
      }
    );

    // Respond with the created user and the token
    res.status(201).json({ user, token });
  } catch (err: any) {
    // Handle errors and respond with a 400 status code
    res.status(400).json({ error: err.message });
  }
};

// Controller function to handle user login
export const login = async (req: Request, res: Response) => {
  try {
    // Extract login credentials from the request body
    const { email, password } = req.body;

    // Call the authService to authenticate the user
    const { user, token } = await authService.login(email, password);

    // Respond with the authenticated user and the token
    res.json({ user, token });
  } catch (err: any) {
    // Handle errors and respond with a 401 status code
    res.status(401).json({ error: err.message });
  }
};
