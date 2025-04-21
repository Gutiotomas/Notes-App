import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Retrieve the JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET;

// Throw an error if the JWT secret is not defined
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not defined");
}

// Middleware to authenticate the token in the request
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Extract the authorization header from the request
  const authHeader = req.headers.authorization;

  // Extract the token from the authorization header (if it exists)
  const token = authHeader && authHeader.split(" ")[1];

  // If no token is provided, return a 401 Unauthorized response
  if (!token) return res.status(401).json({ message: "Token required" });

  // Verify the token using the JWT secret
  jwt.verify(token, JWT_SECRET, (err, user) => {
    // If the token is invalid, return a 403 Forbidden response
    if (err) return res.status(403).json({ message: "Invalid token" });

    // Attach the decoded user information to the request object
    // @ts-ignore: Suppress TypeScript error for adding a custom property to the request object
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  });
};
