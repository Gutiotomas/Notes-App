import User from "../models/authModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Retrieve the JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not defined"); // Ensure the JWT secret is defined
}

/**
 * Registers a new user in the system.
 * @param name - The name of the user.
 * @param email - The email of the user.
 * @param password - The plain text password of the user.
 * @returns An object containing the created user and a JWT token.
 * @throws Error if the user already exists.
 */
export const register = async (
  name: string,
  email: string,
  password: string
) => {
  // Check if a user with the given email already exists
  const existing = await User.findOne({ where: { email } });
  if (existing) throw new Error("User already exists");

  // Hash the user's password
  const hashed = await bcrypt.hash(password, 10);

  // Create a new user in the database
  const user = await User.create({ name, email, password: hashed });

  // Generate a JWT token for the user
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "2h", // Token expires in 24 hours
  });

  return { user, token }; // Return the created user and token
};

/**
 * Logs in an existing user.
 * @param email - The email of the user.
 * @param password - The plain text password of the user.
 * @returns An object containing the authenticated user and a JWT token.
 * @throws Error if the credentials are invalid.
 */
export const login = async (email: string, password: string) => {
  // Find the user by email
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("Invalid credentials");

  // Compare the provided password with the stored hashed password
  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid credentials");

  // Generate a JWT token for the user
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "2h", // Token expires in 24 hours
  });

  return { user, token }; // Return the authenticated user and token
};
