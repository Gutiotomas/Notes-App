import { Request, Response } from "express";
import * as authService from "../services/authService";

// Controller function to handle user registration
export const register = async (req: Request, res: Response) => {
  try {
    // Extract user details from the request body
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Name, email and password are required" });
    }

    // authService already signs the token; re-signing it here would mean two
    // places to keep in step.
    const { user, token } = await authService.register(name, email, password);

    // Respond with the created user and the token (the model drops the hash)
    res.status(201).json({ user, token });
  } catch (err: unknown) {
    // Only a genuine conflict is the caller's fault; anything else is ours and
    // must not be reported as a bad request.
    if (err instanceof Error && err.message === "User already exists") {
      return res.status(409).json({ error: err.message });
    }
    console.error("Error during registration:", err);
    res.status(500).json({ error: "Registration failed" });
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
  } catch (err: unknown) {
    // Distinguish wrong credentials from a server fault: answering 401 for a
    // database outage told the user their password was wrong.
    if (err instanceof Error && err.message === "Invalid credentials") {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    console.error("Error during login:", err);
    res.status(500).json({ error: "Login failed" });
  }
};
